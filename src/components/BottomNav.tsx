"use client";

import Link from "next/link";
import { Icon } from "./Icon";

type Tab = "around" | "connections" | "profile";

const TABS: { key: Tab; label: string; icon: string; path: (v: string) => string }[] = [
  { key: "around", label: "Around You", icon: "explore", path: (v) => `/space/${v}` },
  { key: "connections", label: "Connections", icon: "group", path: (v) => `/space/${v}/connections` },
  { key: "profile", label: "Profile", icon: "person", path: (v) => `/space/${v}/profile` },
];

export function BottomNav({ venue, active }: { venue: string; active: Tab }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex justify-around items-center h-16 bg-surface/95 backdrop-blur border-t border-surface-variant shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.path(venue)}
            className={`flex flex-col items-center justify-center gap-1 w-24 transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <Icon name={t.icon} filled={isActive} />
            <span className="text-label-caps font-semibold uppercase tracking-[0.08em]">
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
