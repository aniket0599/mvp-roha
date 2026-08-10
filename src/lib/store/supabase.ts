import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  AnalyticsEvent,
  Connection,
  Profile,
  SocialMode,
  Space,
} from "../types";
import { SEED_SPACES, seedProfiles } from "../seed";
import type { DataStore, SpaceMetrics } from "./DataStore";

// ---------------------------------------------------------------------------
// Supabase (Postgres) store. Activated automatically when SUPABASE_URL and a
// service-role key are set. On first use it self-seeds the Blue Tokai space and
// the sample regulars if the tables are empty, so the experience matches the
// zero-config memory store. Run supabase/schema.sql once before first use.
// ---------------------------------------------------------------------------

let client: SupabaseClient | null = null;
let seeded = false;

function db(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

// ---- row <-> domain mapping ----------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProfile(r: any): Profile {
  return {
    id: r.id,
    spaceId: r.space_id,
    name: r.name,
    age: r.age,
    profession: r.profession,
    avatarEmoji: r.avatar_emoji ?? undefined,
    interests: r.interests ?? [],
    currentActivity: r.current_activity ?? null,
    nowLines: r.now_lines ?? [],
    interesting: r.interesting ?? "",
    askMeAbout: r.ask_me_about ?? [],
    lookingFor: r.looking_for ?? [],
    recently: r.recently ?? "",
    socialMode: r.social_mode,
    visible: r.visible,
    usuallyHere: r.usually_here ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function profileToRow(p: Profile) {
  return {
    id: p.id,
    space_id: p.spaceId,
    name: p.name,
    age: p.age,
    profession: p.profession,
    avatar_emoji: p.avatarEmoji ?? null,
    interests: p.interests,
    current_activity: p.currentActivity,
    now_lines: p.nowLines,
    interesting: p.interesting,
    ask_me_about: p.askMeAbout,
    looking_for: p.lookingFor,
    recently: p.recently,
    social_mode: p.socialMode,
    visible: p.visible,
    usually_here: p.usuallyHere ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  const supabase = db();
  for (const space of SEED_SPACES) {
    await supabase.from("spaces").upsert({
      id: space.id,
      venue_id: space.venueId,
      name: space.name,
      image_url: space.imageUrl ?? null,
    });
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("space_id", space.id);
    if (!count) {
      const rows = seedProfiles(space.id).map((p) => ({ ...profileToRow(p), is_seed: true }));
      await supabase.from("profiles").insert(rows);
    }
  }
  seeded = true;
}

export class SupabaseStore implements DataStore {
  async getSpaceByVenue(venueId: string): Promise<Space | null> {
    await ensureSeeded();
    const { data } = await db()
      .from("spaces")
      .select("*")
      .eq("venue_id", venueId)
      .maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      venueId: data.venue_id,
      name: data.name,
      imageUrl: data.image_url ?? undefined,
    };
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data } = await db().from("profiles").select("*").eq("id", userId).maybeSingle();
    return data ? rowToProfile(data) : null;
  }

  async upsertProfile(profile: Profile): Promise<Profile> {
    await db().from("profiles").upsert(profileToRow(profile));
    return profile;
  }

  async setVisibility(userId: string, visible: boolean): Promise<void> {
    await db()
      .from("profiles")
      .update({ visible, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }

  async setSocialMode(userId: string, mode: SocialMode): Promise<void> {
    await db()
      .from("profiles")
      .update({ social_mode: mode, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }

  async deleteProfile(userId: string): Promise<void> {
    await db().from("profiles").delete().eq("id", userId).eq("is_seed", false);
  }

  async listVisibleProfiles(spaceId: string, excludeUserId?: string): Promise<Profile[]> {
    let q = db()
      .from("profiles")
      .select("*")
      .eq("space_id", spaceId)
      .eq("visible", true)
      .order("updated_at", { ascending: false });
    if (excludeUserId) q = q.neq("id", excludeUserId);
    const { data } = await q;
    return (data ?? []).map(rowToProfile);
  }

  async countVisible(spaceId: string): Promise<number> {
    const { count } = await db()
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("space_id", spaceId)
      .eq("visible", true);
    return count ?? 0;
  }

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    await db().from("analytics_events").insert({
      id: event.id,
      name: event.name,
      user_id: event.userId,
      space_id: event.spaceId,
      target_profile_id: event.targetProfileId ?? null,
      category: event.category ?? null,
      timestamp: event.timestamp,
    });
  }

  async getMetrics(spaceId: string): Promise<SpaceMetrics> {
    const { data } = await db()
      .from("analytics_events")
      .select("name,user_id,target_profile_id")
      .eq("space_id", spaceId);
    const rows = data ?? [];
    const uniqueViews = new Set<string>();
    let profilesViewed = 0;
    let curiosity = 0;
    let interactions = 0;
    let connections = 0;
    let joins = 0;
    for (const e of rows) {
      switch (e.name) {
        case "profile_viewed":
          profilesViewed++;
          uniqueViews.add(`${e.user_id}->${e.target_profile_id}`);
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

  async createConnection(c: Connection): Promise<Connection> {
    await db().from("connections").insert({
      id: c.id,
      user_id: c.userId,
      other_user_id: c.otherUserId,
      other_user_name: c.otherUserName,
      space_id: c.spaceId,
      space_name: c.spaceName,
      types: c.types,
      note: c.note,
      created_at: c.createdAt,
    });
    return c;
  }

  async listConnections(userId: string): Promise<Connection[]> {
    const { data } = await db()
      .from("connections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      otherUserId: r.other_user_id,
      otherUserName: r.other_user_name,
      spaceId: r.space_id,
      spaceName: r.space_name,
      types: r.types ?? [],
      note: r.note ?? "",
      createdAt: r.created_at,
    }));
  }

  async resetSpace(spaceId: string): Promise<void> {
    await db().from("profiles").delete().eq("space_id", spaceId).eq("is_seed", false);
    await db().from("analytics_events").delete().eq("space_id", spaceId);
    await db().from("connections").delete().eq("space_id", spaceId);
  }
}
