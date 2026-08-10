// ---------------------------------------------------------------------------
// Domain types for Around.
//
// The vocabulary mirrors the Product Brief's architecture section:
//   User → Profile → Interests / CurrentActivity / SocialMode / SpaceMembership
//   Space, Interaction, Connection, AnalyticsEvent
//
// Everything a participant sees is information they *intentionally* provided.
// There are no inferred fields (attraction, emotion, willingness, location).
// ---------------------------------------------------------------------------

export type SocialMode = "open" | "if_approached" | "self";

export const SOCIAL_MODES: Record<
  SocialMode,
  { dot: string; label: string; short: string }
> = {
  open: { dot: "🟢", label: "Open to meeting people", short: "Open to meeting" },
  if_approached: { dot: "🟡", label: "Open if approached", short: "Open if approached" },
  self: { dot: "⚪", label: "Just here for myself", short: "Here for myself" },
};

export type CurrentActivity =
  | "Working"
  | "Reading"
  | "Studying"
  | "Building something"
  | "Travelling"
  | "Training"
  | "Exploring"
  | "Taking a break";

export const CURRENT_ACTIVITIES: CurrentActivity[] = [
  "Working",
  "Reading",
  "Studying",
  "Building something",
  "Travelling",
  "Training",
  "Exploring",
  "Taking a break",
];

export const INTERESTS: string[] = [
  "Running",
  "Fitness",
  "Books",
  "Travel",
  "Startups",
  "Technology",
  "Philosophy",
  "Music",
  "Art",
  "Food",
  "Photography",
  "Movies",
  "Gaming",
  "Design",
  "Coffee",
  "Writing",
  "Cinema",
  "Cooking",
];

export const LOOKING_FOR_OPTIONS: string[] = [
  "Interesting conversations",
  "New friends",
  "Running partner",
  "Travel recommendations",
  "People to explore with",
  "Startup conversations",
  "Activity partner",
  "Just curious about people",
];

export interface Space {
  id: string;
  venueId: string; // slug used in the URL / QR code, e.g. "blue-tokai-gurgaon"
  name: string; // e.g. "Blue Tokai"
  imageUrl?: string;
}

export interface Profile {
  id: string; // == user id (anonymous)
  spaceId: string;
  name: string;
  age: number | null;
  profession: string;
  avatarEmoji?: string;
  interests: string[]; // 3–5
  currentActivity: CurrentActivity | null;
  // Short contextual "right now" lines shown on cards & detail (with an emoji each)
  nowLines: { emoji: string; text: string }[];
  interesting: string; // "Tell people something interesting" (free text)
  askMeAbout: string[]; // parsed topics
  lookingFor: string[];
  recently: string; // "Recently…" free text
  socialMode: SocialMode;
  visible: boolean; // opted into being discoverable
  usuallyHere?: string; // optional flavour, e.g. "Sunday afternoons"
  createdAt: string;
  updatedAt: string;
}

export type InteractionType =
  | "Had a conversation"
  | "Exchanged contact details"
  | "Made plans"
  | "Found a common interest"
  | "Want to see them again"
  | "Other";

export const INTERACTION_TYPES: InteractionType[] = [
  "Had a conversation",
  "Exchanged contact details",
  "Made plans",
  "Found a common interest",
  "Want to see them again",
  "Other",
];

export interface Connection {
  id: string;
  userId: string;
  otherUserId: string;
  otherUserName: string;
  spaceId: string;
  spaceName: string;
  types: InteractionType[];
  note: string;
  createdAt: string;
}

export type AnalyticsEventName =
  | "space_joined"
  | "profile_created"
  | "people_screen_viewed"
  | "profile_viewed"
  | "shared_interest_viewed"
  | "conversation_catalyst_viewed"
  | "curiosity_selected"
  | "interaction_recorded"
  | "contact_exchanged"
  | "connection_created";

export interface AnalyticsEvent {
  id: string;
  name: AnalyticsEventName;
  userId: string | null; // anonymous id
  spaceId: string | null;
  targetProfileId?: string | null;
  category?: string | null;
  timestamp: string;
}

// ---- View models returned to the client ----------------------------------

/** A profile as another participant sees it (never exposes `visible`, ids kept). */
export interface PublicProfile {
  id: string;
  name: string;
  age: number | null;
  profession: string;
  avatarEmoji?: string;
  interests: string[];
  nowLines: { emoji: string; text: string }[];
  askMeAbout: string[];
  lookingFor: string[];
  recently: string;
  socialMode: SocialMode;
  usuallyHere?: string;
}

export interface SharedContext {
  emoji: string;
  text: string; // e.g. "You both run"
  category: string; // used for the catalyst screen + analytics
}

export interface Catalyst {
  category: string;
  questions: string[];
}
