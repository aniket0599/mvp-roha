"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

// "Blue Tokai · 4:42 PM" — the time is the visitor's local time, updated live.
export function VenueClock({ venueName, chip = false }: { venueName: string; chip?: boolean }) {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      );
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, []);

  const inner = (
    <>
      <Icon name="location_on" className="text-[18px]" />
      <span className="text-label-caps font-semibold tracking-[0.08em] uppercase">
        {chip ? "Currently at: " : ""}
        {venueName}
        {time ? ` · ${time}` : ""}
      </span>
    </>
  );

  if (chip) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-surface-variant bg-surface-container-low px-4 py-2 text-on-surface-variant">
        {inner}
      </div>
    );
  }
  return <div className="flex items-center gap-2 text-on-surface-variant">{inner}</div>;
}
