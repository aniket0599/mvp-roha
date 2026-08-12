import type { Catalyst, Profile, PublicProfile, SharedContext } from "./types";

// ---------------------------------------------------------------------------
// "Why you might want to talk" — reveal shared *context*, never a score.
//
// Principle from the brief: reduce social uncertainty by surfacing genuine
// common ground, then offer conversation catalysts (open questions), never
// scripted pickup lines and never an inference about how someone feels.
// ---------------------------------------------------------------------------

interface CategoryDef {
  category: string;
  emoji: string;
  // phrasing for a shared interest / activity ("You both …")
  both: string;
  // keywords that, if found in either profile's text, signal this category
  keywords: string[];
  // matching interest labels (lowercased)
  interests: string[];
  questions: string[];
}

const CATEGORIES: CategoryDef[] = [
  {
    category: "Running",
    emoji: "🏃",
    both: "You both run",
    keywords: ["run", "running", "marathon", "hyrox", "half marathon"],
    interests: ["running"],
    questions: [
      "How did you get into running?",
      "What are you training for right now?",
      "Any routes around here you love?",
    ],
  },
  {
    category: "Fitness",
    emoji: "🏋️",
    both: "You're both into training",
    keywords: ["powerlifting", "strength", "deadlift", "yoga", "training", "gym"],
    interests: ["fitness"],
    questions: [
      "What does your training look like these days?",
      "How did you get started with it?",
    ],
  },
  {
    category: "Japan",
    emoji: "✈️",
    both: "You're both interested in Japan",
    keywords: ["japan", "tokyo", "ramen"],
    interests: [],
    questions: [
      "Have you already planned your Japan trip?",
      "Where in Japan are you hoping to go?",
      "Any Tokyo recommendations?",
    ],
  },
  {
    category: "Travel",
    emoji: "🌏",
    both: "You both love to travel",
    keywords: ["travel", "travelling", "vietnam", "georgia", "trip", "countries"],
    interests: ["travel"],
    questions: [
      "Where are you off to next?",
      "What's the best place you've travelled to recently?",
    ],
  },
  {
    category: "Books",
    emoji: "📚",
    both: "You both love books",
    keywords: ["book", "books", "reading", "kafka", "borges", "read"],
    interests: ["books"],
    questions: [
      "What have you been reading lately?",
      "Read anything worth stealing off your shelf?",
    ],
  },
  {
    category: "Startups",
    emoji: "🚀",
    both: "You're both building things",
    keywords: ["startup", "startups", "founder", "building", "fundraising", "product"],
    interests: ["startups"],
    questions: [
      "What are you building right now?",
      "How's the building going?",
    ],
  },
  {
    category: "Philosophy",
    emoji: "🧠",
    both: "You both like ideas",
    keywords: ["philosophy", "sociology", "stoic", "stoicism", "memory", "mind"],
    interests: ["philosophy"],
    questions: [
      "What's an idea you can't stop thinking about lately?",
      "What got you into philosophy?",
    ],
  },
  {
    category: "Art",
    emoji: "🎨",
    both: "You both make / love art",
    keywords: ["art", "illustrate", "illustration", "sketch", "drawing", "paint"],
    interests: ["art", "design"],
    questions: [
      "What are you working on right now?",
      "Where do you find inspiration these days?",
    ],
  },
  {
    category: "Music",
    emoji: "🎧",
    both: "You both love music",
    keywords: ["music", "jazz", "guitar", "song", "band", "gig", "ep"],
    interests: ["music"],
    questions: [
      "What have you had on repeat lately?",
      "Been to any good gigs recently?",
    ],
  },
  {
    category: "Food",
    emoji: "🍜",
    both: "You both love food",
    keywords: ["food", "ramen", "cooking", "chef", "cook", "supper"],
    interests: ["food", "cooking"],
    questions: [
      "What should I be ordering here?",
      "Best thing you've eaten in the city lately?",
    ],
  },
  {
    category: "Photography",
    emoji: "📷",
    both: "You both shoot photos",
    keywords: ["photograph", "photography", "camera", "photo"],
    interests: ["photography"],
    questions: [
      "What are you shooting these days?",
      "Film or digital?",
    ],
  },
  {
    category: "Film",
    emoji: "🎬",
    both: "You both love cinema",
    keywords: ["film", "cinema", "movie", "movies", "screenplay", "score"],
    interests: ["movies", "cinema"],
    questions: [
      "What should I watch tonight?",
      "What's the last film that stayed with you?",
    ],
  },
  {
    category: "Coffee",
    emoji: "☕",
    both: "You're both here for the coffee",
    keywords: ["coffee", "café", "cafe", "single-origin"],
    interests: ["coffee"],
    questions: [
      "What are you drinking? Any idea what's good here?",
      "Are you a regular here?",
    ],
  },
  {
    category: "Writing",
    emoji: "✍️",
    both: "You both write",
    keywords: ["writing", "writer", "lyrics", "screenplay", "journalist", "podcast"],
    interests: ["writing"],
    questions: [
      "What are you working on?",
      "How's the writing going?",
    ],
  },
  {
    category: "Technology",
    emoji: "💡",
    both: "You're both into technology",
    keywords: ["technology", "ai", "robotics", "engineer", "app"],
    interests: ["technology"],
    questions: [
      "What are you working on right now?",
      "What's something in tech you're excited about?",
    ],
  },
];

