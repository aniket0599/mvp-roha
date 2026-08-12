import type { CurrentActivity, FacilityType } from "./types";

// ---------------------------------------------------------------------------
// Facility configuration.
//
// Every venue collects the SAME constant set of profile signals. What differs
// per facility is *prioritization*: which signals surface first on a card, what
// the screens are called, which conversation catalysts are boosted, and which
// onboarding prompts nudge the most relevant information.
//
// `priorityCategories` uses the same category names as lib/matching.ts, so the
// facility can boost both display ordering and "why you might want to talk".
// ---------------------------------------------------------------------------

export type PrimaryTag = "lookingFor" | "askMeAbout" | "interests";

export interface FacilityConfig {
  type: FacilityType;
  label: string; // human label, e.g. "Coffee shop"
  emoji: string;
  /** Landing-page subheader flavour (a Space can override via `tagline`). */
  tagline: string;
  /** Header on the primary discovery screen. */
  discoverTitle: string;
  /** Categories (matching.ts names) that matter most here — boosts ordering + catalysts. */
  priorityCategories: string[];
  /** Current-activity values that are especially relevant here. */
  priorityActivities: CurrentActivity[];
  /** Which chip group leads on a card. Falls back to a non-empty group. */
  primaryTag: PrimaryTag;
  /** Show the "Recently" achievement line prominently (gyms, run clubs, events). */
  emphasizeRecently: boolean;
  onboarding: {
    interestingPrompt: string;
    interestingPlaceholder: string;
    askPrompt: string;
    askPlaceholder: string;
  };
}

export const FACILITIES: Record<FacilityType, FacilityConfig> = {
  cafe: {
    type: "cafe",
    label: "Coffee shop",
    emoji: "☕",
    tagline: "There are interesting people here.",
    discoverTitle: "People around you",
    priorityCategories: ["Books", "Coffee", "Travel", "Startups", "Philosophy"],
    priorityActivities: ["Reading", "Working", "Building something", "Taking a break"],
    primaryTag: "askMeAbout",
    emphasizeRecently: false,
    onboarding: {
      interestingPrompt: "Tell people something interesting",
      interestingPlaceholder:
        "Started running 6 months ago and still struggle with long runs. Getting there.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Japan travel, HYROX, sociology of technology",
    },
  },
  library: {
    type: "library",
    label: "Library / bookstore café",
    emoji: "📚",
    tagline: "A quiet room full of readers and thinkers.",
    discoverTitle: "Readers around you",
    priorityCategories: ["Books", "Writing", "Philosophy", "Film"],
    priorityActivities: ["Reading", "Studying"],
    primaryTag: "askMeAbout",
    emphasizeRecently: false,
    onboarding: {
      interestingPrompt: "What are you reading or working through?",
      interestingPlaceholder: "Halfway through Borges. Slowly convinced libraries are magic.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Favourite authors, philosophy, what to read next",
    },
  },
  gym: {
    type: "gym",
    label: "Gym",
    emoji: "🏋️",
    tagline: "Everyone here is putting in work.",
    discoverTitle: "People training near you",
    priorityCategories: ["Fitness", "Running"],
    priorityActivities: ["Training"],
    primaryTag: "lookingFor",
    emphasizeRecently: true,
    onboarding: {
      interestingPrompt: "What are you training for?",
      interestingPlaceholder: "Chasing a 140kg deadlift and a first pull-up. Long way to go.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Programming, lifts, mobility, sports",
    },
  },
  run_club: {
    type: "run_club",
    label: "Run club",
    emoji: "🏃",
    tagline: "Find people who run your pace.",
    discoverTitle: "Runners around you",
    priorityCategories: ["Running", "Fitness", "Travel"],
    priorityActivities: ["Training", "Exploring"],
    primaryTag: "lookingFor",
    emphasizeRecently: true,
    onboarding: {
      interestingPrompt: "What are you training for? What's your pace?",
      interestingPlaceholder: "Training for a sub-2 half. Comfortable around 5:30/km.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Races, routes, training plans",
    },
  },
  bar: {
    type: "bar",
    label: "Bar",
    emoji: "🍸",
    tagline: "Good company, no pressure.",
    discoverTitle: "People around you",
    priorityCategories: ["Music", "Food", "Travel", "Film"],
    priorityActivities: ["Taking a break", "Exploring"],
    primaryTag: "lookingFor",
    emphasizeRecently: false,
    onboarding: {
      interestingPrompt: "Tell people something interesting",
      interestingPlaceholder: "I can recommend a book, a bar, or a hiking trail. Ask away.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Music, travel, films, this city",
    },
  },
  social: {
    type: "social",
    label: "Social event",
    emoji: "🎟️",
    tagline: "The people worth meeting here.",
    discoverTitle: "People at this event",
    priorityCategories: ["Startups", "Technology", "Art", "Writing"],
    priorityActivities: ["Building something", "Working"],
    primaryTag: "lookingFor",
    emphasizeRecently: true,
    onboarding: {
      interestingPrompt: "What are you working on?",
      interestingPlaceholder: "Building a mental-health app. Left consulting to do it.",
      askPrompt: "Ask me about…",
      askPlaceholder: "What you do, what you're building, what you're looking for",
    },
  },
  club: {
    type: "club",
    label: "Club",
    emoji: "🎶",
    tagline: "Your crowd is here.",
    discoverTitle: "People around you",
    priorityCategories: ["Music", "Art", "Film"],
    priorityActivities: ["Exploring", "Taking a break"],
    primaryTag: "interests",
    emphasizeRecently: false,
    onboarding: {
      interestingPrompt: "Tell people something interesting",
      interestingPlaceholder: "Here for the music. Ask me who to listen to next.",
      askPrompt: "Ask me about…",
      askPlaceholder: "Music, nightlife, art",
    },
  },
};

export function facilityConfig(type: FacilityType): FacilityConfig {
  return FACILITIES[type] ?? FACILITIES.cafe;
}
