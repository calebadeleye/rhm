import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number;
}

interface ScheduleCalendarProps {
  selected: CalendarDate;
  viewYear: number;
  viewMonth: number; // 1-12
  onSelect: (date: CalendarDate) => void;
  onChangeMonth: (delta: number) => void;
}

const WEEKDAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function firstWeekdayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function isSameDate(a: CalendarDate, b: CalendarDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function ScheduleCalendar({ selected, viewYear, viewMonth, onSelect, onChangeMonth }: ScheduleCalendarProps) {
  const totalDays = daysInMonth(viewYear, viewMonth);
  const leadingBlanks = firstWeekdayOfMonth(viewYear, viewMonth);
  const prevMonthDays = daysInMonth(viewMonth === 1 ? viewYear - 1 : viewYear, viewMonth === 1 ? 12 : viewMonth - 1);

  const cells: { date: CalendarDate; inCurrentMonth: boolean }[] = [];

  for (let i = leadingBlanks - 1; i >= 0; i -= 1) {
    const month = viewMonth === 1 ? 12 : viewMonth - 1;
    const year = viewMonth === 1 ? viewYear - 1 : viewYear;
    cells.push({ date: { year, month, day: prevMonthDays - i }, inCurrentMonth: false });
  }
  for (let day = 1; day <= totalDays; day += 1) {
    cells.push({ date: { year: viewYear, month: viewMonth, day }, inCurrentMonth: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const month = viewMonth === 12 ? 1 : viewMonth + 1;
    const year = viewMonth === 12 ? viewYear + 1 : viewYear;
    cells.push({ date: { year, month, day: nextDay }, inCurrentMonth: false });
    nextDay += 1;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onChangeMonth(-1)}
          aria-label="Previous month"
          className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-muted"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="text-sm font-bold text-ink">
          {MONTH_NAMES[viewMonth - 1]} {viewYear}
        </p>
        <button
          type="button"
          onClick={() => onChangeMonth(1)}
          aria-label="Next month"
          className="rounded-lg p-1.5 text-ink-soft hover:bg-surface-muted"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_HEADERS.map((label) => (
          <span key={label} className="text-[11px] font-bold text-ink-faint">
            {label}
          </span>
        ))}

        {cells.map(({ date, inCurrentMonth }) => {
          const active = isSameDate(date, selected);
          return (
            <button
              key={`${date.year}-${date.month}-${date.day}`}
              type="button"
              onClick={() => onSelect(date)}
              aria-current={active ? "date" : undefined}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
                active
                  ? "bg-brand-600 font-bold text-white"
                  : inCurrentMonth
                    ? "text-ink hover:bg-surface-muted"
                    : "text-ink-faint/50 hover:bg-surface-muted"
              }`}
            >
              {date.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
