import { NavLink } from "react-router-dom";
import { Play } from "lucide-react";
import type { SermonMessage } from "@/types/content";
import { getPresenterById } from "@/data/presenters";
import { CoverArt } from "@/components/ui/CoverArt";
import { ShareButton } from "@/components/ui/ShareButton";
import { env } from "@/lib/env";

const CATEGORY_LABEL: Record<SermonMessage["category"], string> = {
  sermon: "Sermon",
  teaching: "Teaching",
  testimony: "Testimony",
  "worship-devotional": "Worship Devotional",
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function MessageCard({ sermon }: { sermon: SermonMessage }) {
  const speaker = getPresenterById(sermon.speakerId);

  return (
    <div className="card flex flex-col overflow-hidden">
      <NavLink to={`/messages/${sermon.slug}`} className="group relative block aspect-video">
        <CoverArt src={sermon.thumbnailUrl} alt={sermon.title} category={sermon.category} className="h-full w-full" />
        <span className="absolute bottom-2 right-2 rounded bg-ink/70 px-1.5 py-0.5 text-xs font-semibold text-white">
          {formatDuration(sermon.durationSeconds)}
        </span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-brand-700">
            <Play className="h-5 w-5 translate-x-0.5" aria-hidden="true" fill="currentColor" />
          </span>
        </span>
      </NavLink>

      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow mb-1">{CATEGORY_LABEL[sermon.category]}</span>
        <NavLink to={`/messages/${sermon.slug}`} className="font-bold text-ink hover:text-brand-700">
          {sermon.title}
        </NavLink>
        <p className="mt-1 text-sm text-ink-soft">{speaker?.name ?? "Redemption Radio"}</p>
        <p className="mt-1 text-xs text-ink-faint">
          {new Date(sermon.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <NavLink to={`/messages/${sermon.slug}`} className="btn-ghost !px-0 text-sm">
            <Play className="h-4 w-4" aria-hidden="true" /> Play
          </NavLink>
          <ShareButton title={sermon.title} url={new URL(`/messages/${sermon.slug}`, env.siteUrl).toString()} />
        </div>
      </div>
    </div>
  );
}
