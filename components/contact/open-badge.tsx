"use client";

import { useSyncExternalStore } from "react";
import { isOpenNow, type HoursSlot } from "@/lib/hours";

/** Re-render once a minute so the badge flips at opening and closing time. */
function subscribe(onChange: () => void) {
  const t = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(t);
}
const minuteNow = () => Math.floor(Date.now() / 60_000);

/**
 * "Open now" / "Closed now", computed in the brand's timezone on the client only.
 * The server snapshot is null, so nothing renders until hydration (no mismatch, no stale static value).
 */
export function OpenNowBadge({
  hours,
  timeZone,
  labels,
  onDark = false,
}: {
  hours: HoursSlot[];
  timeZone: string;
  labels: { open: string; closed: string };
  onDark?: boolean;
}) {
  const minute = useSyncExternalStore(subscribe, minuteNow, () => null);
  if (minute === null) return null;
  const open = isOpenNow(hours, timeZone, new Date(minute * 60_000));
  const tone = open
    ? onDark
      ? "bg-on-primary/15 text-on-primary"
      : "bg-primary/10 text-primary"
    : onDark
      ? "bg-on-primary/10 text-on-primary/80"
      : "bg-surface-alt text-muted";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>
      {/* Dot plus text: the state is never conveyed by color alone. */}
      <span aria-hidden="true" className={`size-2 rounded-full ${open ? "bg-accent" : "bg-current opacity-50"}`} />
      {open ? labels.open : labels.closed}
    </span>
  );
}
