import { BookOpen, HandHeart, Sparkles } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { ministryInfo } from "@/data/ministry";

const PILLAR_ICONS = [BookOpen, HandHeart, Sparkles];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="Learn about Redemption Hour Ministries and the mission behind Redemption Radio."
        path="/about"
      />

      <section className="container-page py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3">About Us</p>
          <h1 className="text-4xl font-bold text-ink">{ministryInfo.name}</h1>
          <p className="mt-5 text-lg text-ink-soft">{ministryInfo.aboutLong}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
          {ministryInfo.pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index % PILLAR_ICONS.length];
            return (
              <div key={pillar.title} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                  <Icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
                </div>
                <h2 className="font-bold text-ink">{pillar.title}</h2>
                <p className="mt-2 text-sm text-ink-soft">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
