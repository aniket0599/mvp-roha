import type { AnalyticsEventName } from "./types";

/** Fire an anonymous analytics event from the browser. Never throws. */
export function trackClient(
  name: AnalyticsEventName,
  opts: {
    venueId?: string;
    spaceId?: string;
    targetProfileId?: string;
    category?: string;
  } = {},
): void {
  try {
    const payload = JSON.stringify({ name, ...opts });
    // Prefer sendBeacon so navigations don't drop the event.
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([payload], { type: "application/json" }));
      return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    /* analytics must never break the UX */
  }
}
