import { Heart, RotateCw, Share2, Users } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { PlayButton } from "@/components/player/PlayButton";
import { VolumeControl } from "@/components/player/VolumeControl";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { CoverArt } from "@/components/ui/CoverArt";
import { Waveform } from "@/components/ui/Waveform";
import { OfflineState } from "@/components/ui/StateViews";

export function HeroLiveCard() {
  const player = usePlayer();
  const { nowPlaying, status, isStationOffline, isFetchError, retry } = player;

  if (isFetchError && isStationOffline) {
    return (
      <div className="card p-5 sm:p-6">
        <OfflineState onRetry={retry} />
      </div>
    );
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <LiveBadge isOnline={nowPlaying.isOnline} />
        {nowPlaying.isOnline && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span aria-live="polite">{nowPlaying.listenerCount} listening</span>
          </span>
        )}
      </div>

      {isStationOffline ? (
        <OfflineState onRetry={retry} />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <CoverArt
              src={nowPlaying.song.artUrl}
              alt={nowPlaying.song.title}
              category="worship"
              className="h-20 w-20 shrink-0 rounded-xl"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-ink">{nowPlaying.song.title}</p>
              <p className="truncate text-sm text-ink-soft">{nowPlaying.song.artist}</p>
              {nowPlaying.streamerName && (
                <p className="mt-1 truncate text-xs font-semibold text-brand-700">
                  with {nowPlaying.streamerName}
                </p>
              )}
            </div>
          </div>

          <Waveform active={status === "playing"} className="my-5" />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {status === "error" ? (
                <button type="button" onClick={retry} className="btn-primary !px-4">
                  <RotateCw className="h-4 w-4" aria-hidden="true" /> Reconnect
                </button>
              ) : (
                <PlayButton />
              )}
              <VolumeControl className="hidden sm:flex" />
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <button
                type="button"
                aria-label="Favourite this stream"
                className="rounded-full p-2 hover:bg-surface-muted hover:text-brand-700"
              >
                <Heart className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Share"
                className="rounded-full p-2 hover:bg-surface-muted hover:text-brand-700"
              >
                <Share2 className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="sr-only" aria-live="polite">
            {`Now playing: ${nowPlaying.song.title} by ${nowPlaying.song.artist}`}
          </div>
        </>
      )}
    </div>
  );
}
