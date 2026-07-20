import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { programmes } from "@/data/programmes";
import { formatSlotTimeRange, WEEKDAY_LABELS } from "@/lib/schedule";
import { CoverArt } from "@/components/ui/CoverArt";

export function FeaturedProgrammes() {
  const featured = programmes.slice(0, 4);

  return (
    <section className="container-page py-16" aria-labelledby="featured-programmes-heading">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="featured-programmes-heading" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="h-5 w-1 rounded-full bg-brand-600" aria-hidden="true" />
          Featured Programmes
        </h2>
        <NavLink to="/programmes" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          View All Programmes <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </NavLink>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((programme) => {
          const firstSlot = programme.schedule[0];
          return (
            <NavLink
              key={programme.id}
              to={`/programmes/${programme.slug}`}
              className="card group flex flex-col p-5 transition-shadow hover:shadow-card-hover"
            >
              <CoverArt
                src={programme.coverImageUrl}
                alt={programme.title}
                category={programme.category}
                className="mb-4 h-11 w-11 rounded-full"
              />
              <h3 className="font-bold text-ink group-hover:text-brand-700">{programme.title}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-soft">{programme.shortDescription}</p>
              {firstSlot && (
                <p className="mt-3 text-sm font-semibold text-brand-700">
                  {programme.schedule.length > 1
                    ? "Multiple times weekly"
                    : `${WEEKDAY_LABELS[firstSlot.day]}s ${formatSlotTimeRange(firstSlot)}`}
                </p>
              )}
            </NavLink>
          );
        })}
      </div>
    </section>
  );
}
