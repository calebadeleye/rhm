import { CATEGORY_FILTERS } from "@/data/daypartCategories";
import type { DaypartCategory } from "@/types/schedule";

interface CategoryFilterListProps {
  value: DaypartCategory | "all";
  onChange: (value: DaypartCategory | "all") => void;
}

export function CategoryFilterList({ value, onChange }: CategoryFilterListProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-ink">Filter Programmes</legend>
      <div className="space-y-2.5" role="radiogroup">
        {CATEGORY_FILTERS.map((filter) => {
          const active = value === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(filter.id)}
              className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left text-sm hover:bg-surface-muted"
            >
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${filter.dot} ${active ? "" : "opacity-40"}`}
                aria-hidden="true"
              />
              <span className={active ? "font-semibold text-ink" : "text-ink-soft"}>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
