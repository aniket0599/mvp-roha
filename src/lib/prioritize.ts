import type { CurrentActivity, Profile, PublicProfile } from "./types";
import type { FacilityConfig, PrimaryTag } from "./facilities";
import { relevanceScore } from "./matching";

// Facility-aware ordering of a profile's content. The data is identical for
// every facility; these helpers only decide what leads.

type AnyProfile = Profile | PublicProfile;

function lineScore(
  line: { emoji: string; text: string },
  cfg: FacilityConfig,
): number {
  let s = relevanceScore(line.text, [], cfg.priorityCategories);
  // Nudge lines that describe a facility-relevant current activity.
  for (const a of cfg.priorityActivities) {
    if (line.text.toLowerCase().includes(a.toLowerCase())) s += 0.5;
  }
  return s;
}

/** Now-lines with the facility-relevant ones first (stable for ties). */
export function orderedNowLines(
  person: AnyProfile,
  cfg: FacilityConfig,
): { emoji: string; text: string }[] {
  return person.nowLines
    .map((line, i) => ({ line, i, score: lineScore(line, cfg) }))
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.line);
}

/** Interests with the facility-relevant ones first. */
export function orderedInterests(person: AnyProfile, cfg: FacilityConfig): string[] {
  const priority = cfg.priorityCategories.map((c) => c.toLowerCase());
  return [...person.interests].sort((a, b) => {
    const ai = priority.indexOf(a.toLowerCase());
    const bi = priority.indexOf(b.toLowerCase());
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

const TAG_LABEL: Record<PrimaryTag, string> = {
  lookingFor: "Looking for",
  askMeAbout: "Ask me about",
  interests: "Interested in",
};

/** The chip group a card should lead with for this facility (with a fallback). */
export function primaryTagGroup(
  person: AnyProfile,
  cfg: FacilityConfig,
): { label: string; tags: string[] } {
  const groups: Record<PrimaryTag, string[]> = {
    lookingFor: person.lookingFor ?? [],
    askMeAbout: person.askMeAbout ?? [],
    interests: person.interests ?? [],
  };
  const order: PrimaryTag[] = [cfg.primaryTag, "askMeAbout", "lookingFor", "interests"];
  for (const key of order) {
    if (groups[key] && groups[key].length) {
      return { label: TAG_LABEL[key], tags: groups[key] };
    }
  }
  return { label: TAG_LABEL[cfg.primaryTag], tags: [] };
}

/** How relevant a person is to the facility — used to order the discovery grid. */
export function facilityRelevance(person: AnyProfile, cfg: FacilityConfig): number {
  const text = [
    person.profession,
    ...person.interests,
    ...person.nowLines.map((l) => l.text),
    ...person.askMeAbout,
  ].join(" • ");
  let score = relevanceScore(text, person.interests, cfg.priorityCategories);
  if (person.nowLines.some((l) => lineScore(l, cfg) > 0)) score += 0.5;
  const activityRelevant = (a: CurrentActivity | null) =>
    a != null && cfg.priorityActivities.includes(a);
  if ("currentActivity" in person && activityRelevant((person as Profile).currentActivity))
    score += 0.5;
  return score;
}
