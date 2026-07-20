import { useMemo, useState } from "react";
import { Seo } from "@/components/seo/Seo";
import { getTodaysSchedule, getWeeklySchedule, WEEKDAY_LABELS, WEEKDAY_ORDER, formatSlotTimeRange } from "@/lib/schedule";
import { ScheduleEntryRow } from "@/components/schedule/ScheduleEntryRow";
import { EmptyState } from "@/components/ui/StateViews";
import { getPresenterById } from "@/data/presenters";
import { env } from "@/lib/env";
import type { ProgrammeCategory, WeekdayCode } from "@/types/content";
import { NavLink } from "react-router-dom";

const CATEGORIES: { id: ProgrammeCategory | "all"; label: string }[] = [
  { id: "all", label: "All Categories" },
  { id: "teaching", label: "Teaching" },
  { id: "worship", label: "Worship" },
  { id: "talk", label: "Talk" },
  { id: "prayer", label: "Prayer" },
  { id: "testimony", label: "Testimony" },
  { id: "overnight", label: "Overnight" },
];

export default function Schedule() {
  const [view, setView] = useState<"today" | "weekly">("today");
  const [dayFilter, setDayFilter] = useState<WeekdayCode>(WEEKDAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [categoryFilter, setCategoryFilter] = useState<ProgrammeCategory | "all">("all");

  const todaysEntries = useMemo(() => getTodaysSchedule(), []);
  const weekly = useMemo(() => getWeeklySchedule(), []);

  const filteredToday = todaysEntries.filter(
    (entry) => categoryFilter === "all" || entry.programme.category === categoryFilter
  );

  const filteredWeeklyDay = weekly[dayFilter].filter(
    ({ programme }) => categoryFilter === "all" || programme.category === categoryFilter
  );

  return (
    <>
      <Seo
        title="Schedule"
        description="See what's playing on Redemption Radio today and throughout the week."
        path="/schedule"
      />

      <section className="container-page py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">Broadcast Schedule</p>
          <h1 className="text-3xl font-bold text-ink">What's Playing</h1>
          <p className="mt-2 text-sm text-ink-faint">
            Times shown in your local timezone. Redemption Radio broadcasts from{" "}
            {env.stationTimezone.replace("_", " ")}.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex rounded-full border border-ink/15 p-1">
            <button
              type="button"
              onClick={() => setView("today")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === "today" ? "bg-brand-600 text-white" : "text-ink-soft"}`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setView("weekly")}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === "weekly" ? "bg-brand-600 text-white" : "text-ink-soft"}`}
            >
              Weekly
            </button>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ProgrammeCategory | "all")}
            className="input w-auto"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {view === "weekly" && (
          <div className="mb-6 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by day">
            {WEEKDAY_ORDER.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setDayFilter(day)}
                aria-pressed={dayFilter === day}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
                  dayFilter === day ? "bg-brand-600 text-white" : "border border-ink/15 text-ink-soft hover:bg-surface-muted"
                }`}
              >
                {WEEKDAY_LABELS[day].slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        <div className="card mx-auto max-w-3xl p-6 sm:p-8">
          {view === "today" ? (
            filteredToday.length === 0 ? (
              <EmptyState title="Nothing scheduled" message="No programmes match this filter today." />
            ) : (
              filteredToday.map((entry) => (
                <ScheduleEntryRow key={`${entry.programme.id}-${entry.slot.startTime}`} entry={entry} />
              ))
            )
          ) : filteredWeeklyDay.length === 0 ? (
            <EmptyState title="Nothing scheduled" message={`No programmes match this filter on ${WEEKDAY_LABELS[dayFilter]}.`} />
          ) : (
            <div>
              {filteredWeeklyDay.map(({ programme, slot }, index) => {
                const presenter = getPresenterById(programme.presenterId);
                return (
                  <div key={`${programme.id}-${index}`} className="flex items-center justify-between border-b border-ink/5 py-4 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-28 shrink-0 text-sm font-semibold text-ink">{formatSlotTimeRange(slot)}</div>
                      <div>
                        <NavLink to={`/programmes/${programme.slug}`} className="font-semibold text-ink hover:text-brand-700">
                          {programme.title}
                        </NavLink>
                        <p className="text-sm text-ink-soft">{presenter?.name}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
