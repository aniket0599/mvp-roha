import type {
  AnalyticsEvent,
  Connection,
  Profile,
  SocialMode,
  Space,
} from "../types";
import { SEED_SPACES, seedProfilesForSpace } from "../seed";
import type { DataStore, SpaceMetrics } from "./DataStore";

// ---------------------------------------------------------------------------
// In-memory store. Zero-config: the app runs and demos immediately, seeded
// with the Blue Tokai space and 14 profiles. State lives for the lifetime of
// the server process. For a real multi-device experiment set the Supabase env
// vars (see README) so state is shared and durable.
//
// A module-level singleton, guarded on globalThis so it survives Next.js dev
// hot-reloads.
// ---------------------------------------------------------------------------

interface MemoryState {
  spaces: Map<string, Space>;
  profiles: Map<string, Profile>; // keyed by userId
  events: AnalyticsEvent[];
  connections: Connection[];
  seedProfileIds: Set<string>;
}

function createState(): MemoryState {
  const spaces = new Map<string, Space>();
  const profiles = new Map<string, Profile>();
  const seedProfileIds = new Set<string>();

  for (const space of SEED_SPACES) {
    spaces.set(space.id, space);
    for (const p of seedProfilesForSpace(space)) {
      profiles.set(p.id, p);
      seedProfileIds.add(p.id);
    }
  }

  return { spaces, profiles, events: [], connections: [], seedProfileIds };
}

const globalForStore = globalThis as unknown as { __aroundState?: MemoryState };
const state: MemoryState = globalForStore.__aroundState ?? createState();
if (!globalForStore.__aroundState) globalForStore.__aroundState = state;

export class MemoryStore implements DataStore {
  async getSpaceByVenue(venueId: string): Promise<Space | null> {
    for (const space of state.spaces.values()) {
      if (space.venueId === venueId) return space;
    }
    return null;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    return state.profiles.get(userId) ?? null;
  }

  async upsertProfile(profile: Profile): Promise<Profile> {
    state.profiles.set(profile.id, profile);
    return profile;
  }

  async setVisibility(userId: string, visible: boolean): Promise<void> {
    const p = state.profiles.get(userId);
    if (p) {
      p.visible = visible;
      p.updatedAt = new Date().toISOString();
    }
  }

  async setSocialMode(userId: string, mode: SocialMode): Promise<void> {
    const p = state.profiles.get(userId);
    if (p) {
      p.socialMode = mode;
      p.updatedAt = new Date().toISOString();
    }
  }

  async deleteProfile(userId: string): Promise<void> {
    // Never delete seed profiles; a real participant leaving just disappears.
    if (state.seedProfileIds.has(userId)) return;
    state.profiles.delete(userId);
  }

  async listVisibleProfiles(spaceId: string, excludeUserId?: string): Promise<Profile[]> {
    const out: Profile[] = [];
    for (const p of state.profiles.values()) {
      if (p.spaceId !== spaceId) continue;
      if (!p.visible) continue;
      if (excludeUserId && p.id === excludeUserId) continue;
      out.push(p);
    }
    // Real participants first (most recent), then seed regulars.
    return out.sort((a, b) => {
      const aSeed = state.seedProfileIds.has(a.id) ? 1 : 0;
      const bSeed = state.seedProfileIds.has(b.id) ? 1 : 0;
      if (aSeed !== bSeed) return aSeed - bSeed;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }

  async countVisible(spaceId: string): Promise<number> {
    let n = 0;
    for (const p of state.profiles.values()) {
      if (p.spaceId === spaceId && p.visible) n++;
    }
    return n;
  }

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    state.events.push(event);
  }

  async getMetrics(spaceId: string): Promise<SpaceMetrics> {
    const events = state.events.filter((e) => e.spaceId === spaceId);
    const uniqueViews = new Set<string>();
    let profilesViewed = 0;
    let curiosity = 0;
    let interactions = 0;
    let connections = 0;
    let joins = 0;
    for (const e of events) {
      switch (e.name) {
        case "profile_viewed":
          profilesViewed++;
          uniqueViews.add(`${e.userId}->${e.targetProfileId}`);
          break;
        case "curiosity_selected":
          curiosity++;
          break;
        case "interaction_recorded":
          interactions++;
          break;
        case "connection_created":
          connections++;
          break;
        case "space_joined":
          joins++;
          break;
      }
    }
    return {
      participants: await this.countVisible(spaceId),
      profilesViewed,
      uniqueProfileViews: uniqueViews.size,
      curiosityActions: curiosity,
      interactionsRecorded: interactions,
      connections,
      spaceJoins: joins,
    };
  }

  async createConnection(connection: Connection): Promise<Connection> {
    state.connections.push(connection);
    return connection;
  }

  async listConnections(userId: string): Promise<Connection[]> {
    return state.connections
      .filter((c) => c.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async resetSpace(spaceId: string): Promise<void> {
    for (const [id, p] of state.profiles) {
      if (p.spaceId === spaceId && !state.seedProfileIds.has(id)) {
        state.profiles.delete(id);
      }
    }
    state.events = state.events.filter((e) => e.spaceId !== spaceId);
    state.connections = state.connections.filter((c) => c.spaceId !== spaceId);
  }
}
