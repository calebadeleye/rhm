import { Quote } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { approvedTestimonies } from "@/data/testimonies";
import { TestimonyForm } from "@/components/forms/TestimonyForm";

export default function Testimonies() {
  return (
    <>
      <Seo
        title="Testimonies"
        description="Read stories of God's faithfulness from Redemption Radio listeners, and share your own."
        path="/testimonies"
      />

      <section className="container-page py-16">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Testimonies</p>
          <h1 className="text-3xl font-bold text-ink">Stories of God's Faithfulness</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            Every week we hear from listeners whose lives have been touched. Here are a few of
            their stories.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {approvedTestimonies.map((testimony) => (
            <blockquote key={testimony.id} className="card p-6">
              <Quote className="mb-3 h-6 w-6 text-brand-300" aria-hidden="true" />
              <p className="text-sm text-ink-soft">{testimony.text}</p>
              {testimony.audioUrl && (
                // eslint-disable-next-line jsx-a11y/media-has-caption -- audio-only testimony, no synchronized caption track available
                <audio controls src={testimony.audioUrl} className="mt-4 w-full">
                  Your browser does not support the audio element.
                </audio>
              )}
              <footer className="mt-4 text-sm font-semibold text-ink">
                {testimony.name}
                <span className="ml-2 font-normal text-ink-faint">
                  {new Date(testimony.date).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-ink">Share Your Testimony</h2>
          <p className="mb-6 text-center text-sm text-ink-soft">
            We'd love to hear what God has done in your life.
          </p>
          <TestimonyForm />
        </div>
      </section>
    </>
  );
}
