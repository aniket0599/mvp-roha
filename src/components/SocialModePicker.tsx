"use client";

import { SOCIAL_MODES, type SocialMode } from "@/lib/types";

// Three mutually-exclusive presence modes. Deliberately never implies romantic
// interest — only how open someone is to being approached.
export function SocialModePicker({
  value,
  onChange,
}: {
  value: SocialMode;
  onChange: (m: SocialMode) => void;
}) {
  return (
    <div className="space-y-2">
      {(Object.keys(SOCIAL_MODES) as SocialMode[]).map((mode) => {
        const selected = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/5"
                : "border-outline-variant hover:bg-surface-container"
            }`}
          >
            <span className="text-lg leading-none">{SOCIAL_MODES[mode].dot}</span>
            <span className="text-body-md text-on-surface flex-1">
              {SOCIAL_MODES[mode].label}
            </span>
            {selected && (
              <span className="material-symbols-outlined filled text-primary text-[20px]">
                check_circle
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
