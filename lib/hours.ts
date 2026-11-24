/** Opening-hours helpers. Pure functions, safe on server and client. */
export type HoursSlot = { days: number[]; open?: string; close?: string; label: string; note?: string };

const to12h = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
};

/** "7:00 AM - 6:00 PM", the note for closed days, or "Closed". */
export function hoursText(slot: HoursSlot): string {
  if (slot.open && slot.close) return `${to12h(slot.open)} - ${to12h(slot.close)}${slot.note ? ` (${slot.note})` : ""}`;
  return slot.note ?? "Closed";
}

const weekday: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Day of week and minutes since midnight in the given IANA timezone. */
function zonedNow(timeZone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: weekday[get("weekday")] ?? 0, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

const minutesOf = (hhmm: string) => {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Whether the business is open right now in its own timezone (overnight ranges supported). */
export function isOpenNow(hours: HoursSlot[], timeZone: string, now = new Date()): boolean {
  const { day, minutes } = zonedNow(timeZone, now);
  const prev = (day + 6) % 7;
  return hours.some((s) => {
    if (!s.open || !s.close) return false;
    const open = minutesOf(s.open);
    const close = minutesOf(s.close);
    if (close > open) return s.days.includes(day) && minutes >= open && minutes < close;
    // Overnight (e.g. 20:00 - 02:00): today after open, or yesterday's slot before close.
    return (s.days.includes(day) && minutes >= open) || (s.days.includes(prev) && minutes < close);
  });
}
