import type { CurrentActivity } from "./types";

const ACTIVITY_EMOJI: Record<CurrentActivity, string> = {
  Working: "💻",
  Reading: "📖",
  Studying: "📝",
  "Building something": "🛠️",
  Travelling: "✈️",
  Training: "🏃",
  Exploring: "🧭",
  "Taking a break": "☕",
};

const ACTIVITY_PHRASE: Record<CurrentActivity, string> = {
  Working: "Working on something",
  Reading: "Reading right now",
  Studying: "Studying",
  "Building something": "Building something",
  Travelling: "Travelling",
  Training: "Training",
  Exploring: "Exploring",
  "Taking a break": "Taking a break",
};

export function activityLine(
  activity: CurrentActivity | null,
): { emoji: string; text: string } | null {
  if (!activity) return null;
  return { emoji: ACTIVITY_EMOJI[activity], text: ACTIVITY_PHRASE[activity] };
}

/** Build the contextual "now" lines for a participant-created profile. */
export function deriveNowLines(
  activity: CurrentActivity | null,
): { emoji: string; text: string }[] {
  const line = activityLine(activity);
  return line ? [line] : [];
}

/** Split free-text "ask me about" into individual topics. */
export function parseTopics(text: string): string[] {
  return text
    .split(/[,·\n;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
}
