import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, adminGateEnabled, expectedAdminToken, passwordMatches } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!adminGateEnabled()) {
    return NextResponse.json({ ok: true, gate: false });
  }
  const body = await req.json().catch(() => ({}));
  if (!passwordMatches(String(body?.password ?? ""))) {
    return NextResponse.json({ error: "incorrect password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, expectedAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
