import { CATEGORY_META } from "@/data/daypartCategories";
import type { DaypartCategory } from "@/types/schedule";

export function CategoryBadge({ category }: { category: DaypartCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
      {meta.label}
    </span>
  );
}
