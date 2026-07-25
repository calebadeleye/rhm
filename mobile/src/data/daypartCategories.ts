import type { DaypartCategory } from '../types/schedule';

/**
 * Maps a playlist's AzuraCast short_name to our public category taxonomy.
 * Mirrors the web app's src/data/daypartCategories.ts.
 */
export const DAYPART_CATEGORY_BY_SHORT_NAME: Record<string, DaypartCategory> = {
  morning_devotional: 'prayer',
  morning_praise: 'worship',
  gospel_inspiration: 'worship',
  afternoon_gospel_mix: 'talk',
  evening_word_and_worship: 'teaching',
  night_worship: 'worship',
};

export const DEFAULT_DAYPART_CATEGORY: DaypartCategory = 'special';

export function resolveDaypartCategory(shortName: string): DaypartCategory {
  return DAYPART_CATEGORY_BY_SHORT_NAME[shortName] ?? DEFAULT_DAYPART_CATEGORY;
}

export const CATEGORY_META: Record<DaypartCategory, { label: string; color: string }> = {
  worship: { label: 'Music & Worship', color: '#a855f7' },
  teaching: { label: 'Teaching & Word', color: '#3b82f6' },
  prayer: { label: 'Prayer', color: '#f59e0b' },
  talk: { label: 'Talk Shows', color: '#14b8a6' },
  special: { label: 'Special Programmes', color: '#ec4899' },
};

export const CATEGORY_FILTERS: { id: DaypartCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Programmes' },
  { id: 'worship', label: CATEGORY_META.worship.label },
  { id: 'teaching', label: CATEGORY_META.teaching.label },
  { id: 'prayer', label: CATEGORY_META.prayer.label },
  { id: 'talk', label: CATEGORY_META.talk.label },
  { id: 'special', label: CATEGORY_META.special.label },
];
