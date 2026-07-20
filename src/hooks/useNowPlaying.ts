import { useQuery } from "@tanstack/react-query";
import { fetchNowPlaying } from "@/lib/azuracast/service";

export const NOW_PLAYING_QUERY_KEY = ["now-playing"] as const;
export const NOW_PLAYING_POLL_MS = 15_000;

/** Polls the Now Playing endpoint every 15s. TanStack Query's default
 * `refetchIntervalInBackground: false` means polling automatically pauses
 * while the tab is hidden and resumes when it becomes active again. */
export function useNowPlaying() {
  return useQuery({
    queryKey: NOW_PLAYING_QUERY_KEY,
    queryFn: ({ signal }) => fetchNowPlaying(signal),
    refetchInterval: NOW_PLAYING_POLL_MS,
    refetchIntervalInBackground: false,
    staleTime: NOW_PLAYING_POLL_MS,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  });
}
