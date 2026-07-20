import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { sermons } from "@/data/sermons";
import { presenters } from "@/data/presenters";
import { MessageCard } from "@/components/messages/MessageCard";
import { EmptyState } from "@/components/ui/StateViews";
import type { MessageCategory } from "@/types/content";

const CATEGORIES: { id: MessageCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "sermon", label: "Sermons" },
  { id: "teaching", label: "Teaching" },
  { id: "testimony", label: "Testimony" },
  { id: "worship-devotional", label: "Worship Devotional" },
];

const PAGE_SIZE = 6;

export default function Messages() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MessageCategory | "all">("all");
  const [speaker, setSpeaker] = useState<string | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return sermons.filter((sermon) => {
      const matchesQuery =
        query.trim().length === 0 ||
        sermon.title.toLowerCase().includes(query.toLowerCase()) ||
        sermon.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || sermon.category === category;
      const matchesSpeaker = speaker === "all" || sermon.speakerId === speaker;
      return matchesQuery && matchesCategory && matchesSpeaker;
    });
  }, [query, category, speaker]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      <Seo
        title="Messages"
        description="Browse sermons, teaching and testimonies from Redemption Radio."
        path="/messages"
      />

      <section className="container-page py-16">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">Messages</p>
          <h1 className="text-3xl font-bold text-ink">Sermons &amp; Messages</h1>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search messages…"
              className="input pl-9"
              aria-label="Search messages"
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as MessageCategory | "all");
              setVisibleCount(PAGE_SIZE);
            }}
            className="input w-auto"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          <select
            value={speaker}
            onChange={(e) => {
              setSpeaker(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="input w-auto"
            aria-label="Filter by speaker"
          >
            <option value="all">All Speakers</option>
            {presenters.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No messages found" message="Try adjusting your search or filters." />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((sermon) => (
                <MessageCard key={sermon.id} sermon={sermon} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="mt-10 text-center">
                <button type="button" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-secondary">
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
