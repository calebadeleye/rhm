/** Shared timezone-conversion primitives used by both the curated content
 * schedule (lib/schedule.ts) and the live AzuraCast-playlist schedule
 * (lib/liveSchedule.ts). No date library needed — just the Intl API. */

export interface StationDateInfo {
  year: number;
  month: number;
  day: number;
  /** 0 (Sunday) – 6 (Saturday), matching JS Date.getDay() and AzuraCast's
   * schedule_items[].days convention. */
  weekdayIndex: number;
}

/** (year, month, day, weekdayIndex) of `now` as seen in `timeZone`. */
export function getStationDateInfo(now: Date, timeZone: string): StationDateInfo {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const weekdayShort = get("weekday").toLowerCase();
  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const weekdayIndex = WEEKDAYS.findIndex((code) => weekdayShort.startsWith(code));

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekdayIndex: weekdayIndex === -1 ? 0 : weekdayIndex,
  };
}

/** The day-of-week (0 Sun – 6 Sat) for a plain calendar date. This is a
 * calendar fact, not an instant — no timezone conversion involved. Used for
 * user-picked calendar dates (e.g. from the schedule page's date picker),
 * which already represent a station-local calendar day by construction. */
export function weekdayIndexForDate(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Offset (minutes, tz - UTC) of `timeZone` at the given instant. */
function getOffsetMinutes(instant: Date, timeZone: string): number {
  const tzString = instant.toLocaleString("en-US", { timeZone });
  const utcString = instant.toLocaleString("en-US", { timeZone: "UTC" });
  return (new Date(tzString).getTime() - new Date(utcString).getTime()) / 60_000;
}

/** Builds the absolute Date instant for `minutesSinceMidnight` on a given
 * (year, month, day) in `timeZone`. `minutesSinceMidnight` may exceed 1439
 * (e.g. 1440 = the following midnight) — Date.UTC normalises the overflow. */
export function stationLocalMinutesToInstant(
  year: number,
  month: number,
  day: number,
  minutesSinceMidnight: number,
  timeZone: string
): Date {
  const naiveUtcMs = Date.UTC(year, month - 1, day, 0, minutesSinceMidnight);
  const offset = getOffsetMinutes(new Date(naiveUtcMs), timeZone);
  return new Date(naiveUtcMs - offset * 60_000);
}

/** Adds `days` calendar days to a station-local date, returning the new
 * (year, month, day, weekdayIndex). Handles month/year rollover via Date.UTC. */
export function addStationDays(info: StationDateInfo, days: number): StationDateInfo {
  const probe = new Date(Date.UTC(info.year, info.month - 1, info.day + days));
  return {
    year: probe.getUTCFullYear(),
    month: probe.getUTCMonth() + 1,
    day: probe.getUTCDate(),
    weekdayIndex: (info.weekdayIndex + days + 700) % 7,
  };
}
