import { useEffect } from "react";
import { ChevronUp, RotateCw, Users, X } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";
import { PlayButton } from "@/components/player/PlayButton";
import { VolumeControl } from "@/components/player/VolumeControl";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { CoverArt } from "@/components/ui/CoverArt";
import { ShareButton } from "@/components/ui/ShareButton";
import { Waveform } from "@/components/ui/Waveform";
import { env } from "@/lib/env";

/** Persistent global player bar. Mounted once at the App root so it survives
 * route navigation; visibility/expansion is local UI state only — playback
 * itself lives in PlayerContext and is never remounted. */
export function GlobalPlayer() {
  const player = usePlayer();
  const { nowPlaying, status, isExpanded, setExpanded, retry, isStationOffline } = player;

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
        role="region"
        aria-label="Radio player"
      >
        <div className="container-page flex items-center gap-3 py-2.5 sm:gap-4">
          <button
            type="button"
            onClick={() => setExpanded(!isExpanded)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-expanded={isExpanded}
            aria-label="Expand player"
          >
            <CoverArt
              src={nowPlaying.song.artUrl}
              alt={nowPlaying.song.title}
              category="worship"
              className="h-11 w-11 shrink-0 rounded-lg"
            />
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <LiveBadge isOnline={nowPlaying.isOnline} />
              </span>
              <span className="block truncate text-sm font-semibold text-ink">
                {nowPlaying.song.title}
              </span>
              <span className="block truncate text-xs text-ink-soft">
                {nowPlaying.song.artist}
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1.5 text-xs text-ink-soft sm:flex">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            <span aria-live="polite">{nowPlaying.listenerCount}</span>
          </div>

          {status === "error" ? (
            <button
              type="button"
              onClick={retry}
              className="btn-secondary !px-3 !py-2 text-xs"
              aria-label="Reconnect to stream"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <PlayButton size="sm" />
          )}

          <VolumeControl className="hidden md:flex" />

          <button
            type="button"
            onClick={() => setExpanded(!isExpanded)}
            className="hidden text-ink-soft hover:text-brand-700 sm:block"
            aria-label={isExpanded ? "Collapse player" : "Expand player"}
          >
            <ChevronUp
              className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <div className="sr-only" aria-live="polite">
          {isStationOffline
            ? "Redemption Radio is temporarily offline"
            : `Now playing: ${nowPlaying.song.title} by ${nowPlaying.song.artist}`}
        </div>
      </div>

      {isExpanded && <FullPlayerPanel />}
    </>
  );
}

function FullPlayerPanel() {
  const { nowPlaying, status, errorMessage, setExpanded, retry, isStationOffline } = usePlayer();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [setExpanded]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Now playing"
    >
      <button
        type="button"
        onClick={() => setExpanded(false)}
        aria-label="Close player"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <div className="card relative w-full max-w-md p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="absolute right-4 top-4 text-ink-soft hover:text-ink"
          aria-label="Close player"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-4 flex items-center justify-between">
          <LiveBadge isOnline={nowPlaying.isOnline} />
          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            {nowPlaying.listenerCount} listening
          </div>
        </div>

        <CoverArt
          src={nowPlaying.song.artUrl}
          alt={nowPlaying.song.title}
          category="worship"
          className="mb-5 aspect-square w-full rounded-xl2"
        />

        <h2 className="text-xl font-bold text-ink">{nowPlaying.song.title}</h2>
        <p className="mb-1 text-ink-soft">{nowPlaying.song.artist}</p>
        {nowPlaying.streamerName && (
          <p className="mb-4 text-sm text-brand-700">with {nowPlaying.streamerName}</p>
        )}

        <Waveform active={status === "playing"} className="my-4" />

        {isStationOffline ? (
          <p className="my-4 text-center text-sm text-ink-soft">
            Redemption Radio is temporarily offline. Please check back shortly.
          </p>
        ) : status === "error" ? (
          <div className="my-4 flex flex-col items-center gap-2 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
            <button type="button" onClick={retry} className="btn-secondary">
              <RotateCw className="h-4 w-4" aria-hidden="true" /> Reconnect
            </button>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-4">
          <PlayButton size="lg" />
          <VolumeControl />
          <ShareButton title={nowPlaying.song.title} url={env.siteUrl} text="Listening to Redemption Radio" />
        </div>
      </div>
    </div>
  );
}
