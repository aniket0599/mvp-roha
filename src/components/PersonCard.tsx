import Link from "next/link";
import type { PublicProfile, SharedContext } from "@/lib/types";
import type { FacilityConfig } from "@/lib/facilities";
import { orderedNowLines, primaryTagGroup } from "@/lib/prioritize";
import { ModeBadge } from "./ModeBadge";

// A contextual discovery card. It should immediately answer:
// "Why might this person be interesting to me?" — no swiping, no photo priority.
// Which signals lead is decided by the facility (a gym leads with training,
// a library with what they're reading, and so on).
export function PersonCard({
  venue,
  person,
  facility,
  shared,
}: {
  venue: string;
  person: PublicProfile;
  facility: FacilityConfig;
  shared?: SharedContext[];
}) {
  const { label: tagsLabel, tags: allTags } = primaryTagGroup(person, facility);
  const tags = allTags.slice(0, 3);
  const nowLines = orderedNowLines(person, facility);

  return (
    <article className="card p-stack-md flex flex-col">
      <div className="flex justify-between items-start gap-3 mb-stack-sm">
        <div>
          <h3 className="font-display text-headline text-primary leading-tight">
            {person.name}
            {person.age != null && <span>, {person.age}</span>}
          </h3>
          <p className="text-body-md text-on-surface-variant mt-0.5">{person.profession}</p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center border border-surface-variant shrink-0 text-2xl">
          {person.avatarEmoji ?? "🙂"}
        </div>
      </div>

      <ul className="space-y-2 mb-stack-md flex-1">
        {nowLines.slice(0, 3).map((line, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="text-[18px] leading-6 shrink-0">{line.emoji}</span>
            <span className="text-body-md text-on-surface">{line.text}</span>
          </li>
        ))}
      </ul>

      {shared && shared.length > 0 && (
        <div className="mb-stack-sm flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2">
          <span className="text-[16px]">{shared[0].emoji}</span>
          <span className="text-label-md text-primary font-medium">
            {shared.length === 1
              ? shared[0].text
              : `${shared.length} things in common`}
          </span>
        </div>
      )}

      {tags.length > 0 && (
        <div className="border-t border-surface-variant pt-stack-sm mb-stack-md">
          <span className="label-caps block mb-2">{tagsLabel}</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mb-stack-md">
        <ModeBadge mode={person.socialMode} short />
        {person.usuallyHere && (
          <span className="text-label-md text-outline">Usually here · {person.usuallyHere}</span>
        )}
      </div>

      <Link href={`/space/${venue}/p/${person.id}`} className="btn-primary">
        See profile
      </Link>
    </article>
  );
}
