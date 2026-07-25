import { useEffect, useMemo, useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { useStationSchedule } from "@/hooks/useStationSchedule";
import { OnAirNowCard } from "@/components/schedule/OnAirNowCard";
import { ScheduleCalendar, type CalendarDate } from "@/components/schedule/ScheduleCalendar";
import { CategoryFilterList } from "@/components/schedule/CategoryFilterList";
import { DayScheduleTable } from "@/components/schedule/DayScheduleTable";
import { WeekListView } from "@/components/schedule/WeekListView";
import { WeeklyGridView } from "@/components/schedule/WeeklyGridView";
import { ErrorState, LoadingState } from "@/components/ui/StateViews";
import { env } from "@/lib/env";
import { downloadIcsCalendar } from "@/lib/reminders";
import {
  getCurrentAndNext,
  getOccurrencesForDate,
  getWeekStationDates,
  withStatus,
} from "@/lib/liveSchedule";
import { getStationDateInfo, weekdayIndexForDate } from "@/lib/timezone";
import type { DaypartCategory } from "@/types/schedule";

type Tab = "today" | "week" | "grid";

function sameDate(a: CalendarDate, b: { year: number; month: number; day: number }): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export default function Schedule() {
  const { data: dayparts, isLoading, isError, refetch } = useStationSchedule();
  const timeZone = env.stationTimezone;

  const [tab, setTab] = useState<Tab>("today");
  const [category, setCategory] = useState<DaypartCategory | "all">("all");

  // Re-render every minute so ON AIR / UPCOMING / ENDED statuses stay
  // accurate without a full page reload.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const todayInfo = useMemo(() => getStationDateInfo(now, timeZone), [now, timeZone]);

  const [selected, setSelected] = useState<CalendarDate>(() => {
    const info = getStationDateInfo(new Date(), timeZone);
    return { year: info.year, month: info.month, day: info.day };
  });
  const [viewYear, setViewYear] = useState(selected.year);
  const [viewMonth, setViewMonth] = useState(selected.month);

  const handleChangeMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth() + 1);
  };

  const handleSelectDate = (date: CalendarDate) => {
    setSelected(date);
    setViewYear(date.year);
    setViewMonth(date.month);
  };

  const selectedInfo = useMemo(
    () => ({ ...selected, weekdayIndex: weekdayIndexForDate(selected.year, selected.month, selected.day) }),
    [selected]
  );
  const isViewingToday = sameDate(selected, todayInfo);

  const list = useMemo(() => dayparts ?? [], [dayparts]);

  const { current, next } = useMemo(() => getCurrentAndNext(list, now, timeZone), [list, now, timeZone]);

  const matchesCategory = (daypartCategory: DaypartCategory) => category === "all" || daypartCategory === category;

  const todaysOccurrences = useMemo(() => {
    const raw = getOccurrencesForDate(list, selectedInfo, timeZone).filter((o) => matchesCategory(o.daypart.category));
    return withStatus(raw, now);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, selectedInfo, timeZone, now, category]);

  const week = useMemo(() => getWeekStationDates(selectedInfo), [selectedInfo]);
  const todayIndexInWeek = week.findIndex((d) => d.year === todayInfo.year && d.month === todayInfo.month && d.day === todayInfo.day);

  const weekOccurrencesRaw = useMemo(
    () => week.map((day) => getOccurrencesForDate(list, day, timeZone).filter((o) => matchesCategory(o.daypart.category))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, week, timeZone, category]
  );
  const weekOccurrencesWithStatus = useMemo(
    () => weekOccurrencesRaw.map((dayOccurrences) => withStatus(dayOccurrences, now)),
    [weekOccurrencesRaw, now]
  );

  const handleAddToCalendar = () => {
    const events = todaysOccurrences.map((occ) => ({
      title: `${occ.daypart.name} — Redemption Radio`,
      description: occ.daypart.description || occ.daypart.name,
      start: occ.start,
      end: occ.end,
    }));
    downloadIcsCalendar(events, `redemption-radio-schedule-${selected.year}-${selected.month}-${selected.day}.ics`);
  };

  return (
    <>
      <Seo
        title="Schedule"
        description="See what's playing on Redemption Radio today and throughout the week."
        path="/schedule"
      />

      <section className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div>
            <p className="eyebrow mb-2">Our Broadcast</p>
            <h1 className="text-3xl font-bold text-ink sm:text-4xl">Programme Schedule</h1>
            <p className="mt-3 max-w-xl text-ink-soft">
              From morning devotion to overnight worship, we're here 24/7 with uplifting music,
              the Word, prayer and real hope.
            </p>
          </div>

          <OnAirNowCard current={current} next={next} />
        </div>

        {isLoading ? (
          <div className="mt-10">
            <LoadingState label="Loading the broadcast schedule…" />
          </div>
        ) : isError ? (
          <div className="mt-10">
            <ErrorState message="We couldn't load the schedule right now." onRetry={() => refetch()} />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
            <div className="space-y-6">
              <div className="card p-5">
                <ScheduleCalendar
                  selected={selected}
                  viewYear={viewYear}
                  viewMonth={viewMonth}
                  onSelect={handleSelectDate}
                  onChangeMonth={handleChangeMonth}
                />
              </div>

              <div className="card p-5">
                <CategoryFilterList value={category} onChange={setCategory} />
              </div>

              <div className="card bg-surface-muted p-4 text-xs text-ink-soft">
                All times shown in station time ({timeZone}).
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-ink/15 p-1">
                  {(["today", "week", "grid"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      aria-pressed={tab === t}
                      className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${
                        tab === t ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-surface-muted"
                      }`}
                    >
                      {t === "today" ? "Today" : t === "week" ? "This Week" : "Weekly View"}
                    </button>
                  ))}
                </div>

                <button type="button" onClick={handleAddToCalendar} className="btn-secondary text-sm">
                  <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Add to Calendar
                </button>
              </div>

              {tab === "today" && (
                <DayScheduleTable
                  occurrences={todaysOccurrences}
                  nextId={isViewingToday ? (next?.daypart.id ?? null) : null}
                />
              )}

              {tab === "week" && (
                <WeekListView
                  week={week}
                  occurrencesByDay={weekOccurrencesWithStatus}
                  nextId={next?.daypart.id ?? null}
                  todayIndex={todayIndexInWeek}
                />
              )}

              {tab === "grid" && (
                <WeeklyGridView
                  dayparts={list.filter((d) => matchesCategory(d.category))}
                  occurrencesByDay={weekOccurrencesRaw}
                />
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
