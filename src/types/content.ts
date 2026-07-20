export type WeekdayCode = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Presenter {
  id: string;
  name: string;
  bio: string;
  photoUrl: string | null;
}

export interface BroadcastSlot {
  /** 24h "HH:mm" in the station's source timezone (see VITE_STATION_TIMEZONE). */
  startTime: string;
  endTime: string;
  day: WeekdayCode;
}

export type ProgrammeCategory =
  | "teaching"
  | "worship"
  | "talk"
  | "prayer"
  | "testimony"
  | "overnight";

export interface Programme {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  presenterId: string;
  category: ProgrammeCategory;
  coverImageUrl: string;
  schedule: BroadcastSlot[];
}

export type MessageCategory =
  | "sermon"
  | "teaching"
  | "testimony"
  | "worship-devotional";

export interface SermonMessage {
  id: string;
  slug: string;
  title: string;
  description: string;
  speakerId: string;
  category: MessageCategory;
  publishedAt: string; // ISO date
  durationSeconds: number;
  thumbnailUrl: string;
  audioUrl: string | null;
}

export interface MinistryPillar {
  title: string;
  description: string;
}

export interface MinistryInfo {
  name: string;
  radioName: string;
  aboutShort: string;
  aboutLong: string;
  pillars: MinistryPillar[];
  address: string;
  officeHours: string;
}
