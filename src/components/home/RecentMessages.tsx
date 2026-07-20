import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { sermons } from "@/data/sermons";
import { MessageCard } from "@/components/messages/MessageCard";

export function RecentMessages() {
  const recent = sermons.slice(0, 3);

  return (
    <section className="container-page py-16" aria-labelledby="recent-messages-heading">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="recent-messages-heading" className="flex items-center gap-2 text-lg font-bold text-ink">
          <span className="h-5 w-1 rounded-full bg-brand-600" aria-hidden="true" />
          Latest Messages
        </h2>
        <NavLink to="/messages" className="flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          View All Messages <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </NavLink>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((sermon) => (
          <MessageCard key={sermon.id} sermon={sermon} />
        ))}
      </div>
    </section>
  );
}
