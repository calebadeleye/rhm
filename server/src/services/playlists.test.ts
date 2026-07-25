import { describe, expect, it } from "vitest";
import { hhmmToMinutes, normalisePlaylist, type RawPlaylist } from "./playlists.js";

describe("hhmmToMinutes", () => {
  it("converts a standard HHMM value", () => {
    expect(hhmmToMinutes(1830)).toBe(18 * 60 + 30);
  });

  it("converts midnight", () => {
    expect(hhmmToMinutes(0)).toBe(0);
  });

  it("converts a single-digit-hour value like AzuraCast's 500 for 05:00", () => {
    expect(hhmmToMinutes(500)).toBe(5 * 60);
  });

  it("returns null for an out-of-range hour", () => {
    expect(hhmmToMinutes(2400)).toBeNull();
  });

  it("returns null for an out-of-range minute", () => {
    expect(hhmmToMinutes(1074)).toBeNull();
  });

  it("returns null for non-numeric input", () => {
    expect(hhmmToMinutes("1800")).toBeNull();
    expect(hhmmToMinutes(null)).toBeNull();
    expect(hhmmToMinutes(undefined)).toBeNull();
  });
});

describe("normalisePlaylist", () => {
  const basePlaylist: RawPlaylist = {
    id: 4,
    name: "Morning Devotional",
    short_name: "morning_devotional",
    description: "Opening prayer, Bible reading",
    is_enabled: true,
    schedule_items: [{ start_time: 500, end_time: 700, days: [] }],
  };

  it("normalises a valid scheduled playlist", () => {
    const result = normalisePlaylist(basePlaylist);
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Morning Devotional");
    expect(result?.scheduleItems).toEqual([{ startMinutes: 300, endMinutes: 420, days: [] }]);
  });

  it("excludes playlists with no schedule_items (always-on rotation/interstitial content)", () => {
    const result = normalisePlaylist({ ...basePlaylist, schedule_items: [] });
    expect(result).toBeNull();
  });

  it("excludes disabled playlists", () => {
    const result = normalisePlaylist({ ...basePlaylist, is_enabled: false });
    expect(result).toBeNull();
  });

  it("excludes playlists with no id", () => {
    const result = normalisePlaylist({ ...basePlaylist, id: undefined });
    expect(result).toBeNull();
  });

  it("drops individual schedule_items with malformed times but keeps the rest", () => {
    const result = normalisePlaylist({
      ...basePlaylist,
      schedule_items: [
        { start_time: 500, end_time: 700, days: [] },
        { start_time: 9999, end_time: 700, days: [] },
      ],
    });
    expect(result?.scheduleItems).toHaveLength(1);
  });

  it("filters out-of-range day values", () => {
    const result = normalisePlaylist({
      ...basePlaylist,
      schedule_items: [{ start_time: 500, end_time: 700, days: [1, 2, 9, -1] }],
    });
    expect(result?.scheduleItems[0].days).toEqual([1, 2]);
  });

  it("never includes admin fields like toggle/clone/reshuffle links", () => {
    const result = normalisePlaylist({
      ...basePlaylist,
      // @ts-expect-error simulating the raw AzuraCast payload's admin fields
      links: { toggle: "https://radio.example.com/api/station/1/playlist/4/toggle" },
    });
    expect(result).not.toHaveProperty("links");
  });

  it("falls back to a generic name when name is missing", () => {
    const result = normalisePlaylist({ ...basePlaylist, name: undefined });
    expect(result?.name).toBe("Playlist 4");
  });
});
