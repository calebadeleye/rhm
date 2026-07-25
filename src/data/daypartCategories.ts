import type { DaypartCategory } from "@/types/schedule";

/**
 * Maps a playlist's AzuraCast short_name to our public category taxonomy.
 * AzuraCast has no concept of "category" — this is purely a presentation
 * mapping derived from each playlist's real name/description. Anything not
 * listed here (e.g. a new daypart added later on the station) falls back to
 * DEFAULT_DAYPART_CATEGORY rather than crashing or guessing.
 */
export const DAYPART_CATEGORY_BY_SHORT_NAME: Record<string, DaypartCategory> = {
  morning_devotional: "prayer",
  morning_praise: "worship",
  gospel_inspiration: "worship",
  afternoon_gospel_mix: "talk",
  evening_word_and_worship: "teaching",
  night_worship: "worship",
};

export const DEFAULT_DAYPART_CATEGORY: DaypartCategory = "special";

export function resolveDaypartCategory(shortName: string): DaypartCategory {
  return DAYPART_CATEGORY_BY_SHORT_NAME[shortName] ?? DEFAULT_DAYPART_CATEGORY;
}

export const CATEGORY_META: Record<
  DaypartCategory,
  { label: string; dot: string; badge: string }
> = {
  worship: { label: "Music & Worship", dot: "bg-purple-500", badge: "bg-purple-50 text-purple-700" },
  teaching: { label: "Teaching & Word", dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700" },
  prayer: { label: "Prayer", dot: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
  talk: { label: "Talk Shows", dot: "bg-teal-500", badge: "bg-teal-50 text-teal-700" },
  special: { label: "Special Programmes", dot: "bg-pink-500", badge: "bg-pink-50 text-pink-700" },
};

export const CATEGORY_FILTERS: { id: DaypartCategory | "all"; label: string; dot: string }[] = [
  { id: "all", label: "All Programmes", dot: "bg-brand-600" },
  { id: "worship", label: CATEGORY_META.worship.label, dot: CATEGORY_META.worship.dot },
  { id: "teaching", label: CATEGORY_META.teaching.label, dot: CATEGORY_META.teaching.dot },
  { id: "prayer", label: CATEGORY_META.prayer.label, dot: CATEGORY_META.prayer.dot },
  { id: "talk", label: CATEGORY_META.talk.label, dot: CATEGORY_META.talk.dot },
  { id: "special", label: CATEGORY_META.special.label, dot: CATEGORY_META.special.dot },
];
