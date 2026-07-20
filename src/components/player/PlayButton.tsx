import { Loader2, Pause, Play } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

interface PlayButtonProps {
  size?: "sm" | "lg";
}

export function PlayButton({ size = "lg" }: PlayButtonProps) {
  const { status, toggle, isStationOffline } = usePlayer();
  const dimensions = size === "lg" ? "h-14 w-14" : "h-10 w-10";
  const iconSize = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  const isBuffering = status === "buffering" || status === "loading";
  const isPlaying = status === "playing";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isStationOffline}
      aria-label={isPlaying ? "Pause Redemption Radio" : "Play Redemption Radio"}
      aria-pressed={isPlaying}
      className={`flex ${dimensions} shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-card transition-transform hover:bg-brand-700 active:scale-95 disabled:bg-ink/20`}
    >
      {isBuffering ? (
        <Loader2 className={`${iconSize} animate-spin`} aria-hidden="true" />
      ) : isPlaying ? (
        <Pause className={iconSize} aria-hidden="true" fill="currentColor" />
      ) : (
        <Play className={`${iconSize} translate-x-0.5`} aria-hidden="true" fill="currentColor" />
      )}
    </button>
  );
}
