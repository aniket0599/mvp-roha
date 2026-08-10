import { NextRequest, NextResponse } from "next/server";

export const UID_COOKIE = "around_uid";

// Ensure every visitor carries a stable, anonymous id. This is the only
// identifier we store — no accounts, no personal auth. It exists so a phone can
// recognise "its own" profile and so analytics can be attributed anonymously.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (!req.cookies.get(UID_COOKIE)) {
    const uid = `u_${crypto.randomUUID()}`;
    res.cookies.set(UID_COOKIE, uid, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
