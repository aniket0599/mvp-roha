"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Admin-only: wipe participant data for a fresh experiment run.
export function ResetExperiment({ venue }: { venue: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function reset() {
    setBusy(true);
    await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueId: venue }),
    });
    setBusy(false);
    setConfirm(false);
    router.refresh();
  }

  if (!confirm) {
    return (
      <button
        className="text-label-md text-error hover:underline"
        onClick={() => setConfirm(true)}
      >
        Reset experiment data
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-label-md text-on-surface-variant">
        Clear all participant profiles, events &amp; connections?
      </span>
      <button className="text-label-md text-on-surface-variant" onClick={() => setConfirm(false)}>
        Cancel
      </button>
      <button className="text-label-md text-error font-semibold" onClick={reset} disabled={busy}>
        {busy ? "Resetting…" : "Confirm reset"}
      </button>
    </div>
  );
}
