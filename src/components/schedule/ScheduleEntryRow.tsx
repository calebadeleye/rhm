import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Bell, BellRing, Radio } from "lucide-react";
import type { ScheduleEntry } from "@/lib/schedule";
import { getPresenterById } from "@/data/presenters";
import { downloadIcsReminder, scheduleBrowserReminder } from "@/lib/reminders";
import { usePlayer } from "@/context/PlayerContext";

const STATUS_STYLES: Record<ScheduleEntry["status"], string> = {
  live: "bg-brand-50 text-brand-700",
  upcoming: "bg-surface-muted text-ink-soft",
  ended: "bg-ink/5 text-ink-faint",
};

const STATUS_LABEL: Record<ScheduleEntry["status"], string> = {
  live: "Live",
  upcoming: "Upcoming",
  ended: "Ended",
};

export function ScheduleEntryRow({ entry }: { entry: ScheduleEntry }) {
  const { programme, start, end, status } = entry;
  const presenter = getPresenterById(programme.presenterId);
  const { play } = usePlayer();
  const [reminderSet, setReminderSet] = useState(false);

  const handleReminder = async () => {
    const notified = await scheduleBrowserReminder(
      `${programme.title} starts now`,
      `Redemption Radio — ${programme.title} with ${presenter?.name ?? "our team"}`,
      start
    );
    if (!notified) {
      downloadIcsReminder({
        title: `${programme.title} — Redemption Radio`,
        description: programme.shortDescription,
        start,
        end,
      });
    }
    setReminderSet(true);
  };

  return (
    <div className="flex flex-col gap-3 border-b border-ink/5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="w-20 shrink-0 text-sm font-semibold text-ink">
          {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
        </div>
        <div>
          <NavLink to={`/programmes/${programme.slug}`} className="font-semibold text-ink hover:text-brand-700">
            {programme.title}
          </NavLink>
          <p className="text-sm text-ink-soft">{presenter?.name ?? "Redemption Radio"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:justify-end">
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${STATUS_STYLES[status]}`}>
          {STATUS_LABEL[status]}
        </span>

        {status === "live" ? (
          <button type="button" onClick={play} className="btn-primary !px-3 !py-1.5 text-xs">
            <Radio className="h-3.5 w-3.5" aria-hidden="true" /> Listen
          </button>
        ) : status === "upcoming" ? (
          <button
            type="button"
            onClick={handleReminder}
            disabled={reminderSet}
            className="btn-secondary !px-3 !py-1.5 text-xs"
          >
            {reminderSet ? (
              <>
                <BellRing className="h-3.5 w-3.5" aria-hidden="true" /> Reminder set
              </>
            ) : (
              <>
                <Bell className="h-3.5 w-3.5" aria-hidden="true" /> Remind me
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
