import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";

// Reset an experiment: clears participant-created profiles, analytics and
// connections for a venue, keeping the seed regulars. Optionally gated behind
// ADMIN_TOKEN (set the env var to require ?token=... ).
export async function POST(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    const provided = new URL(req.url).searchParams.get("token");
    if (provided !== token) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => ({}));
  const store = getStore();
  const space = await store.getSpaceByVenue(body?.venueId);
  if (!space) return NextResponse.json({ error: "unknown venue" }, { status: 404 });

  await store.resetSpace(space.id);
  return NextResponse.json({ ok: true });
}
