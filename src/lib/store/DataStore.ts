import type {
  AnalyticsEvent,
  Connection,
  Profile,
  SocialMode,
  Space,
} from "../types";

export interface SpaceMetrics {
  participants: number;
  profilesViewed: number;
  uniqueProfileViews: number;
  curiosityActions: number;
  interactionsRecorded: number;
  connections: number;
  spaceJoins: number;
}

/**
 * The single persistence contract for Around. Two implementations exist:
 *   - MemoryStore  (default; seeded, zero-config, great for local + demo)
 *   - SupabaseStore (used automatically when SUPABASE env vars are present)
 */
export interface DataStore {
  getSpaceByVenue(venueId: string): Promise<Space | null>;

  getProfile(userId: string): Promise<Profile | null>;
  upsertProfile(profile: Profile): Promise<Profile>;
  setVisibility(userId: string, visible: boolean): Promise<void>;
  setSocialMode(userId: string, mode: SocialMode): Promise<void>;
  /** Remove the participant's profile from the space entirely. */
  deleteProfile(userId: string): Promise<void>;

  /** Visible profiles in a space, excluding the given user. */
  listVisibleProfiles(spaceId: string, excludeUserId?: string): Promise<Profile[]>;
  countVisible(spaceId: string): Promise<number>;

  recordEvent(event: AnalyticsEvent): Promise<void>;
  getMetrics(spaceId: string): Promise<SpaceMetrics>;

  createConnection(connection: Connection): Promise<Connection>;
  listConnections(userId: string): Promise<Connection[]>;

  /** Admin: clear all *participant-created* data for a space (keeps seed profiles). */
  resetSpace(spaceId: string): Promise<void>;
}
