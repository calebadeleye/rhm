import { useState } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import { Bell, BellRing, Play } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { getProgrammeBySlug } from "@/data/programmes";
import { getPresenterById } from "@/data/presenters";
import { sermons } from "@/data/sermons";
import { CoverArt } from "@/components/ui/CoverArt";
import { ShareButton } from "@/components/ui/ShareButton";
import { MessageCard } from "@/components/messages/MessageCard";
import { formatSlotTimeRange, getNextBroadcast, WEEKDAY_LABELS } from "@/lib/schedule";
import { downloadIcsReminder, scheduleBrowserReminder } from "@/lib/reminders";
import { usePlayer } from "@/context/PlayerContext";
import { env } from "@/lib/env";
import { broadcastEventSchema } from "@/lib/structuredData";

export default function ProgrammeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const programme = slug ? getProgrammeBySlug(slug) : undefined;
  const { play } = usePlayer();
  const [reminderSet, setReminderSet] = useState(false);

  if (!programme) return <Navigate to="/404" replace />;

  const presenter = getPresenterById(programme.presenterId);
  const nextBroadcast = getNextBroadcast(programme);
  const related = sermons.filter((s) => s.speakerId === programme.presenterId).slice(0, 3);
  const url = new URL(`/programmes/${programme.slug}`, env.siteUrl).toString();

  const handleReminder = async () => {
    if (!nextBroadcast) return;
    const end = new Date(nextBroadcast.getTime() + 60 * 60 * 1000);
    const notified = await scheduleBrowserReminder(
      `${programme.title} starts now`,
      `Redemption Radio — ${programme.title}`,
      nextBroadcast
    );
    if (!notified) {
      downloadIcsReminder({
        title: `${programme.title} — Redemption Radio`,
        description: programme.shortDescription,
        start: nextBroadcast,
        end,
      });
    }
    setReminderSet(true);
  };

  return (
    <>
      <Seo
        title={programme.title}
        description={programme.shortDescription}
        path={`/programmes/${programme.slug}`}
        structuredData={broadcastEventSchema(programme, presenter)}
      />

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <CoverArt
            src={programme.coverImageUrl}
            alt={programme.title}
            category={programme.category}
            className="aspect-square w-full rounded-2xl"
          />

          <div>
            <p className="eyebrow mb-2">{presenter?.name}</p>
            <h1 className="text-3xl font-bold text-ink sm:text-4xl">{programme.title}</h1>
            <p className="mt-4 text-lg text-ink-soft">{programme.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {programme.schedule.map((slot, index) => (
                <span key={index} className="rounded-full bg-surface-muted px-3 py-1.5 text-sm font-semibold text-ink-soft">
                  {WEEKDAY_LABELS[slot.day]} {formatSlotTimeRange(slot)}
                </span>
              ))}
            </div>

            {nextBroadcast && (
              <p className="mt-4 text-sm font-semibold text-brand-700">
                Next broadcast:{" "}
                {nextBroadcast.toLocaleString(undefined, {
                  weekday: "long",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={play} className="btn-primary">
                <Play className="h-4 w-4" aria-hidden="true" fill="currentColor" /> Listen Live
              </button>
              {nextBroadcast && (
                <button type="button" onClick={handleReminder} disabled={reminderSet} className="btn-secondary">
                  {reminderSet ? (
                    <>
                      <BellRing className="h-4 w-4" aria-hidden="true" /> Reminder set
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" aria-hidden="true" /> Remind me
                    </>
                  )}
                </button>
              )}
              <ShareButton title={programme.title} url={url} text={programme.shortDescription} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-ink">Related Episodes</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((sermon) => (
                <MessageCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <NavLink to="/programmes" className="text-sm font-semibold text-brand-700 hover:underline">
            ← Back to all programmes
          </NavLink>
        </div>
      </section>
    </>
  );
}
