import { useQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../api/episodesService';

export const EPISODES_QUERY_KEY = ['episodes'] as const;

export function useEpisodes() {
  return useQuery({
    queryKey: EPISODES_QUERY_KEY,
    queryFn: ({ signal }) => fetchEpisodes(signal),
    staleTime: 5 * 60_000,
    retry: 2,
  });
}
