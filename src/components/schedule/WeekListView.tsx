import { DayScheduleTable } from "@/components/schedule/DayScheduleTable";
import { WEEKDAY_FULL_LABELS } from "@/lib/weekdayLabels";
import type { StationDateInfo } from "@/lib/timezone";
import type { DaypartOccurrence } from "@/types/schedule";

interface WeekListViewProps {
  week: StationDateInfo[];
  occurrencesByDay: DaypartOccurrence[][];
  nextId: number | null;
  todayIndex: number;
}

export function WeekListView({ week, occurrencesByDay, nextId, todayIndex }: WeekListViewProps) {
  return (
    <div className="space-y-8">
      {week.map((day, index) => (
        <div key={`${day.year}-${day.month}-${day.day}`}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
            {WEEKDAY_FULL_LABELS[day.weekdayIndex]}, {day.month}/{day.day}
            {index === todayIndex && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">Today</span>
            )}
          </h3>
          <DayScheduleTable
            occurrences={occurrencesByDay[index]}
            nextId={index === todayIndex ? nextId : null}
          />
        </div>
      ))}
    </div>
  );
}
