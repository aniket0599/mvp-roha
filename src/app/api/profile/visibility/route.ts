import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { getUserId } from "@/lib/session";

// Toggle whether the participant is discoverable. Leaving invisible is the
// privacy escape hatch required by the brief — presence never implies visibility.
export async function POST(req: NextRequest) {
  const uid = getUserId();
  if (!uid) return NextResponse.json({ error: "no session" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const visible = Boolean(body?.visible);
  await getStore().setVisibility(uid, visible);
  return NextResponse.json({ ok: true });
}
