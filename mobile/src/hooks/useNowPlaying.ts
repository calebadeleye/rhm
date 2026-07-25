import { useQuery } from '@tanstack/react-query';
import { fetchNowPlaying } from '../api/nowPlayingService';

export const NOW_PLAYING_QUERY_KEY = ['now-playing'] as const;

/** Polls roughly in step with the backend's 8s upstream cache. */
export function useNowPlaying() {
  return useQuery({
    queryKey: NOW_PLAYING_QUERY_KEY,
    queryFn: ({ signal }) => fetchNowPlaying(signal),
    refetchInterval: 15_000,
    staleTime: 10_000,
    retry: 2,
  });
}
