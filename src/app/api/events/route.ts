import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { getUserId } from "@/lib/session";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import type { AnalyticsEventName } from "@/lib/types";

// Generic client-side analytics sink. Only accepts the whitelisted event names.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = body?.name as AnalyticsEventName;
  if (!ANALYTICS_EVENTS.includes(name)) {
    return NextResponse.json({ error: "unknown event" }, { status: 400 });
  }

  let spaceId: string | null = body?.spaceId ?? null;
  if (!spaceId && body?.venueId) {
    const space = await getStore().getSpaceByVenue(body.venueId);
    spaceId = space?.id ?? null;
  }

  await track(name, {
    userId: getUserId(),
    spaceId,
    targetProfileId: body?.targetProfileId ?? null,
    category: body?.category ?? null,
  });

  return NextResponse.json({ ok: true });
}
