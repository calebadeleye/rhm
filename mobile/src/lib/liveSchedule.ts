import {
  addStationDays,
  getStationDateInfo,
  stationLocalMinutesToInstant,
  type StationDateInfo,
} from './timezone';
import type { Daypart, DaypartOccurrence, DaypartScheduleItem } from '../types/schedule';

export interface RawOccurrence {
  daypart: Daypart;
  start: Date;
  end: Date;
  startMinutes: number;
  endMinutes: number;
}

function matchesDay(days: number[], weekdayIndex: number): boolean {
  return days.length === 0 || days.includes(weekdayIndex);
}

/** Expands one schedule_item into 0–2 concrete occurrences on the given
 * station-local calendar date. Overnight-wrapping slots are split into a
 * "tail" occurrence and a "head" occurrence bracketing each day. */
function expandItemForDate(
  daypart: Daypart,
  item: DaypartScheduleItem,
  info: StationDateInfo,
  timeZone: string,
): RawOccurrence[] {
  const wraps = item.endMinutes <= item.startMinutes;
  const occurrences: RawOccurrence[] = [];

  if (!wraps) {
    if (matchesDay(item.days, info.weekdayIndex)) {
      occurrences.push({
        daypart,
        start: stationLocalMinutesToInstant(info.year, info.month, info.day, item.startMinutes, timeZone),
        end: stationLocalMinutesToInstant(info.year, info.month, info.day, item.endMinutes, timeZone),
        startMinutes: item.startMinutes,
        endMinutes: item.endMinutes,
      });
    }
    return occurrences;
  }

  const previousInfo = addStationDays(info, -1);
  if (matchesDay(item.days, previousInfo.weekdayIndex)) {
    occurrences.push({
      daypart,
      start: stationLocalMinutesToInstant(info.year, info.month, info.day, 0, timeZone),
      end: stationLocalMinutesToInstant(info.year, info.month, info.day, item.endMinutes, timeZone),
      startMinutes: 0,
      endMinutes: item.endMinutes,
    });
  }
  if (matchesDay(item.days, info.weekdayIndex)) {
    occurrences.push({
      daypart,
      start: stationLocalMinutesToInstant(info.year, info.month, info.day, item.startMinutes, timeZone),
      end: stationLocalMinutesToInstant(info.year, info.month, info.day, 1440, timeZone),
      startMinutes: item.startMinutes,
      endMinutes: 1440,
    });
  }
  return occurrences;
}

/** All occurrences on a given station-local calendar date, chronologically sorted. */
export function getOccurrencesForDate(
  dayparts: Daypart[],
  info: StationDateInfo,
  timeZone: string,
): RawOccurrence[] {
  const all: RawOccurrence[] = [];
  for (const daypart of dayparts) {
    for (const item of daypart.scheduleItems) {
      all.push(...expandItemForDate(daypart, item, info, timeZone));
    }
  }
  return all.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function withStatus(occurrences: RawOccurrence[], now: Date): DaypartOccurrence[] {
  return occurrences.map((occ) => ({
    ...occ,
    status:
      now.getTime() < occ.start.getTime()
        ? 'upcoming'
        : now.getTime() > occ.end.getTime()
          ? 'ended'
          : 'live',
  }));
}

/** The currently live daypart (if any) and the next one coming up — looks
 * into tomorrow if nothing remains scheduled later today. */
export function getCurrentAndNext(
  dayparts: Daypart[],
  now: Date,
  timeZone: string,
): { current: DaypartOccurrence | null; next: DaypartOccurrence | null } {
  const info = getStationDateInfo(now, timeZone);
  const today = withStatus(getOccurrencesForDate(dayparts, info, timeZone), now);

  const current = today.find((o) => o.status === 'live') ?? null;
  let next = today.find((o) => o.status === 'upcoming') ?? null;

  if (!next) {
    const tomorrowInfo = addStationDays(info, 1);
    const tomorrow = withStatus(getOccurrencesForDate(dayparts, tomorrowInfo, timeZone), now);
    next = tomorrow[0] ?? null;
  }

  return { current, next };
}

/** The Sunday–Saturday week containing the given calendar date. */
export function getWeekStationDates(info: StationDateInfo): StationDateInfo[] {
  const sunday = addStationDays(info, -info.weekdayIndex);
  return Array.from({ length: 7 }, (_, i) => addStationDays(sunday, i));
}

/** Formats minutes-since-midnight as a 24-hour "HH:mm" label. */
export function formatMinutes24(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/** Formats minutes-since-midnight as a 12-hour "h:mm AM/PM" label. */
export function formatMinutes12(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const hh = Math.floor(wrapped / 60);
  const mm = wrapped % 60;
  const period = hh >= 12 ? 'PM' : 'AM';
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm === 0 ? `${hour12} ${period}` : `${hour12}:${String(mm).padStart(2, '0')} ${period}`;
}
