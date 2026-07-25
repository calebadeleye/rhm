import { resolveDaypartCategory } from '../data/daypartCategories';
import type { Daypart, DaypartScheduleItem } from '../types/schedule';

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function safeMinutes(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1440
    ? value
    : null;
}

function normaliseScheduleItem(raw: unknown): DaypartScheduleItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const startMinutes = safeMinutes(item.startMinutes);
  const endMinutes = safeMinutes(item.endMinutes);
  if (startMinutes === null || endMinutes === null) return null;
  const days = Array.isArray(item.days)
    ? item.days.filter((d): d is number => typeof d === 'number' && d >= 0 && d <= 6)
    : [];
  return { startMinutes, endMinutes, days };
}

/** Defensively normalises our backend's /api/schedule response. The backend
 * already strips admin fields and validates shape, but we treat every
 * network boundary the same way: never trust it blindly. */
export function normaliseDaypart(raw: unknown): Daypart | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;

  const id = typeof data.id === 'number' ? data.id : null;
  if (id === null) return null;

  const scheduleItems = Array.isArray(data.scheduleItems)
    ? data.scheduleItems.map(normaliseScheduleItem).filter((i): i is DaypartScheduleItem => i !== null)
    : [];

  if (scheduleItems.length === 0) return null;

  const shortName = safeString(data.shortName);

  return {
    id,
    name: safeString(data.name, 'Programme'),
    shortName,
    description: safeString(data.description),
    category: resolveDaypartCategory(shortName),
    scheduleItems,
  };
}

export function normaliseSchedule(raw: unknown): Daypart[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as Record<string, unknown>;
  const list = Array.isArray(data.playlists) ? data.playlists : [];
  return list.map(normaliseDaypart).filter((d): d is Daypart => d !== null);
}
