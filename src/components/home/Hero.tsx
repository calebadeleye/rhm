import { NavLink } from "react-router-dom";
import { Calendar, Play } from "lucide-react";
import { HeroLiveCard } from "@/components/player/HeroLiveCard";
import { usePlayer } from "@/context/PlayerContext";

export function Hero() {
  const { play, isStationOffline } = usePlayer();

  return (
    <section className="relative overflow-hidden bg-surface-warm">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/85 via-brand-800/60 to-transparent" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(44,132,56,0.25), transparent 55%), radial-gradient(circle at 80% 80%, rgba(44,132,56,0.18), transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="eyebrow mb-3">Redemption Radio</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Streaming Faith,
            <br />
            Hope &amp; Worship <span className="text-brand-600">24/7</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Uplifting Christian music, powerful teaching, prayer and real hope for everyday life.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={play} disabled={isStationOffline} className="btn-primary !px-6 !py-3 text-base">
              <Play className="h-4.5 w-4.5" aria-hidden="true" fill="currentColor" /> Listen Live
            </button>
            <NavLink to="/schedule" className="btn-secondary !px-6 !py-3 text-base">
              <Calendar className="h-4.5 w-4.5" aria-hidden="true" /> View Schedule
            </NavLink>
          </div>

          <p className="mt-6 text-sm font-medium text-ink-soft">
            <span className="text-brand-700">●</span> Now Live &nbsp;·&nbsp; Listener Supported &nbsp;·&nbsp; Commercial Free
          </p>
        </div>

        <HeroLiveCard />
      </div>
    </section>
  );
}
