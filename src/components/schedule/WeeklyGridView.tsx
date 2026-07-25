import { NavLink } from "react-router-dom";
import { CategoryBadge } from "@/components/schedule/CategoryBadge";
import { EmptyState } from "@/components/ui/StateViews";
import { formatMinutes12, type RawOccurrence } from "@/lib/liveSchedule";
import { WEEKDAY_SHORT_LABELS } from "@/lib/weekdayLabels";
import type { Daypart } from "@/types/schedule";

interface WeeklyGridViewProps {
  dayparts: Daypart[];
  occurrencesByDay: RawOccurrence[][];
}

/** Rows = each scheduled programme, columns = Sun–Sat. Cells show the time
 * range for the days that programme airs on. With every current daypart
 * airing every day, this reads as a simple reference table today, but the
 * layout is ready for day-specific schedules if the station adds them. */
export function WeeklyGridView({ dayparts, occurrencesByDay }: WeeklyGridViewProps) {
  if (dayparts.length === 0) {
    return <EmptyState title="Nothing scheduled" message="No programmes match this filter." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wide text-ink-faint">
            <th className="py-3 pr-4 font-bold">Programme</th>
            {WEEKDAY_SHORT_LABELS.map((label) => (
              <th key={label} className="px-2 py-3 text-center font-bold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dayparts.map((daypart) => (
            <tr key={daypart.id} className="border-b border-ink/5 last:border-0">
              <td className="py-4 pr-4 align-top">
                <NavLink to={`/schedule#${daypart.shortName}`} className="font-semibold text-ink hover:text-brand-700">
                  {daypart.name}
                </NavLink>
                <div className="mt-1">
                  <CategoryBadge category={daypart.category} />
                </div>
              </td>
              {occurrencesByDay.map((dayOccurrences, dayIndex) => {
                const matches = dayOccurrences.filter((o) => o.daypart.id === daypart.id);
                return (
                  <td key={dayIndex} className="px-2 py-4 text-center align-top text-xs text-ink-soft">
                    {matches.length === 0
                      ? <span className="text-ink-faint">—</span>
                      : matches.map((m, i) => (
                          <div key={i}>
                            {formatMinutes12(m.startMinutes)}–{formatMinutes12(m.endMinutes)}
                          </div>
                        ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
