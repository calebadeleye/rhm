import { Bell, BellRing, Clock, Volume2 } from "lucide-react";
import type { DaypartOccurrence } from "@/types/schedule";

type Status = DaypartOccurrence["status"] | "up-next";

const STYLES: Record<Status, string> = {
  live: "bg-brand-50 text-brand-700",
  "up-next": "border border-teal-200 bg-teal-50 text-teal-700",
  upcoming: "bg-blue-50 text-blue-700",
  ended: "bg-ink/5 text-ink-faint",
};

const LABELS: Record<Status, string> = {
  live: "On Air",
  "up-next": "Up Next",
  upcoming: "Upcoming",
  ended: "Ended",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase ${STYLES[status]}`}>
      {status === "live" && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden="true" />}
      {LABELS[status]}
    </span>
  );
}

/** The small trailing action icon shown to the right of each schedule row
 * in the mockup — speaker for on-air, clock for upcoming, bell for the
 * immediate next slot (doubles as the reminder button). */
export function StatusIcon({
  status,
  reminderSet,
  onSetReminder,
}: {
  status: Status;
  reminderSet?: boolean;
  onSetReminder?: () => void;
}) {
  if (status === "live") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600" aria-hidden="true">
        <Volume2 className="h-4 w-4" />
      </span>
    );
  }

  if (status === "up-next" && onSetReminder) {
    return (
      <button
        type="button"
        onClick={onSetReminder}
        disabled={reminderSet}
        aria-label={reminderSet ? "Reminder set" : "Set reminder"}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-200 text-teal-700 hover:bg-teal-50 disabled:opacity-60"
      >
        {reminderSet ? <BellRing className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint" aria-hidden="true">
      <Clock className="h-4 w-4" />
    </span>
  );
}
