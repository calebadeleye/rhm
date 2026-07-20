import { Seo } from "@/components/seo/Seo";
import { env } from "@/lib/env";

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy" description="How Redemption Radio collects, uses and protects your information." path="/privacy" />

      <section className="container-page max-w-3xl py-16">
        <h1 className="text-3xl font-bold text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated July 2026</p>

        <div className="prose-content mt-8 space-y-6 text-ink-soft">
          <p>
            Redemption Hour Ministries ("we", "us") operates Redemption Radio. This policy
            explains what information we collect through this website and how it is used.
          </p>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Information We Collect</h2>
            <p>
              We collect information you provide directly, including your name, email address,
              phone number, and the content of any prayer requests, testimonies, newsletter
              subscriptions, or contact form messages you submit.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Prayer Requests &amp; Testimonies</h2>
            <p>
              Prayer requests are kept strictly private and are shared only with our prayer team.
              Testimony submissions are reviewed by our moderation team before any decision is
              made about publishing them, and are never published automatically or without
              consent.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">How We Use Information</h2>
            <p>
              We use the information you provide to respond to your messages, pray for your
              requests, send newsletter updates you've opted into, and improve our programming.
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-ink">Contact</h2>
            <p>
              Questions about this policy can be directed to{" "}
              <a href={`mailto:${env.contactEmail}`} className="text-brand-700 underline">{env.contactEmail}</a>.
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
