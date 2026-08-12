import { notFound } from "next/navigation";
import Link from "next/link";
import { AppBar } from "@/components/AppBar";
import { Icon } from "@/components/Icon";
import { ModeBadge } from "@/components/ModeBadge";
import { ApproachSheet } from "@/components/ApproachSheet";
import { TrackOnView } from "@/components/TrackOnView";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";
import { computeSharedContext, approachReasons, possibleOpenings } from "@/lib/matching";
import { facilityConfig } from "@/lib/facilities";
import { orderedNowLines } from "@/lib/prioritize";

export const dynamic = "force-dynamic";

// Person detail — context first. Shows what they're doing now, what they're
// interested in, why you might want to talk, and natural conversation openers.
export default async function PersonPage({
  params,
}: {
  params: { venue: string; id: string };
}) {
  const store = getStore();
  const space = await store.getSpaceByVenue(params.venue);
  if (!space) notFound();

  const person = await store.getProfile(params.id);
  if (!person || person.spaceId !== space.id || !person.visible) notFound();

  const uid = getUserId();
  const viewer = uid ? await store.getProfile(uid) : null;
  const facility = facilityConfig(space.facilityType);
  const shared = computeSharedContext(viewer, person, facility.priorityCategories);
  const openings = possibleOpenings(shared);
  const reasons = approachReasons(viewer, person, 5, facility.priorityCategories);
  const nowLines = orderedNowLines(person, facility);

  // A "Recently" achievement is the headline signal at gyms, run clubs & events.
  const recentlyBlock = person.recently ? (
    <Section title="Recently">
      <blockquote className="border-l-2 border-outline-variant pl-4 text-body-md italic text-on-surface">
        &ldquo;{person.recently}&rdquo;
      </blockquote>
    </Section>
  ) : null;

  return (
    <div className="min-h-dvh flex flex-col pb-28">
      <TrackOnView name="profile_viewed" venueId={params.venue} targetProfileId={person.id} />
      {shared.length > 0 && (
        <TrackOnView
          name="shared_interest_viewed"
          venueId={params.venue}
          targetProfileId={person.id}
          category={shared[0].category}
        />
      )}
      <AppBar title={person.name} back />

      <main className="flex-1 w-full max-w-phone mx-auto px-margin-mobile pt-2">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-stack-lg">
          <div className="w-24 h-24 rounded-xl bg-surface-container flex items-center justify-center border border-surface-variant text-5xl mb-stack-sm">
            {person.avatarEmoji ?? "🙂"}
          </div>
          <h2 className="font-display text-display-mobile text-primary">
            {person.name}
            {person.age != null && <span>, {person.age}</span>}
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-stack-sm">{person.profession}</p>
          <ModeBadge mode={person.socialMode} />
        </div>

        {/* Right now */}
        {nowLines.length > 0 && (
          <Section title="Right now">
            <ul className="space-y-3">
              {nowLines.map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-xl leading-7">{line.emoji}</span>
                  <span className="text-body-md text-on-surface">{line.text}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* At gyms / run clubs / events, the recent achievement leads. */}
        {facility.emphasizeRecently && recentlyBlock}

        {/* Interested in */}
        {person.interests.length > 0 && (
          <Section title="Interested in">
            <div className="flex flex-wrap gap-2">
              {person.interests.map((i) => (
                <span key={i} className="chip">
                  {i}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Why you might want to talk */}
        {viewer && shared.length > 0 && (
          <div className="mb-stack-md rounded-lg bg-primary text-on-primary p-stack-md">
            <div className="flex items-center gap-2 mb-stack-sm">
              <Icon name="auto_awesome" className="text-inverse-primary" />
              <span className="text-label-caps font-semibold uppercase tracking-[0.1em] text-inverse-primary">
                Why you might want to talk
              </span>
            </div>
            <ul className="space-y-2 mb-stack-sm">
              {shared.map((s) => (
                <li key={s.category} className="flex items-center gap-2 text-on-primary/90">
                  <Icon name="check_circle" className="text-[18px] text-inverse-primary" />
                  <span className="text-body-md">{s.text}</span>
                </li>
              ))}
            </ul>
            {openings.length > 0 && (
              <div className="border-t border-on-primary/15 pt-stack-sm">
                <span className="text-label-caps uppercase tracking-[0.1em] text-inverse-primary block mb-1">
                  Possible opening
                </span>
                <p className="text-body-md italic text-on-primary/90">&ldquo;{openings[0]}&rdquo;</p>
              </div>
            )}
          </div>
        )}

        {viewer && shared.length === 0 && (
          <div className="mb-stack-md card bg-surface-container-low p-stack-md text-on-surface-variant">
            <p className="text-body-md">
              No obvious overlap on paper — which is often where the best conversations start.
              There&rsquo;s a natural opener below.
            </p>
          </div>
        )}

        {!viewer && (
          <div className="mb-stack-md card bg-surface-container-low p-stack-md">
            <p className="text-body-md text-on-surface-variant mb-3">
              Create your profile to see what you have in common with {person.name.split(" ")[0]}.
            </p>
            <Link href={`/join/${params.venue}/create`} className="btn-primary">
              Create my profile
            </Link>
          </div>
        )}

        {/* Recently (in its usual spot unless the facility already led with it) */}
        {!facility.emphasizeRecently && recentlyBlock}

        {/* Ask me about */}
        {person.askMeAbout.length > 0 && (
          <Section title="Ask me about">
            <ul className="space-y-2">
              {person.askMeAbout.map((a) => (
                <li key={a} className="flex items-center gap-2 text-body-md text-on-surface">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-surface-variant px-margin-mobile py-3">
        <div className="max-w-phone mx-auto">
          <ApproachSheet
            venue={params.venue}
            targetId={person.id}
            targetName={person.name}
            reasons={reasons}
          />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-stack-md card p-stack-md">
      <span className="label-caps block mb-stack-sm">{title}</span>
      {children}
    </div>
  );
}
