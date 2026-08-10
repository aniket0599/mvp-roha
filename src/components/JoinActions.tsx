"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackClient } from "@/lib/track-client";

// The two landing CTAs. "Join" records the space_joined event and routes to
// profile creation (or straight into the space if a profile already exists).
export function JoinActions({
  venue,
  hasProfile,
}: {
  venue: string;
  hasProfile: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function join() {
    setBusy(true);
    try {
      await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue }),
      });
    } catch {
      /* proceed regardless */
    }
    router.push(hasProfile ? `/space/${venue}` : `/join/${venue}/create`);
  }

  function stayPrivate() {
    trackClient("people_screen_viewed", { venueId: venue });
    router.push(`/space/${venue}?private=1`);
  }

  return (
    <div className="space-y-stack-sm">
      <button className="btn-primary" onClick={join} disabled={busy}>
        {hasProfile ? "Enter this space" : "Join this space"}
      </button>
      <button className="btn-secondary" onClick={stayPrivate} disabled={busy}>
        Stay private
      </button>
    </div>
  );
}
