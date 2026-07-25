import { describe, expect, it } from "vitest";
import {
  formatMinutes12,
  formatMinutes24,
  getCurrentAndNext,
  getOccurrencesForDate,
  getWeekStationDates,
  withStatus,
} from "@/lib/liveSchedule";
import type { StationDateInfo } from "@/lib/timezone";
import type { Daypart } from "@/types/schedule";

const TZ = "UTC";

function daypart(overrides: Partial<Daypart> = {}): Daypart {
  return {
    id: 1,
    name: "Morning Devotional",
    shortName: "morning_devotional",
    description: "",
    category: "prayer",
    scheduleItems: [{ startMinutes: 300, endMinutes: 420, days: [] }],
    ...overrides,
  };
}

// Wednesday 2026-07-22 in UTC.
const WEDNESDAY: StationDateInfo = { year: 2026, month: 7, day: 22, weekdayIndex: 3 };

describe("getOccurrencesForDate — non-wrapping slots", () => {
  it("produces one occurrence for an every-day slot", () => {
    const occurrences = getOccurrencesForDate([daypart()], WEDNESDAY, TZ);
    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].start.toISOString()).toBe("2026-07-22T05:00:00.000Z");
    expect(occurrences[0].end.toISOString()).toBe("2026-07-22T07:00:00.000Z");
  });

  it("respects a day-of-week restriction", () => {
    const tuesdayOnly = daypart({
      scheduleItems: [{ startMinutes: 300, endMinutes: 420, days: [2] }],
    });
    expect(getOccurrencesForDate([tuesdayOnly], WEDNESDAY, TZ)).toHaveLength(0);

    const wednesdayOnly = daypart({
      scheduleItems: [{ startMinutes: 300, endMinutes: 420, days: [3] }],
    });
    expect(getOccurrencesForDate([wednesdayOnly], WEDNESDAY, TZ)).toHaveLength(1);
  });
});

describe("getOccurrencesForDate — overnight-wrapping slots", () => {
  const nightWorship = daypart({
    id: 9,
    name: "Night Worship",
    shortName: "night_worship",
    scheduleItems: [{ startMinutes: 1320, endMinutes: 300, days: [] }], // 22:00–05:00
  });

  it("splits into a tail (00:00–05:00) and a head (22:00–24:00) occurrence", () => {
    const occurrences = getOccurrencesForDate([nightWorship], WEDNESDAY, TZ);
    expect(occurrences).toHaveLength(2);

    const [tail, head] = occurrences;
    expect(tail.start.toISOString()).toBe("2026-07-22T00:00:00.000Z");
    expect(tail.end.toISOString()).toBe("2026-07-22T05:00:00.000Z");
    expect(head.start.toISOString()).toBe("2026-07-22T22:00:00.000Z");
    expect(head.end.toISOString()).toBe("2026-07-23T00:00:00.000Z");
  });

  it("omits the tail when the previous day isn't scheduled", () => {
    const tuesdayAndWednesdayOnly = daypart({
      scheduleItems: [{ startMinutes: 1320, endMinutes: 300, days: [2, 3] }], // Tue, Wed
    });
    // Tail on Wednesday comes from Tuesday's block — Tuesday IS included, so tail stays.
    expect(getOccurrencesForDate([tuesdayAndWednesdayOnly], WEDNESDAY, TZ)).toHaveLength(2);

    const wednesdayOnly = daypart({
      scheduleItems: [{ startMinutes: 1320, endMinutes: 300, days: [3] }],
    });
    // Tail on Wednesday would come from Tuesday's block — Tuesday NOT included, so only head.
    const occurrences = getOccurrencesForDate([wednesdayOnly], WEDNESDAY, TZ);
    expect(occurrences).toHaveLength(1);
    expect(occurrences[0].start.toISOString()).toBe("2026-07-22T22:00:00.000Z");
  });
});

