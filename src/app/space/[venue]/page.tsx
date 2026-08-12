import Link from "next/link";
import { notFound } from "next/navigation";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { PersonCard } from "@/components/PersonCard";
import { VenueClock } from "@/components/VenueClock";
import { TrackOnView } from "@/components/TrackOnView";
import { Icon } from "@/components/Icon";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";
import { toPublicProfile } from "@/lib/present";
import { computeSharedContext } from "@/lib/matching";
import { facilityConfig } from "@/lib/facilities";
import { facilityRelevance } from "@/lib/prioritize";

export const dynamic = "force-dynamic";

// The primary screen — a grid of contextual profile cards for everyone who has
// chosen to be discoverable here.
export default async function SpacePage({
  params,
}: {
  params: { venue: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const uid = getUserId();
  const viewer = uid ? await store.getProfile(uid) : null;
  const facility = facilityConfig(space.facilityType);
  const rawPeople = await store.listVisibleProfiles(space.id, uid ?? undefined);
  // Order the grid so the people most relevant to *this* facility surface first.
  const people = [...rawPeople].sort(
    (a, b) => facilityRelevance(b, facility) - facilityRelevance(a, facility),
  );

  return (
    <div className="min-h-dvh flex flex-col pb-24">
      <TrackOnView name="people_screen_viewed" venueId={params.venue} />
      <AppBar />
      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        <div className="mb-stack-md border-b border-surface-variant pb-stack-md">
          <div className="mb-unit flex items-center gap-2 flex-wrap">
            <VenueClock venueName={space.name} />
            <span className="inline-flex items-center gap-1 text-label-md text-on-surface-variant">
              <span aria-hidden>·</span>
              {facility.emoji} {facility.label}
            </span>
          </div>
          <h2 className="font-display text-display-mobile text-primary mb-1">
            {facility.discoverTitle}
          </h2>
          <p className="text-body-lg text-on-surface-variant">
            {people.length} {people.length === 1 ? "person is" : "people are"} discoverable here
          </p>
        </div>

        {!viewer && (
          <div className="mb-stack-md card bg-surface-container-low p-stack-md">
            <div className="flex items-start gap-3">
              <Icon name="visibility_off" className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-body-md text-on-surface font-medium mb-1">
                  You&rsquo;re browsing privately.
                </p>
                <p className="text-body-md text-on-surface-variant mb-3">
                  Others can&rsquo;t see you. Create a profile to become discoverable and to see
                  what you have in common with people here.
                </p>
                <Link href={`/join/${params.venue}/create`} className="btn-primary">
                  Create my profile
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-gutter">
          {people.map((p) => (
            <PersonCard
              key={p.id}
              venue={params.venue}
              person={toPublicProfile(p)}
              facility={facility}
              shared={computeSharedContext(viewer, p, facility.priorityCategories)}
            />
          ))}
        </div>

        {people.length === 0 && (
          <div className="text-center py-stack-lg text-on-surface-variant">
            <Icon name="radar" className="text-4xl text-outline mb-3" />
            <p className="text-body-lg">No one else is discoverable just yet.</p>
            <p className="text-body-md text-outline">Check back in a little while.</p>
          </div>
        )}
      </main>
      <BottomNav venue={params.venue} active="around" />
    </div>
  );
}
