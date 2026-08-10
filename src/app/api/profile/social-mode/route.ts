import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";
import { SOCIAL_MODES, type SocialMode } from "@/lib/types";

export async function POST(req: NextRequest) {
  const uid = getUserId();
  if (!uid) return NextResponse.json({ error: "no session" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const mode = body?.mode as SocialMode;
  if (!(Object.keys(SOCIAL_MODES) as SocialMode[]).includes(mode)) {
    return NextResponse.json({ error: "invalid mode" }, { status: 400 });
  }
  await getStore().setSocialMode(uid, mode);
  return NextResponse.json({ ok: true });
}
