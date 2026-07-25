export type DaypartCategory = "worship" | "teaching" | "prayer" | "talk" | "special";

/**
 * Maps a playlist's AzuraCast short_name to our public category taxonomy.
 * Mirrors src/data/daypartCategories.ts on the frontend — kept as a
 * separate copy here because server/ and src/ build independently and
 * don't share modules across the path-alias boundary.
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
