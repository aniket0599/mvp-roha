import { SOCIAL_MODES, type SocialMode } from "@/lib/types";

// Understated availability badge. States how open someone is — never inferred,
// never romantic.
export function ModeBadge({ mode, short = false }: { mode: SocialMode; short?: boolean }) {
  const m = SOCIAL_MODES[mode];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-low border border-surface-variant px-2.5 py-1 text-label-md text-on-surface-variant">
      <span className="leading-none text-[10px]">{m.dot}</span>
      {short ? m.short : m.label}
    </span>
  );
}
