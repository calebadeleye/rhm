import { Users } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { PlayButton } from "@/components/player/PlayButton";
import { CoverArt } from "@/components/ui/CoverArt";
import { OfflineState } from "@/components/ui/StateViews";
import { formatMinutes12 } from "@/lib/liveSchedule";
import type { DaypartOccurrence } from "@/types/schedule";

interface OnAirNowCardProps {
  current: DaypartOccurrence | null;
  next: DaypartOccurrence | null;
}

export function OnAirNowCard({ current, next }: OnAirNowCardProps) {
  const { nowPlaying, isStationOffline, retry } = usePlayer();

  if (isStationOffline) {
    return (
      <div className="card p-5 sm:p-6">
        <OfflineState onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />
          On Air Now
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          <span aria-live="polite">{nowPlaying.listenerCount} listening</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <CoverArt
          src={null}
          alt={current?.daypart.name ?? "Redemption Radio"}
          category={current?.daypart.category ?? "worship"}
          className="h-16 w-16 shrink-0 rounded-xl"
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-ink">{current?.daypart.name ?? "Redemption Radio"}</p>
          <p className="truncate text-sm text-ink-soft">Redemption Radio</p>
        </div>
      </div>

      <div className="my-5 grid grid-cols-2 gap-4 border-y border-ink/5 py-4 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Listeners</p>
          <p className="mt-0.5 font-bold text-ink">{nowPlaying.listenerCount}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Next</p>
          <p className="mt-0.5 truncate font-bold text-ink">{next?.daypart.name ?? "—"}</p>
          {next && <p className="text-xs text-ink-soft">{formatMinutes12(next.startMinutes)}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <PlayButton />
      </div>
    </div>
  );
}
