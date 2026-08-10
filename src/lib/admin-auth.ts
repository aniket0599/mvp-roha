import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Optional password gate for the research dashboard. When ADMIN_PASSWORD is set,
// the dashboard and reset endpoint require it. When unset (e.g. local dev), the
// dashboard stays open — a banner reminds you it's unprotected.

export const ADMIN_COOKIE = "around_admin";

export function adminGateEnabled(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** The cookie value proving the holder knows ADMIN_PASSWORD (never the password itself). */
export function expectedAdminToken(): string {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(`around:${secret}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function passwordMatches(input: string): boolean {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return secret.length > 0 && safeEqual(input, secret);
}

/** True if the request is allowed to see admin surfaces. */
export function isAdminAuthed(): boolean {
  if (!adminGateEnabled()) return true;
  const token = cookies().get(ADMIN_COOKIE)?.value ?? "";
  return safeEqual(token, expectedAdminToken());
}
