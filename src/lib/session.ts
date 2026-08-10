import { cookies } from "next/headers";
import { UID_COOKIE } from "@/middleware";

/** Read the anonymous user id from the request cookie (server components/routes). */
export function getUserId(): string | null {
  return cookies().get(UID_COOKIE)?.value ?? null;
}
