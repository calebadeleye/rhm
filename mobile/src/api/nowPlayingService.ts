import { fetchJson } from './client';
import { normaliseNowPlaying } from '../lib/normaliseNowPlaying';
import type { NormalisedNowPlaying } from '../types/azuracast';

export async function fetchNowPlaying(signal?: AbortSignal): Promise<NormalisedNowPlaying> {
  const json = await fetchJson<unknown>('/nowplaying', { signal });
  return normaliseNowPlaying(json);
}
