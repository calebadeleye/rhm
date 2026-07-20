import { NavLink } from "react-router-dom";
import { HandHeart, Heart, Radio } from "lucide-react";

const ITEMS = [
  {
    icon: HandHeart,
    title: "Need Prayer?",
    description: "Our prayer team is standing with you.",
    linkTo: "/prayer-request",
    linkLabel: "Submit Prayer Request",
  },
  {
    icon: Heart,
    title: "Support the Mission",
    description: "Your generosity helps us share hope worldwide.",
    linkTo: "/donate",
    linkLabel: "Give Today",
  },
  {
    icon: Radio,
    title: "Listen Anywhere",
    description: "Tune in on any device, anytime, anywhere.",
    linkTo: "/listen-live",
    linkLabel: "Listen Live",
  },
];

export function HereForYouRow() {
  return (
    <section className="container-page pb-4 pt-0">
      <div className="card overflow-hidden">
        <p className="pt-6 text-center text-xs font-bold uppercase tracking-wider text-brand-700">
          We're Here for You
        </p>
        <div className="grid gap-6 p-6 sm:grid-cols-3 sm:gap-4 sm:p-8">
          {ITEMS.map((item) => (
            <div key={item.title} className="text-center sm:border-l sm:border-ink/5 sm:first:border-l-0 sm:px-4">
              <item.icon className="mx-auto mb-3 h-7 w-7 text-brand-600" aria-hidden="true" />
              <h3 className="font-bold text-ink">{item.title}</h3>
              <p className="mt-1 text-sm text-ink-soft">{item.description}</p>
              <NavLink to={item.linkTo} className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline">
                {item.linkLabel} →
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