function profileText(p: Profile | PublicProfile): string {
  const parts: string[] = [
    p.profession,
    ...(p.interests ?? []),
    ...(p.nowLines ?? []).map((l) => l.text),
    ...(p.askMeAbout ?? []),
  ];
  if ("interesting" in p && p.interesting) parts.push(p.interesting);
  if ("recently" in p && p.recently) parts.push(p.recently);
  return parts.join(" • ").toLowerCase();
}

function matchesCategory(text: string, interests: string[], def: CategoryDef): boolean {
  const lowered = interests.map((i) => i.toLowerCase());
  if (def.interests.some((i) => lowered.includes(i))) return true;
  return def.keywords.some((k) => text.includes(k));
}

/** Ranks a `category` name: those in `priority` sort first (in listed order). */
function priorityRank(category: string, priority: string[]): number {
  const i = priority.indexOf(category);
  return i === -1 ? priority.length + 1 : i;
}

/**
 * Compute the shared context between the viewer and the person they're looking at.
 * Returns a de-duplicated list of genuine common ground, ordered with the
 * facility's priority categories first when provided.
 */
export function computeSharedContext(
  viewer: Profile | null,
  target: Profile | PublicProfile,
  priorityCategories: string[] = [],
): SharedContext[] {
  if (!viewer) return [];
  const viewerText = profileText(viewer);
  const targetText = profileText(target);

  const shared: SharedContext[] = [];
  for (const def of CATEGORIES) {
    const viewerHas = matchesCategory(viewerText, viewer.interests ?? [], def);
    const targetHas = matchesCategory(targetText, target.interests ?? [], def);
    if (viewerHas && targetHas) {
      shared.push({ emoji: def.emoji, text: def.both, category: def.category });
    }
  }
  if (priorityCategories.length) {
    shared.sort(
      (a, b) =>
        priorityRank(a.category, priorityCategories) -
        priorityRank(b.category, priorityCategories),
    );
  }
  return shared;
}

/** Relevance of some profile text/interests to a set of facility categories (0..n). */
export function relevanceScore(
  text: string,
  interests: string[],
  categories: string[],
): number {
  let score = 0;
  for (const name of categories) {
    const def = CATEGORIES.find((c) => c.category === name);
    if (def && matchesCategory(text.toLowerCase(), interests, def)) score += 1;
  }
  return score;
}

/** Does this free text / interest match a single category name? */
export function textMatchesCategory(
  text: string,
  interests: string[],
  category: string,
): boolean {
  const def = CATEGORIES.find((c) => c.category === category);
  return def ? matchesCategory(text.toLowerCase(), interests, def) : false;
}

/** The catalyst (open questions) for a given shared-context category. */
export function catalystForCategory(category: string): Catalyst | null {
  const def = CATEGORIES.find((c) => c.category === category);
  if (!def) return null;
  return { category: def.category, questions: def.questions };
}

/** A couple of suggested openings drawn from the strongest shared context. */
export function possibleOpenings(shared: SharedContext[]): string[] {
  const openings: string[] = [];
  for (const s of shared) {
    const cat = catalystForCategory(s.category);
    if (cat && cat.questions[0]) openings.push(cat.questions[0]);
    if (openings.length >= 2) break;
  }
  return openings;
}

export interface ApproachReason {
  category: string;
  emoji: string;
  label: string; // e.g. "You both run" (shared) or "They're into running"
  questions: string[];
  shared: boolean;
}

/**
 * Reasons a viewer might approach a target: shared context first, then a few of
 * the target's own topics so there is always a natural way in. Never a score.
 */
export function approachReasons(
  viewer: Profile | null,
  target: Profile | PublicProfile,
  limit = 5,
  priorityCategories: string[] = [],
): ApproachReason[] {
  const targetText = profileText(target);
  const viewerText = viewer ? profileText(viewer) : "";
  const out: ApproachReason[] = [];

  for (const def of CATEGORIES) {
    const targetHas = matchesCategory(targetText, target.interests ?? [], def);
    if (!targetHas) continue;
    const viewerHas = viewer
      ? matchesCategory(viewerText, viewer.interests ?? [], def)
      : false;
    out.push({
      category: def.category,
      emoji: def.emoji,
      label: viewerHas ? def.both : `They're into ${def.category.toLowerCase()}`,
      questions: def.questions,
      shared: viewerHas,
    });
  }

  // Shared reasons first, then facility-relevant ones.
  out.sort((a, b) => {
    if (a.shared !== b.shared) return Number(b.shared) - Number(a.shared);
    return priorityRank(a.category, priorityCategories) - priorityRank(b.category, priorityCategories);
  });
  return out.slice(0, limit);
}
