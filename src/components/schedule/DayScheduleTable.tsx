import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CategoryBadge } from "@/components/schedule/CategoryBadge";
import { StatusIcon, StatusPill } from "@/components/schedule/StatusPill";
import { EmptyState } from "@/components/ui/StateViews";
import { formatMinutes12 } from "@/lib/liveSchedule";
import { downloadIcsReminder, scheduleBrowserReminder } from "@/lib/reminders";
import type { DaypartOccurrence } from "@/types/schedule";

interface DayScheduleTableProps {
  occurrences: DaypartOccurrence[];
  nextId: number | null;
  emptyMessage?: string;
}

export function DayScheduleTable({ occurrences, nextId, emptyMessage }: DayScheduleTableProps) {
  const [remindedIds, setRemindedIds] = useState<Set<number>>(new Set());

  if (occurrences.length === 0) {
    return (
      <EmptyState
        title="Nothing scheduled"
        message={emptyMessage ?? "No programmes match this filter for the selected day."}
      />
    );
  }

  const handleReminder = async (occurrence: DaypartOccurrence) => {
    const notified = await scheduleBrowserReminder(
      `${occurrence.daypart.name} starts now`,
      `Redemption Radio — ${occurrence.daypart.name}`,
      occurrence.start
    );
    if (!notified) {
      downloadIcsReminder({
        title: `${occurrence.daypart.name} — Redemption Radio`,
        description: occurrence.daypart.description || occurrence.daypart.name,
        start: occurrence.start,
        end: occurrence.end,
      });
    }
    setRemindedIds((prev) => new Set(prev).add(occurrence.daypart.id));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink-faint">
            <th className="py-3 pr-4 font-bold">Time</th>
            <th className="py-3 pr-4 font-bold">Programme</th>
            <th className="py-3 pr-4 font-bold">Presenter</th>
            <th className="py-3 pr-4 font-bold">Category</th>
            <th className="py-3 pr-4 font-bold">Status</th>
            <th className="py-3 pr-2 font-bold" aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {occurrences.map((occurrence, index) => {
            const isUpNext = nextId === occurrence.daypart.id && occurrence.status === "upcoming";
            const status = isUpNext ? "up-next" : occurrence.status;
            return (
              <tr
                key={`${occurrence.daypart.id}-${occurrence.startMinutes}-${index}`}
                className={`border-b border-ink/5 last:border-0 ${occurrence.status === "live" ? "bg-brand-50/40" : ""}`}
              >
                <td className="whitespace-nowrap py-4 pr-4 align-top font-semibold text-ink">
                  {formatMinutes12(occurrence.startMinutes)} - {formatMinutes12(occurrence.endMinutes)}
                </td>
                <td className="py-4 pr-4 align-top">
                  <NavLink
                    to={`/schedule#${occurrence.daypart.shortName}`}
                    className="font-semibold text-ink hover:text-brand-700"
                  >
                    {occurrence.daypart.name}
                  </NavLink>
                  {occurrence.daypart.description && (
                    <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-ink-faint">
                      {occurrence.daypart.description.split("\n")[0]}
                    </p>
                  )}
                </td>
                <td className="py-4 pr-4 align-top text-ink-soft">Redemption Radio</td>
                <td className="py-4 pr-4 align-top">
                  <CategoryBadge category={occurrence.daypart.category} />
                </td>
                <td className="py-4 pr-4 align-top">
                  <StatusPill status={status} />
                </td>
                <td className="py-4 pr-2 align-top">
                  <StatusIcon
                    status={status}
                    reminderSet={remindedIds.has(occurrence.daypart.id)}
                    onSetReminder={isUpNext ? () => handleReminder(occurrence) : undefined}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
