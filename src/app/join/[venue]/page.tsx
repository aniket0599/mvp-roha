import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { FacilityBanner } from "@/components/FacilityBanner";
import { VenueClock } from "@/components/VenueClock";
import { JoinActions } from "@/components/JoinActions";
import { Icon } from "@/components/Icon";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";
import { facilityConfig } from "@/lib/facilities";

export const dynamic = "force-dynamic";

// Flow A — the screen a participant lands on after scanning the venue QR code.
export default async function JoinPage({ params }: { params: { venue: string } }) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const count = await store.countVisible(space.id);
  const uid = getUserId();
  const existing = uid ? await store.getProfile(uid) : null;
  const hasProfile = Boolean(existing);
  const facility = facilityConfig(space.facilityType);
  const tagline = space.tagline ?? facility.tagline;

  return (
    <div className="min-h-dvh flex flex-col">
      <AppBar back href="/" />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2 pb-stack-lg">
        <div className="mb-stack-md">
          <VenueClock venueName={space.name} chip />
        </div>

        <div className="mb-stack-lg">
          <FacilityBanner facility={facility} venueName={space.name} />
        </div>

        <div className="flex items-center gap-1.5 text-label-caps font-semibold uppercase tracking-[0.1em] text-on-surface-variant mb-2">
          <span aria-hidden>{facility.emoji}</span>
          {facility.label}
        </div>
        <h2 className="font-display text-display-mobile text-primary mb-3">
          You&rsquo;re at {space.name}
        </h2>
        <p className="text-body-lg text-on-surface-variant mb-2">{tagline}</p>
        <p className="text-body-lg text-on-surface-variant mb-stack-lg">
          {count} {count === 1 ? "person is" : "people are"} here. Discover who&rsquo;s around you.
        </p>

        <JoinActions venue={params.venue} hasProfile={hasProfile} />

        <div className="mt-stack-lg card bg-surface-container-low p-stack-md flex gap-3">
          <Icon name="shield" className="text-primary mt-0.5 shrink-0" />
          <p className="text-body-md text-on-surface-variant">
            When you join, people who have also chosen to be discoverable here can see your
            profile. Physical presence does not automatically make you visible.
          </p>
        </div>
      </main>
    </div>
  );
}
