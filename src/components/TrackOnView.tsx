"use client";

import { useEffect, useRef } from "react";
import { trackClient } from "@/lib/track-client";
import type { AnalyticsEventName } from "@/lib/types";

// Fires a single analytics event when a screen mounts.
export function TrackOnView({
  name,
  venueId,
  targetProfileId,
  category,
}: {
  name: AnalyticsEventName;
  venueId?: string;
  targetProfileId?: string;
  category?: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackClient(name, { venueId, targetProfileId, category });
  }, [name, venueId, targetProfileId, category]);
  return null;
}
