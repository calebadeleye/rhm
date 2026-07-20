import { Heart, Repeat, Gift } from "lucide-react";
import { env } from "@/lib/env";

export function DonationSection() {
  return (
    <section className="bg-brand-900 py-16 text-white" aria-labelledby="donation-heading">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-300">Support the Mission</p>
          <h2 id="donation-heading" className="text-3xl font-bold">
            Help us share hope, one broadcast at a time
          </h2>
          <p className="mt-4 max-w-lg text-brand-50/90">
            Redemption Radio is listener-supported and commercial-free. Your generosity keeps the
            stream running and helps us reach more people with the Gospel worldwide.
          </p>
          <a
            href={env.donationUrl || "/donate"}
            target={env.donationUrl ? "_blank" : undefined}
            rel={env.donationUrl ? "noreferrer" : undefined}
            className="btn-primary mt-6 !bg-white !text-brand-800 hover:!bg-brand-50"
          >
            <Heart className="h-4 w-4" aria-hidden="true" /> Donate Today
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-6">
            <Gift className="mb-3 h-6 w-6 text-brand-200" aria-hidden="true" />
            <h3 className="font-bold">One-Time Gift</h3>
            <p className="mt-1 text-sm text-brand-50/80">
              Make a single gift of any amount to support a specific need or season.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-6">
            <Repeat className="mb-3 h-6 w-6 text-brand-200" aria-hidden="true" />
            <h3 className="font-bold">Recurring Support</h3>
            <p className="mt-1 text-sm text-brand-50/80">
              Join our monthly partners and provide steady, ongoing support for the ministry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
