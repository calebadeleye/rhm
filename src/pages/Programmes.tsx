import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { programmes } from "@/data/programmes";
import { getPresenterById } from "@/data/presenters";
import { CoverArt } from "@/components/ui/CoverArt";
import { formatSlotTimeRange, WEEKDAY_LABELS } from "@/lib/schedule";
import type { ProgrammeCategory } from "@/types/content";

const CATEGORIES: { id: ProgrammeCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "teaching", label: "Teaching" },
  { id: "worship", label: "Worship" },
  { id: "talk", label: "Talk" },
  { id: "prayer", label: "Prayer" },
  { id: "testimony", label: "Testimony" },
  { id: "overnight", label: "Overnight" },
];

export default function Programmes() {
  const [filter, setFilter] = useState<ProgrammeCategory | "all">("all");
  const filtered = filter === "all" ? programmes : programmes.filter((p) => p.category === filter);

  return (
    <>
      <Seo
        title="Programmes"
        description="Explore Redemption Radio's full lineup of teaching, worship, talk and prayer programmes."
        path="/programmes"
      />

      <section className="container-page py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">Programmes</p>
          <h1 className="text-3xl font-bold text-ink">Our Broadcast Lineup</h1>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setFilter(category.id)}
              aria-pressed={filter === category.id}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                filter === category.id ? "bg-brand-600 text-white" : "border border-ink/15 text-ink-soft hover:bg-surface-muted"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((programme) => {
            const presenter = getPresenterById(programme.presenterId);
            const firstSlot = programme.schedule[0];
            return (
              <NavLink
                key={programme.id}
                to={`/programmes/${programme.slug}`}
                className="card group flex flex-col overflow-hidden"
              >
                <CoverArt src={programme.coverImageUrl} alt={programme.title} category={programme.category} className="aspect-[16/9] w-full" />
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-bold text-ink group-hover:text-brand-700">{programme.title}</h2>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{programme.shortDescription}</p>
                  <p className="mt-3 text-xs font-semibold text-ink-faint">{presenter?.name}</p>
                  {firstSlot && (
                    <p className="mt-1 text-sm font-semibold text-brand-700">
                      {programme.schedule.length > 1
                        ? "Multiple times weekly"
                        : `${WEEKDAY_LABELS[firstSlot.day]}s ${formatSlotTimeRange(firstSlot)}`}
                    </p>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      </section>
    </>
  );
}
