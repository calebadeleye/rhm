import { fetchJson } from './client';
import type { Episode } from '../types/episodes';
import type { DaypartCategory } from '../types/schedule';

const VALID_CATEGORIES: DaypartCategory[] = ['worship', 'teaching', 'prayer', 'talk', 'special'];

function normaliseEpisode(raw: unknown): Episode | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  if (typeof data.id !== 'string' || typeof data.downloadUrl !== 'string') return null;

  const category = VALID_CATEGORIES.includes(data.category as DaypartCategory)
    ? (data.category as DaypartCategory)
    : 'special';

  return {
    id: data.id,
    title: typeof data.title === 'string' ? data.title : 'Untitled episode',
    description: typeof data.description === 'string' ? data.description : '',
    category,
    artUrl: typeof data.artUrl === 'string' ? data.artUrl : null,
    durationSeconds: typeof data.durationSeconds === 'number' ? data.durationSeconds : 0,
    publishedAt: typeof data.publishedAt === 'string' ? data.publishedAt : null,
    downloadUrl: data.downloadUrl,
  };
}

export async function fetchEpisodes(signal?: AbortSignal): Promise<Episode[]> {
  const json = await fetchJson<unknown>('/episodes', { signal });
  if (!json || typeof json !== 'object') return [];
  const list = Array.isArray((json as Record<string, unknown>).episodes)
    ? (json as Record<string, unknown>).episodes
    : [];
  return (list as unknown[]).map(normaliseEpisode).filter((e): e is Episode => e !== null);
}
