export type DaypartCategory = "worship" | "teaching" | "prayer" | "talk" | "special";

export interface DaypartScheduleItem {
  /** Minutes since midnight, station-local time. */
  startMinutes: number;
  /** Minutes since midnight, station-local time. Less than startMinutes
   * means the slot wraps past midnight. */
  endMinutes: number;
  /** 0 (Sunday) – 6 (Saturday). Empty means every day. */
  days: number[];
}

/** A real, scheduled programme block sourced from an AzuraCast playlist
 * that has schedule_items configured. */
export interface Daypart {
  id: number;
  name: string;
  shortName: string;
  description: string;
  category: DaypartCategory;
  scheduleItems: DaypartScheduleItem[];
}

/** A concrete occurrence of a Daypart on a specific calendar day.
 * `start`/`end` are real instants (used to compute live status correctly
 * across DST etc). `startMinutes`/`endMinutes` are the station's own
 * wall-clock boundary (0–1440) — the schedule is displayed in one
 * canonical station timezone for every visitor (labelled in the UI),
 * rather than converted per-viewer, so display should read from these. */
export interface DaypartOccurrence {
  daypart: Daypart;
  start: Date;
  end: Date;
  startMinutes: number;
  endMinutes: number;
  status: "ended" | "live" | "upcoming";
}
