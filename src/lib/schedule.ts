import { programmes } from "@/data/programmes";
import { env } from "@/lib/env";
import type { BroadcastSlot, Programme, WeekdayCode } from "@/types/content";

export const WEEKDAY_ORDER: WeekdayCode[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const WEEKDAY_LABELS: Record<WeekdayCode, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const JS_DAY_TO_CODE: WeekdayCode[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export interface ScheduleEntry {
  programme: Programme;
  slot: BroadcastSlot;
  start: Date;
  end: Date;
  status: "upcoming" | "live" | "ended";
}

/** Computes the (year, month, day, weekday, offsetMinutes) of "now" as seen
 * in the station's configured timezone, without any date library. */
function getStationNowInfo(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const weekdayShort = get("weekday").toLowerCase();
  const weekdayCode = JS_DAY_TO_CODE.find((code) => weekdayShort.startsWith(code)) ?? "mon";

  return { year, month, day, weekdayCode };
}

/** Offset (minutes, tz - UTC) of `timeZone` at the given instant. */
function getOffsetMinutes(instant: Date, timeZone: string): number {
  const tzString = instant.toLocaleString("en-US", { timeZone });
  const utcString = instant.toLocaleString("en-US", { timeZone: "UTC" });
  return (new Date(tzString).getTime() - new Date(utcString).getTime()) / 60_000;
}

/** Builds the absolute Date instant for a "HH:mm" time on a given
 * (year, month, day) in the station's timezone. */
function stationLocalToInstant(
  year: number,
  month: number,
  day: number,
  hhmm: string,
  timeZone: string
): Date {
  const [hh, mm] = hhmm.split(":").map(Number);
  const naiveUtcMs = Date.UTC(year, month - 1, day, hh, mm);
  const offset = getOffsetMinutes(new Date(naiveUtcMs), timeZone);
  return new Date(naiveUtcMs - offset * 60_000);
}

export function getTodaysSchedule(now: Date = new Date()): ScheduleEntry[] {
  const timeZone = env.stationTimezone;
  const { year, month, day, weekdayCode } = getStationNowInfo(now, timeZone);

  const entries: ScheduleEntry[] = [];

  for (const programme of programmes) {
    for (const slot of programme.schedule) {
      if (slot.day !== weekdayCode) continue;
      const start = stationLocalToInstant(year, month, day, slot.startTime, timeZone);
      const end = stationLocalToInstant(year, month, day, slot.endTime, timeZone);
      const status = now < start ? "upcoming" : now > end ? "ended" : "live";
      entries.push({ programme, slot, start, end, status });
    }
  }

  return entries.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function getWeeklySchedule(): Record<WeekdayCode, { programme: Programme; slot: BroadcastSlot }[]> {
  const grouped = {} as Record<WeekdayCode, { programme: Programme; slot: BroadcastSlot }[]>;
  for (const day of WEEKDAY_ORDER) {
    grouped[day] = [];
  }

  for (const programme of programmes) {
    for (const slot of programme.schedule) {
      grouped[slot.day].push({ programme, slot });
    }
  }

  for (const day of WEEKDAY_ORDER) {
    grouped[day].sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));
  }

  return grouped;
}

/** Next occurrence of a programme's broadcast, searching up to 7 days ahead. */
export function getNextBroadcast(programme: Programme, now: Date = new Date()): Date | null {
  if (programme.schedule.length === 0) return null;
  const timeZone = env.stationTimezone;

  for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
    const probe = new Date(now.getTime() + dayOffset * 86_400_000);
    const { year, month, day, weekdayCode } = getStationNowInfo(probe, timeZone);

    const todaysSlots = programme.schedule
      .filter((slot) => slot.day === weekdayCode)
      .map((slot) => stationLocalToInstant(year, month, day, slot.startTime, timeZone))
      .filter((start) => start.getTime() > now.getTime())
      .sort((a, b) => a.getTime() - b.getTime());

    if (todaysSlots.length > 0) return todaysSlots[0];
  }

  return null;
}

export function formatSlotTimeRange(slot: BroadcastSlot): string {
  return `${formatHHmm(slot.startTime)} – ${formatHHmm(slot.endTime)}`;
}

function formatHHmm(hhmm: string): string {
  const [hh, mm] = hhmm.split(":").map(Number);
  const period = hh >= 12 ? "PM" : "AM";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm === 0 ? `${hour12} ${period}` : `${hour12}:${String(mm).padStart(2, "0")} ${period}`;
}
