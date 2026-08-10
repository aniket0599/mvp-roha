import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";

// Leave the space entirely: the participant's profile is removed and they are
// no longer discoverable to anyone.
export async function POST() {
  const uid = getUserId();
  if (!uid) return NextResponse.json({ error: "no session" }, { status: 401 });
  await getStore().deleteProfile(uid);
  return NextResponse.json({ ok: true });
}
