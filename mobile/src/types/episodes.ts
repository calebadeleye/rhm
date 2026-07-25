import type { DaypartCategory } from './schedule';

/** Mirrors server/src/services/episodes.ts's SafeEpisode. */
export interface Episode {
  id: string;
  title: string;
  description: string;
  category: DaypartCategory;
  artUrl: string | null;
  durationSeconds: number;
  publishedAt: string | null;
  downloadUrl: string;
}
