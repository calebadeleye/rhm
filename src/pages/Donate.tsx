import { Gift, Heart, Repeat } from "lucide-react";
import { Seo } from "@/components/seo/Seo";
import { env } from "@/lib/env";

export default function Donate() {
  return (
    <>
      <Seo
        title="Donate"
        description="Support Redemption Radio's ministry with a one-time or recurring gift."
        path="/donate"
      />

      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-2">Support the Mission</p>
          <h1 className="text-3xl font-bold text-ink">Give to Redemption Radio</h1>
          <p className="mt-4 text-ink-soft">
            Redemption Radio is listener-supported and commercial-free. Every gift helps us keep
            the stream running and reach more people with the Gospel — through worship, teaching
            and prayer, day and night.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
          <div className="card p-6 text-center">
            <Gift className="mx-auto mb-3 h-7 w-7 text-brand-600" aria-hidden="true" />
            <h2 className="font-bold text-ink">One-Time Gift</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Make a single gift of any amount to support a specific need or season of ministry.
            </p>
          </div>
          <div className="card p-6 text-center">
            <Repeat className="mx-auto mb-3 h-7 w-7 text-brand-600" aria-hidden="true" />
            <h2 className="font-bold text-ink">Recurring Support</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Join our monthly partners and provide steady, ongoing support to keep Redemption
              Radio on air.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          {env.donationUrl ? (
            <a href={env.donationUrl} target="_blank" rel="noreferrer" className="btn-primary !px-8 !py-3 text-base">
              <Heart className="h-5 w-5" aria-hidden="true" /> Donate Now
            </a>
          ) : (
            <p className="text-sm text-ink-faint">
              Online giving is coming soon. Please contact us to make a gift.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
