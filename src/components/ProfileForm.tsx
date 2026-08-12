"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CURRENT_ACTIVITIES,
  INTERESTS,
  LOOKING_FOR_OPTIONS,
  type CurrentActivity,
} from "@/lib/types";
import type { ProfileFormInitial } from "@/lib/profileFormModel";
import { SocialModePicker } from "./SocialModePicker";
import { Icon } from "./Icon";

function toggle(list: string[], value: string, max?: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (max && list.length >= max) return list;
  return [...list, value];
}

export interface FormPrompts {
  interestingPrompt: string;
  interestingPlaceholder: string;
  askPrompt: string;
  askPlaceholder: string;
}

const DEFAULT_PROMPTS: FormPrompts = {
  interestingPrompt: "Tell people something interesting",
  interestingPlaceholder:
    "Started running 6 months ago and still struggle with long runs. Getting there.",
  askPrompt: "Ask me about…",
  askPlaceholder: "Japan travel, HYROX, sociology of technology",
};

export function ProfileForm({
  venue,
  initial,
  mode,
  prompts = DEFAULT_PROMPTS,
}: {
  venue: string;
  initial: ProfileFormInitial;
  mode: "create" | "edit";
  prompts?: FormPrompts;
}) {
  const router = useRouter();
  const [f, setF] = useState<ProfileFormInitial>(initial);
  const [customInterest, setCustomInterest] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ othersCount: number } | null>(null);

  const interestOptions = useMemo(() => {
    const extra = f.interests.filter((i) => !INTERESTS.includes(i));
    return [...INTERESTS, ...extra];
  }, [f.interests]);

  const valid =
    f.name.trim().length > 0 &&
    f.profession.trim().length > 0 &&
    f.interests.length >= 3 &&
    f.currentActivity !== "";

  async function submit() {
    setError(null);
    if (!valid) {
      setError("Add your name, what you do, and at least 3 interests.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue, ...f }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong");
      if (mode === "edit") {
        router.push(`/space/${venue}/profile`);
        router.refresh();
      } else {
        setDone({ othersCount: data.othersCount ?? 0 });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  // "You're in." interstitial (Flow A) shown after a fresh profile is created.
  if (done) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-margin-mobile text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-stack-md">
          <Icon name="check" className="text-primary text-[32px]" />
        </div>
        <h2 className="font-display text-display-mobile text-primary mb-3">You&rsquo;re in.</h2>
        <p className="text-body-lg text-on-surface-variant mb-stack-lg">
          {done.othersCount} {done.othersCount === 1 ? "person is" : "people are"} around you.
        </p>
        <div className="w-full max-w-phone">
          <button className="btn-primary" onClick={() => router.push(`/space/${venue}`)}>
            See who&rsquo;s around
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40">
      <Field label="Name">
        <input
          className="field-input"
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
          placeholder="Aniket"
          autoComplete="off"
        />
      </Field>

      <Field label="Age">
        <input
          className="field-input"
          value={f.age}
          onChange={(e) => setF({ ...f, age: e.target.value.replace(/\D/g, "").slice(0, 3) })}
          placeholder="27"
          inputMode="numeric"
        />
      </Field>

      <Field label="Profession / identity">
        <input
          className="field-input"
          value={f.profession}
          onChange={(e) => setF({ ...f, profession: e.target.value })}
          placeholder="Robotics Engineer"
          autoComplete="off"
        />
      </Field>

      <Field label="Interests" hint={`Choose 3–5 · ${f.interests.length} selected`}>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => {
            const on = f.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                className={`chip-selectable ${on ? "chip-selected" : ""}`}
                onClick={() => setF({ ...f, interests: toggle(f.interests, interest, 5) })}
              >
                {interest}
              </button>
            );
          })}
          {!showCustom ? (
            <button
              type="button"
              className="chip-selectable"
              onClick={() => setShowCustom(true)}
            >
              <Icon name="add" className="text-[18px] mr-1" /> Add more
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-3 py-1">
              <input
                autoFocus
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = customInterest.trim();
                    if (v && f.interests.length < 5)
                      setF({ ...f, interests: [...f.interests, v] });
                    setCustomInterest("");
                    setShowCustom(false);
                  }
                }}
                placeholder="Add interest"
                className="bg-transparent text-body-md focus:outline-none w-28"
              />
            </span>
          )}
        </div>
      </Field>

      <Field label="What are you currently doing?">
        <div className="relative">
          <select
            className="field-input appearance-none pr-8"
            value={f.currentActivity}
            onChange={(e) =>
              setF({ ...f, currentActivity: e.target.value as CurrentActivity })
            }
          >
            <option value="" disabled>
              Select one…
            </option>
            {CURRENT_ACTIVITIES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <Icon
            name="expand_more"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
        </div>
      </Field>

      <Field label={prompts.interestingPrompt}>
        <textarea
          className="field-textarea"
          rows={3}
          value={f.interesting}
          onChange={(e) => setF({ ...f, interesting: e.target.value })}
          placeholder={prompts.interestingPlaceholder}
        />
      </Field>

      <Field label={prompts.askPrompt} hint="Separate topics with commas">
        <textarea
          className="field-textarea"
          rows={2}
          value={f.askMeAbout}
          onChange={(e) => setF({ ...f, askMeAbout: e.target.value })}
          placeholder={prompts.askPlaceholder}
        />
      </Field>

      <Field label="Looking for" hint="Optional">
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map((opt) => {
            const on = f.lookingFor.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                className={`chip-selectable ${on ? "chip-selected" : ""}`}
                onClick={() => setF({ ...f, lookingFor: toggle(f.lookingFor, opt) })}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Social mode">
        <SocialModePicker
          value={f.socialMode}
          onChange={(m) => setF({ ...f, socialMode: m })}
        />
        <p className="text-label-md text-outline mt-2">
          You can change this anytime. Around never signals romantic interest.
        </p>
      </Field>

      {error && (
        <p className="text-label-md text-error mt-stack-sm" role="alert">
          {error}
        </p>
      )}

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-surface-variant px-margin-mobile py-3">
        <div className="max-w-phone mx-auto">
          <button className="btn-primary" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : mode === "edit" ? "Save changes" : "Finish profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-stack-md">
      <div className="flex items-baseline justify-between mb-2">
        <span className="label-caps">{label}</span>
        {hint && <span className="text-label-md text-outline">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
