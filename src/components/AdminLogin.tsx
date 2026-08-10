"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

// Password gate for the research dashboard. The password is checked server-side;
// only a derived token is ever stored in the cookie.
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Incorrect password.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-margin-mobile">
      <div className="w-full max-w-phone text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-stack-md">
          <Icon name="lock" className="text-primary text-[28px]" />
        </div>
        <h1 className="font-display text-headline text-primary mb-1">Research dashboard</h1>
        <p className="text-body-md text-on-surface-variant mb-stack-lg">
          Enter the admin password to continue.
        </p>
        <form onSubmit={submit} className="text-left">
          <label className="label-caps block mb-2">Password</label>
          <input
            type="password"
            className="field-input mb-stack-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="text-label-md text-error mb-stack-sm">{error}</p>}
          <button className="btn-primary" disabled={busy || !password}>
            {busy ? "Checking…" : "Enter dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
