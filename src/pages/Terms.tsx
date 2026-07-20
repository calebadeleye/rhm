import { Seo } from "@/components/seo/Seo";
import { env } from "@/lib/env";

export default function Terms() {
  return (
    <>
      <Seo title="Terms of Use" description="Terms of use for the Redemption Radio website and streaming service." path="/terms" />

      <section className="container-page max-w-3xl py-16">
        <h1 className="text-3xl font-bold text-ink">Terms of Use</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated July 2026</p>

        <div className="mt-8 space-y-6 text-ink-soft">
          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Acceptance of Terms</h2>
            <p>
              By accessing or using the Redemption Radio website or stream, you agree to these
              terms of use. If you do not agree, please discontinue use of the site.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Use of Content</h2>
            <p>
              All programming, messages, artwork and branding on this site are provided for
              personal, non-commercial listening and viewing. Redistribution or rebroadcast
              without written permission from Redemption Hour Ministries is not permitted.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">User Submissions</h2>
            <p>
              Testimonies, prayer requests and contact messages submitted through this site remain
              subject to our editorial and moderation discretion. Testimonies are only published
              publicly after review and with the submitter's consent.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Availability</h2>
            <p>
              The live stream may occasionally be unavailable due to maintenance or technical
              issues outside our control. We make reasonable efforts to keep the stream online but
              do not guarantee uninterrupted service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Contact</h2>
            <p>
              Questions about these terms can be directed to{" "}
              <a href={`mailto:${env.contactEmail}`} className="text-brand-700 underline">{env.contactEmail}</a>.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
