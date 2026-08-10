"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";
import { SocialModePicker } from "./SocialModePicker";
import type { SocialMode } from "@/lib/types";

// Self-service privacy controls required by the brief: change social mode,
// become invisible, or leave the space entirely.
export function ProfileControls({
  venue,
  initialMode,
  initialVisible,
}: {
  venue: string;
  initialMode: SocialMode;
  initialVisible: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<SocialMode>(initialMode);
  const [visible, setVisible] = useState(initialVisible);
  const [leaving, setLeaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);

  async function changeMode(m: SocialMode) {
    setMode(m);
    await fetch("/api/profile/social-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: m }),
    });
    router.refresh();
  }

  async function toggleVisible() {
    const next = !visible;
    setVisible(next);
    await fetch("/api/profile/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: next }),
    });
    router.refresh();
  }

  async function leave() {
    setLeaving(true);
    await fetch("/api/profile/leave", { method: "POST" });
    router.push(`/join/${venue}`);
    router.refresh();
  }

  return (
    <div className="space-y-stack-md">
      <div className="card p-stack-md">
        <span className="label-caps block mb-stack-sm">Social mode</span>
        <SocialModePicker value={mode} onChange={changeMode} />
      </div>

      <div className="card p-stack-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-body-md text-on-surface font-medium">
              {visible ? "You're discoverable" : "You're hidden"}
            </p>
            <p className="text-label-md text-on-surface-variant">
              {visible
                ? "People here can see your profile."
                : "No one here can see you right now."}
            </p>
          </div>
          <button
            onClick={toggleVisible}
            role="switch"
            aria-checked={visible}
            className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
              visible ? "bg-primary" : "bg-surface-container-highest"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-surface-container-lowest shadow transition-transform ${
                visible ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="btn-secondary"
          onClick={() => router.push(`/space/${venue}/profile/edit`)}
        >
          <Icon name="edit" className="text-[20px]" /> Edit profile
        </button>

        {!confirmLeave ? (
          <button
            className="w-full h-12 rounded-lg text-error font-medium text-label-md flex items-center justify-center gap-2 hover:bg-error-container/40 transition-colors"
            onClick={() => setConfirmLeave(true)}
          >
            <Icon name="logout" className="text-[20px]" /> Leave this space
          </button>
        ) : (
          <div className="card border-error/30 p-stack-md">
            <p className="text-body-md text-on-surface mb-3">
              Leaving removes your profile and hides you from everyone here. You can rejoin
              anytime.
            </p>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => setConfirmLeave(false)}>
                Cancel
              </button>
              <button
                className="w-full h-12 rounded-lg bg-error text-on-error font-medium text-label-md"
                onClick={leave}
                disabled={leaving}
              >
                {leaving ? "Leaving…" : "Leave"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
