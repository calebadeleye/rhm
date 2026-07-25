import { useQuery } from '@tanstack/react-query';
import { fetchStationSchedule } from '../api/scheduleService';

export const SCHEDULE_QUERY_KEY = ['station-schedule'] as const;

/** The programme grid rarely changes, so this polls far less aggressively
 * than now-playing — refetch every 5 minutes. */
export function useStationSchedule() {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEY,
    queryFn: ({ signal }) => fetchStationSchedule(signal),
    refetchInterval: 5 * 60_000,
    staleTime: 60_000,
    retry: 2,
  });
}
