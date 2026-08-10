"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { trackClient } from "@/lib/track-client";
import { INTERACTION_TYPES, type InteractionType } from "@/lib/types";
import type { ApproachReason as Reason } from "@/lib/matching";

type Step = "reasons" | "catalyst" | "record" | "done";

// Conversation catalysts + optional interaction recording. There is no in-app
// chat — the conversation is meant to happen in the physical world. The app only
// helps the user find a natural way to say hello, then gets out of the way.
export function ApproachSheet({
  venue,
  targetId,
  targetName,
  reasons,
}: {
  venue: string;
  targetId: string;
  targetName: string;
  reasons: Reason[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(reasons.length ? "reasons" : "record");
  const [chosen, setChosen] = useState<Reason | null>(null);
  const [types, setTypes] = useState<InteractionType[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function start() {
    setOpen(true);
    setStep(reasons.length ? "reasons" : "record");
    setChosen(null);
  }

  function pickReason(r: Reason) {
    setChosen(r);
    setStep("catalyst");
    trackClient("curiosity_selected", { venueId: venue, targetProfileId: targetId, category: r.category });
    trackClient("conversation_catalyst_viewed", {
      venueId: venue,
      targetProfileId: targetId,
      category: r.category,
    });
  }

  function toggleType(t: InteractionType) {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function saveInteraction() {
    setBusy(true);
    try {
      await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue, otherUserId: targetId, otherUserName: targetName, types, note }),
      });
      setStep("done");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button className="btn-primary" onClick={start}>
        <Icon name="chat_bubble" className="text-[20px]" />
        Start a conversation
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div
            className="absolute inset-0 bg-inverse-surface/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-phone bg-surface-container-lowest rounded-t-xl sm:rounded-xl border border-surface-variant max-h-[88dvh] overflow-y-auto">
            <div className="sticky top-0 bg-surface-container-lowest flex items-center justify-between px-margin-mobile py-3 border-b border-surface-variant">
              <span className="label-caps">
                {step === "record" || step === "done" ? "Did you meet?" : "Ways to say hello"}
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="px-margin-mobile py-stack-md">
              {step === "reasons" && (
                <>
                  <h3 className="font-display text-headline text-primary mb-1">
                    Why you might want to talk
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-md">
                    Pick something that feels natural to {targetName.split(" ")[0]}.
                  </p>
                  <div className="space-y-2">
                    {reasons.map((r) => (
                      <button
                        key={r.category}
                        onClick={() => pickReason(r)}
                        className="w-full flex items-center gap-3 rounded-lg border border-outline-variant px-4 py-3 text-left hover:bg-surface-container transition-colors"
                      >
                        <span className="text-xl">{r.emoji}</span>
                        <span className="flex-1">
                          <span className="text-body-md text-on-surface block">{r.label}</span>
                          {r.shared && (
                            <span className="text-label-md text-primary">You share this</span>
                          )}
                        </span>
                        <Icon name="chevron_right" className="text-on-surface-variant" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === "catalyst" && chosen && (
                <>
                  <button
                    onClick={() => setStep("reasons")}
                    className="text-label-md text-on-surface-variant flex items-center gap-1 mb-stack-sm"
                  >
                    <Icon name="arrow_back" className="text-[18px]" /> Other reasons
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{chosen.emoji}</span>
                    <h3 className="font-display text-headline text-primary">{chosen.category}</h3>
                  </div>
                  <p className="text-body-md text-on-surface-variant mb-stack-md">
                    A few natural openings. Say whichever feels like you.
                  </p>
                  <ul className="space-y-2 mb-stack-md">
                    {chosen.questions.map((q) => (
                      <li
                        key={q}
                        className="rounded-lg bg-surface-container-low border border-surface-variant px-4 py-3 text-body-md text-on-surface"
                      >
                        &ldquo;{q}&rdquo;
                      </li>
                    ))}
                  </ul>
                  <p className="text-label-md text-outline mb-stack-md">
                    Around won&rsquo;t send anything. The conversation happens in person.
                  </p>
                  <button className="btn-secondary" onClick={() => setStep("record")}>
                    We talked — save this
                  </button>
                </>
              )}

              {step === "record" && (
                <>
                  <h3 className="font-display text-headline text-primary mb-1">
                    Did you meet {targetName.split(" ")[0]}?
                  </h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-md">
                    Optional — this helps us learn what makes a good hello.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-stack-md">
                    {INTERACTION_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleType(t)}
                        className={`chip-selectable ${types.includes(t) ? "chip-selected" : ""}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <textarea
                    className="field-textarea mb-stack-md"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What did you talk about?"
                  />
                  <button className="btn-primary" onClick={saveInteraction} disabled={busy}>
                    {busy ? "Saving…" : "Save to Connections"}
                  </button>
                </>
              )}

              {step === "done" && (
                <div className="text-center py-stack-md">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-stack-sm">
                    <Icon name="check" className="text-primary text-[28px]" />
                  </div>
                  <h3 className="font-display text-headline text-primary mb-1">Saved.</h3>
                  <p className="text-body-md text-on-surface-variant mb-stack-md">
                    {targetName.split(" ")[0]} is in your Connections.
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/space/${venue}/connections`);
                      router.refresh();
                    }}
                  >
                    See Connections
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
