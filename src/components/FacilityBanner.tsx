import type { FacilityConfig } from "@/lib/facilities";
import { CafeBanner } from "./CafeBanner";

// The landing banner. The café keeps its hand-drawn scene; other facilities get
// a clean, warm emblem so an espresso machine never shows up at a gym.
export function FacilityBanner({
  facility,
  venueName,
}: {
  facility: FacilityConfig;
  venueName: string;
}) {
  if (facility.type === "cafe") return <CafeBanner venueName={venueName} />;

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-surface-variant bg-surface-container">
      <div className="aspect-[400/240] w-full flex flex-col items-center justify-center gap-3">
        <span className="text-6xl" aria-hidden>
          {facility.emoji}
        </span>
        <span className="text-label-caps font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
          {facility.label}
        </span>
      </div>
    </div>
  );
}
