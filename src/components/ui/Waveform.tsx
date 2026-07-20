interface WaveformProps {
  active: boolean;
  bars?: number;
  className?: string;
}

/** Animated waveform bars, only animating while `active` (audio playing).
 * Respects prefers-reduced-motion via the shared .animate-wave keyframes. */
export function Waveform({ active, bars = 32, className = "" }: WaveformProps) {
  return (
    <div
      className={`flex h-10 items-end gap-0.5 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => {
        const height = 25 + ((i * 37) % 75);
        return (
          <span
            key={i}
            className={`w-1 rounded-full bg-brand-500/70 ${active ? "animate-wave" : ""}`}
            style={{
              height: active ? `${height}%` : "15%",
              animationDelay: `${(i % 8) * 0.08}s`,
            }}
          />
        );
      })}
    </div>
  );
}
