import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { getUserId } from "@/lib/session";

// Called when a participant chooses "Join this space". Records the space_joined
// event. The actual visibility comes only after they create a profile.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const venueId = body?.venueId as string | undefined;
  if (!venueId) return NextResponse.json({ error: "venueId required" }, { status: 400 });

  const space = await getStore().getSpaceByVenue(venueId);
  if (!space) return NextResponse.json({ error: "unknown venue" }, { status: 404 });

  await track("space_joined", { userId: getUserId(), spaceId: space.id });
  return NextResponse.json({ ok: true, space });
}
