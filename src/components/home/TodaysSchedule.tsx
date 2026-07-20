import { NavLink } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { getTodaysSchedule } from "@/lib/schedule";
import { ScheduleEntryRow } from "@/components/schedule/ScheduleEntryRow";
import { EmptyState } from "@/components/ui/StateViews";
import { env } from "@/lib/env";

export function TodaysSchedule() {
  const entries = getTodaysSchedule();

  return (
    <section className="bg-surface-muted py-16" aria-labelledby="todays-schedule-heading">
      <div className="container-page">
        <div className="card p-6 sm:p-8">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 id="todays-schedule-heading" className="flex items-center gap-2 text-lg font-bold text-ink">
              <CalendarDays className="h-5 w-5 text-brand-600" aria-hidden="true" />
              This Week on Redemption Radio
            </h2>
            <NavLink to="/schedule" className="text-sm font-semibold text-brand-700 hover:underline">
              View Full Schedule →
            </NavLink>
          </div>
          <p className="mb-4 text-xs text-ink-faint">
            Times shown in your local timezone (station broadcasts on {env.stationTimezone.replace("_", " ")}).
          </p>

          {entries.length === 0 ? (
            <EmptyState title="Nothing scheduled today" message="Check the weekly schedule for upcoming programmes." />
          ) : (
            <div>
              {entries.map((entry) => (
                <ScheduleEntryRow key={`${entry.programme.id}-${entry.slot.startTime}`} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
