import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { getUserId } from "@/lib/session";
import { deriveNowLines, parseTopics } from "@/lib/derive";
import type { CurrentActivity, Profile, SocialMode } from "@/lib/types";
import { CURRENT_ACTIVITIES, SOCIAL_MODES } from "@/lib/types";

// Create or update the caller's own profile (joins the space, becomes visible).
export async function POST(req: NextRequest) {
  const uid = getUserId();
  if (!uid) return NextResponse.json({ error: "no session" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const store = getStore();

  const space = await store.getSpaceByVenue(body?.venueId);
  if (!space) return NextResponse.json({ error: "unknown venue" }, { status: 404 });

  const name = String(body?.name ?? "").trim();
  const profession = String(body?.profession ?? "").trim();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const ageNum = Number.parseInt(String(body?.age ?? ""), 10);
  const age = Number.isFinite(ageNum) ? ageNum : null;

  const activity: CurrentActivity | null = CURRENT_ACTIVITIES.includes(body?.currentActivity)
    ? body.currentActivity
    : null;

  const socialMode: SocialMode = (Object.keys(SOCIAL_MODES) as SocialMode[]).includes(
    body?.socialMode,
  )
    ? body.socialMode
    : "open";

  const interests: string[] = Array.isArray(body?.interests)
    ? body.interests.slice(0, 5).map((s: unknown) => String(s))
    : [];

  const lookingFor: string[] = Array.isArray(body?.lookingFor)
    ? body.lookingFor.map((s: unknown) => String(s))
    : [];

  const askMeAbout = parseTopics(String(body?.askMeAbout ?? ""));

  const existing = await store.getProfile(uid);
  const nowIso = new Date().toISOString();

  const profile: Profile = {
    id: uid,
    spaceId: space.id,
    name,
    age,
    profession,
    avatarEmoji: existing?.avatarEmoji ?? "🙂",
    interests,
    currentActivity: activity,
    nowLines: deriveNowLines(activity),
    interesting: String(body?.interesting ?? "").trim(),
    askMeAbout,
    lookingFor,
    recently: String(body?.recently ?? existing?.recently ?? "").trim(),
    socialMode,
    visible: true,
    usuallyHere: existing?.usuallyHere,
    createdAt: existing?.createdAt ?? nowIso,
    updatedAt: nowIso,
  };

  await store.upsertProfile(profile);

  if (!existing) {
    await track("profile_created", { userId: uid, spaceId: space.id });
  }

  const total = await store.countVisible(space.id);
  const othersCount = Math.max(0, total - 1);

  return NextResponse.json({ ok: true, profile, othersCount });
}
