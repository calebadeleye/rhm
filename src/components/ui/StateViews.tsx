import { AlertTriangle, Inbox, Loader2, RadioTower } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-ink-soft" role="status">
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 px-6 py-10 text-center">
      <AlertTriangle className="h-6 w-6 text-red-500" aria-hidden="true" />
      <p className="font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-2">
          Try again
        </button>
      )}
    </div>
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-ink/10 bg-surface-muted px-6 py-10 text-center">
      <RadioTower className="h-6 w-6 text-ink-faint" aria-hidden="true" />
      <p className="font-semibold text-ink">Redemption Radio is temporarily offline</p>
      <p className="max-w-sm text-sm text-ink-soft">
        We're working to get the stream back up. Please check back shortly, or explore recent
        messages and programmes while you wait.
      </p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-2">
          Retry connection
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
}: {
  title: string;
  message: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-12 text-center">
      {icon ?? <Inbox className="h-6 w-6 text-ink-faint" aria-hidden="true" />}
      <p className="font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
    </div>
  );
}
