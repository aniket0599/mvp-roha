import type { DataStore } from "./DataStore";
import { MemoryStore } from "./memory";

export type { DataStore, SpaceMetrics } from "./DataStore";

let instance: DataStore | null = null;

/**
 * Returns the active store. Uses Supabase when SUPABASE_URL is configured,
 * otherwise the zero-config in-memory store (seeded, resets on restart).
 */
export function getStore(): DataStore {
  if (instance) return instance;
  if (process.env.SUPABASE_URL) {
    // Loaded lazily so the memory-only path never pulls in the Supabase client.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SupabaseStore } = require("./supabase") as typeof import("./supabase");
    instance = new SupabaseStore();
  } else {
    instance = new MemoryStore();
  }
  return instance;
}

export function usingSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL);
}
