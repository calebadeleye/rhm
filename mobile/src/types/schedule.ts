export type DaypartCategory = 'worship' | 'teaching' | 'prayer' | 'talk' | 'special';

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

/** A concrete occurrence of a Daypart on a specific calendar day. */
export interface DaypartOccurrence {
  daypart: Daypart;
  start: Date;
  end: Date;
  startMinutes: number;
  endMinutes: number;
  status: 'ended' | 'live' | 'upcoming';
}
