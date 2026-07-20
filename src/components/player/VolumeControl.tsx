import { Volume1, Volume2, VolumeX } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export function VolumeControl({ className = "" }: { className?: string }) {
  const { volume, isMuted, setVolume, toggleMute } = usePlayer();
  const Icon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        aria-pressed={isMuted}
        className="text-ink-soft hover:text-brand-700"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={isMuted ? 0 : volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-label="Volume"
        className="h-1.5 w-24 cursor-pointer accent-brand-600"
      />
    </div>
  );
}
