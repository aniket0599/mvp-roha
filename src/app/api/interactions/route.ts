import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { getUserId } from "@/lib/session";
import type { Connection, InteractionType } from "@/lib/types";
import { INTERACTION_TYPES } from "@/lib/types";

// Record that the participant met someone in the physical world. This creates a
// Connection (shown under "Connections") and emits the research funnel events.
export async function POST(req: NextRequest) {
  const uid = getUserId();
  if (!uid) return NextResponse.json({ error: "no session" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const store = getStore();

  const space = await store.getSpaceByVenue(body?.venueId);
  if (!space) return NextResponse.json({ error: "unknown venue" }, { status: 404 });

  const otherUserId = String(body?.otherUserId ?? "");
  if (!otherUserId) return NextResponse.json({ error: "otherUserId required" }, { status: 400 });

  const other = await store.getProfile(otherUserId);
  const otherUserName = other?.name ?? String(body?.otherUserName ?? "Someone");

  const types: InteractionType[] = Array.isArray(body?.types)
    ? body.types.filter((t: unknown) => INTERACTION_TYPES.includes(t as InteractionType))
    : [];

  const connection: Connection = {
    id: `c_${crypto.randomUUID()}`,
    userId: uid,
    otherUserId,
    otherUserName,
    spaceId: space.id,
    spaceName: space.name,
    types,
    note: String(body?.note ?? "").trim(),
    createdAt: new Date().toISOString(),
  };

  await store.createConnection(connection);

  await track("interaction_recorded", {
    userId: uid,
    spaceId: space.id,
    targetProfileId: otherUserId,
  });
  if (types.includes("Exchanged contact details")) {
    await track("contact_exchanged", {
      userId: uid,
      spaceId: space.id,
      targetProfileId: otherUserId,
    });
  }
  await track("connection_created", {
    userId: uid,
    spaceId: space.id,
    targetProfileId: otherUserId,
  });

  return NextResponse.json({ ok: true, connection });
}
