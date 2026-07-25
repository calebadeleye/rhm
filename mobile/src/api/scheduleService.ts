import { fetchJson } from './client';
import { normaliseSchedule } from '../lib/normaliseSchedule';
import type { Daypart } from '../types/schedule';

export async function fetchStationSchedule(signal?: AbortSignal): Promise<Daypart[]> {
  const json = await fetchJson<unknown>('/schedule', { signal });
  return normaliseSchedule(json);
}