describe("withStatus", () => {
  it("marks an occurrence live when now falls inside its range", () => {
    const occ = { daypart: daypart(), start: new Date("2026-07-22T05:00:00Z"), end: new Date("2026-07-22T07:00:00Z"), startMinutes: 300, endMinutes: 420 };
    const [result] = withStatus([occ], new Date("2026-07-22T06:00:00Z"));
    expect(result.status).toBe("live");
  });

  it("marks an occurrence upcoming before it starts", () => {
    const occ = { daypart: daypart(), start: new Date("2026-07-22T05:00:00Z"), end: new Date("2026-07-22T07:00:00Z"), startMinutes: 300, endMinutes: 420 };
    const [result] = withStatus([occ], new Date("2026-07-22T04:00:00Z"));
    expect(result.status).toBe("upcoming");
  });

  it("marks an occurrence ended after it finishes", () => {
    const occ = { daypart: daypart(), start: new Date("2026-07-22T05:00:00Z"), end: new Date("2026-07-22T07:00:00Z"), startMinutes: 300, endMinutes: 420 };
    const [result] = withStatus([occ], new Date("2026-07-22T08:00:00Z"));
    expect(result.status).toBe("ended");
  });
});

describe("getCurrentAndNext", () => {
  const gospelInspiration = daypart({
    id: 6,
    name: "Gospel Inspiration",
    shortName: "gospel_inspiration",
    scheduleItems: [{ startMinutes: 600, endMinutes: 840, days: [] }], // 10:00–14:00
  });
  const dayparts = [daypart(), gospelInspiration]; // Morning Devotional 05:00–07:00

  it("finds the currently live daypart and the next upcoming one today", () => {
    const now = new Date("2026-07-22T06:00:00Z"); // inside Morning Devotional
    const { current, next } = getCurrentAndNext(dayparts, now, TZ);
    expect(current?.daypart.name).toBe("Morning Devotional");
    expect(next?.daypart.name).toBe("Gospel Inspiration");
  });

  it("falls back to tomorrow's first occurrence when nothing is left today", () => {
    const now = new Date("2026-07-22T23:00:00Z"); // after everything today
    const { current, next } = getCurrentAndNext(dayparts, now, TZ);
    expect(current).toBeNull();
    expect(next?.daypart.name).toBe("Morning Devotional");
    expect(next?.start.toISOString()).toBe("2026-07-23T05:00:00.000Z");
  });

  it("returns null current when nothing is live", () => {
    const now = new Date("2026-07-22T08:00:00Z"); // between the two blocks
    const { current } = getCurrentAndNext(dayparts, now, TZ);
    expect(current).toBeNull();
  });
});

describe("getWeekStationDates", () => {
  it("returns a Sunday-through-Saturday week containing the given date", () => {
    const week = getWeekStationDates(WEDNESDAY);
    expect(week).toHaveLength(7);
    expect(week[0].weekdayIndex).toBe(0);
    expect(week[6].weekdayIndex).toBe(6);
    expect(week[3]).toEqual(WEDNESDAY);
  });
});

describe("formatMinutes24", () => {
  it("formats a mid-morning time", () => {
    expect(formatMinutes24(300)).toBe("05:00");
  });

  it("formats midnight rollover (1440) as 00:00", () => {
    expect(formatMinutes24(1440)).toBe("00:00");
  });

  it("pads single-digit hours and minutes", () => {
    expect(formatMinutes24(65)).toBe("01:05");
  });
});

describe("formatMinutes12", () => {
  it("formats noon as 12 PM", () => {
    expect(formatMinutes12(720)).toBe("12 PM");
  });

  it("formats midnight as 12 AM", () => {
    expect(formatMinutes12(0)).toBe("12 AM");
  });

  it("formats an afternoon time with minutes", () => {
    expect(formatMinutes12(750)).toBe("12:30 PM");
  });

  it("formats a morning time", () => {
    expect(formatMinutes12(300)).toBe("5 AM");
  });
});
