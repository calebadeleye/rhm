interface LiveBadgeProps {
  isOnline: boolean;
  className?: string;
}

export function LiveBadge({ isOnline, className = "" }: LiveBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
        isOnline ? "bg-brand-50 text-brand-700" : "bg-ink/5 text-ink-soft"
      } ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-brand-600" : "bg-ink-faint"}`}
        aria-hidden="true"
      />
      {isOnline ? "Live Now" : "Offline"}
    </span>
  );
}
