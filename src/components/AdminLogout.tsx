"use client";

import { useRouter } from "next/navigation";

export function AdminLogout() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }
  return (
    <button className="text-label-md text-on-surface-variant hover:underline" onClick={logout}>
      Log out
    </button>
  );
}
