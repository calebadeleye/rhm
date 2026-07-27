/** Shared timezone-conversion primitives used by the live AzuraCast-playlist
 * schedule. No date library needed — just the Intl API. Ported verbatim from
 * the web app's src/lib/timezone.ts. */

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
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekdayShort = get('weekday').toLowerCase();
  const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const weekdayIndex = WEEKDAYS.findIndex((code) => weekdayShort.startsWith(code));

  return {
    year: Number(get('year')),
    month: Number(get('month')),
    day: Number(get('day')),
    weekdayIndex: weekdayIndex === -1 ? 0 : weekdayIndex,
  };
}

/** The day-of-week (0 Sun – 6 Sat) for a plain calendar date. */
export function weekdayIndexForDate(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

/** Offset (minutes, tz - UTC) of `timeZone` at the given instant.
 *
 * Uses `formatToParts` (not `toLocaleString` + re-parsing a locale string,
 * which is implementation-defined and gave wrong results under Hermes on
 * Android) so the wall-clock reading is diffed against the instant directly. */
function getOffsetMinutes(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtcMs = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second'),
  );
  return (asUtcMs - instant.getTime()) / 60_000;
}

/** Builds the absolute Date instant for `minutesSinceMidnight` on a given
 * (year, month, day) in `timeZone`. `minutesSinceMidnight` may exceed 1439
 * (e.g. 1440 = the following midnight) — Date.UTC normalises the overflow. */
export function stationLocalMinutesToInstant(
  year: number,
  month: number,
  day: number,
  minutesSinceMidnight: number,
  timeZone: string,
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
