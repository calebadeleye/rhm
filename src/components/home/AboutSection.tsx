import { BookOpen, HandHeart, Sparkles } from "lucide-react";
import { ministryInfo } from "@/data/ministry";

const PILLAR_ICONS = [BookOpen, HandHeart, Sparkles];

export function AboutSection() {
  return (
    <section className="container-page py-16" aria-labelledby="about-heading">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-3">About Redemption Radio</p>
        <h2 id="about-heading" className="text-3xl font-bold text-ink">
          A ministry devoted to the Gospel
        </h2>
        <p className="mt-4 text-lg text-ink-soft">{ministryInfo.aboutShort}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
        {ministryInfo.pillars.map((pillar, index) => {
          const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
          return (
            <div key={pillar.title} className="card p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                <Icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-ink">{pillar.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{pillar.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
