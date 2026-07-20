import { NavLink } from "react-router-dom";
import { Quote } from "lucide-react";
import { approvedTestimonies } from "@/data/testimonies";

export function TestimoniesSection() {
  return (
    <section className="bg-surface-muted py-16" aria-labelledby="testimonies-heading">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Testimonies</p>
            <h2 id="testimonies-heading" className="text-2xl font-bold text-ink">
              Stories of God's faithfulness
            </h2>
          </div>
          <NavLink to="/testimonies" className="btn-secondary">
            Share Your Testimony
          </NavLink>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {approvedTestimonies.slice(0, 3).map((testimony) => (
            <blockquote key={testimony.id} className="card p-6">
              <Quote className="mb-3 h-6 w-6 text-brand-300" aria-hidden="true" />
              <p className="text-sm text-ink-soft">{testimony.text}</p>
              <footer className="mt-4 text-sm font-semibold text-ink">
                {testimony.name}
                <span className="ml-2 font-normal text-ink-faint">
                  {new Date(testimony.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
