import { Navigate, NavLink, useParams } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";
import { getSermonBySlug, sermons } from "@/data/sermons";
import { getPresenterById } from "@/data/presenters";
import { CoverArt } from "@/components/ui/CoverArt";
import { ShareButton } from "@/components/ui/ShareButton";
import { MessageCard } from "@/components/messages/MessageCard";
import { Avatar } from "@/components/ui/Avatar";
import { env } from "@/lib/env";
import { audioObjectSchema } from "@/lib/structuredData";
import { EmptyState } from "@/components/ui/StateViews";

export default function MessageDetail() {
  const { slug } = useParams<{ slug: string }>();
  const sermon = slug ? getSermonBySlug(slug) : undefined;

  if (!sermon) return <Navigate to="/404" replace />;

  const speaker = getPresenterById(sermon.speakerId);
  const url = new URL(`/messages/${sermon.slug}`, env.siteUrl).toString();
  const related = sermons.filter((s) => s.id !== sermon.id && s.category === sermon.category).slice(0, 3);

  return (
    <>
      <Seo
        title={sermon.title}
        description={sermon.description}
        path={`/messages/${sermon.slug}`}
        type="article"
        structuredData={audioObjectSchema(sermon, speaker)}
      />

      <article className="container-page py-16">
        <div className="mx-auto max-w-2xl">
          <CoverArt src={sermon.thumbnailUrl} alt={sermon.title} category={sermon.category} className="aspect-video w-full rounded-2xl" />

          <h1 className="mt-6 text-3xl font-bold text-ink">{sermon.title}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Avatar name={speaker?.name ?? "Redemption Radio"} photoUrl={speaker?.photoUrl} className="h-9 w-9" />
            <div className="text-sm">
              <p className="font-semibold text-ink">{speaker?.name}</p>
              <p className="text-ink-faint">
                {new Date(sermon.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          <p className="mt-6 text-lg text-ink-soft">{sermon.description}</p>

          {sermon.audioUrl ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption -- audio-only message, no synchronized caption track available
            <audio controls className="mt-6 w-full" src={sermon.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          ) : (
            <div className="mt-6">
              <EmptyState title="Audio not yet available" message="This message's audio will be published here soon." />
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <ShareButton title={sermon.title} url={url} text={sermon.description} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="mb-6 text-xl font-bold text-ink">More Like This</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => (
                <MessageCard key={s.id} sermon={s} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <NavLink to="/messages" className="text-sm font-semibold text-brand-700 hover:underline">
            ← Back to all messages
          </NavLink>
        </div>
      </article>
    </>
  );
}
