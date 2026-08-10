import { getStore } from "./store";
import type { AnalyticsEventName } from "./types";

/**
 * Record a single anonymous behavioural event. Captures only: an anonymous
 * user id, the venue, a timestamp, and (optionally) a target profile id and a
 * category. No personal data. Fire-and-forget; never blocks the user.
 */
export async function track(
  name: AnalyticsEventName,
  opts: {
    userId: string | null;
    spaceId: string | null;
    targetProfileId?: string | null;
    category?: string | null;
  },
): Promise<void> {
  try {
    await getStore().recordEvent({
      id: `e_${crypto.randomUUID()}`,
      name,
      userId: opts.userId ?? null,
      spaceId: opts.spaceId ?? null,
      targetProfileId: opts.targetProfileId ?? null,
      category: opts.category ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Analytics must never break the product experience.
  }
}

export const ANALYTICS_EVENTS: AnalyticsEventName[] = [
  "space_joined",
  "profile_created",
  "people_screen_viewed",
  "profile_viewed",
  "shared_interest_viewed",
  "conversation_catalyst_viewed",
  "curiosity_selected",
  "interaction_recorded",
  "contact_exchanged",
  "connection_created",
];
