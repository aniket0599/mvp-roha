import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { isAdminAuthed } from "@/lib/admin-auth";

// Reset an experiment: clears participant-created profiles, analytics and
// connections for a venue, keeping the seed regulars. Requires an authenticated
// admin session when ADMIN_PASSWORD is set.
export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const store = getStore();
  const space = await store.getSpaceByVenue(body?.venueId);
  if (!space) return NextResponse.json({ error: "unknown venue" }, { status: 404 });

  await store.resetSpace(space.id);
  return NextResponse.json({ ok: true });
}
