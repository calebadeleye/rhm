import { Users } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { HeroLiveCard } from "@/components/player/HeroLiveCard";
import { usePlayer } from "@/context/PlayerContext";
import { CoverArt } from "@/components/ui/CoverArt";
import { EmptyState } from "@/components/ui/StateViews";
import { radioStationSchema } from "@/lib/structuredData";

export default function ListenLive() {
  const { nowPlaying } = usePlayer();

  return (
    <>
      <Seo
        title="Listen Live"
        description="Listen to Redemption Radio live — Christian worship music, teaching and prayer streaming 24/7."
        path="/listen-live"
        structuredData={radioStationSchema()}
      />

      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Listen Live</p>
          <h1 className="text-3xl font-bold text-ink">Redemption Radio</h1>
        </div>

        <div className="mx-auto max-w-lg">
          <HeroLiveCard />
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-ink">
            Recently Played
          </h2>
          {nowPlaying.history.length === 0 ? (
            <EmptyState title="No recent history" message="Song history will appear here once the station reports it." />
          ) : (
            <ul className="card divide-y divide-ink/5">
              {nowPlaying.history.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <CoverArt src={item.song.artUrl} alt={item.song.title} category="worship" className="h-12 w-12 rounded-lg" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{item.song.title}</p>
                    <p className="truncate text-sm text-ink-soft">{item.song.artist}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-sm text-ink-soft">
          <Users className="h-4 w-4" aria-hidden="true" />
          <span aria-live="polite">{nowPlaying.listenerCount} people listening now</span>
        </div>
      </section>
    </>
  );
}
