/** "18:24" / "1:02:03" style clock format. */
export function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDurationMinutes(totalSeconds: number): string {
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} min`;
}

/** "Today", "Yesterday", or a short date — plus a 12h time, matching the
 * mockup's "Yesterday • 7:00 PM" convention. */
export function formatRelativeDateTime(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  if (dayDiff === 0) return `Today • ${timeLabel}`;
  if (dayDiff === 1) return `Yesterday • ${timeLabel}`;
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${dateLabel} • ${timeLabel}`;
}
