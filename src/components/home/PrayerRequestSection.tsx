import { PrayerRequestForm } from "@/components/forms/PrayerRequestForm";

export function PrayerRequestSection() {
  return (
    <section id="prayer-request" className="container-page py-16" aria-labelledby="prayer-request-heading">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <p className="eyebrow mb-2">We're Here for You</p>
          <h2 id="prayer-request-heading" className="text-2xl font-bold text-ink">
            Submit a Prayer Request
          </h2>
          <p className="mt-2 text-ink-soft">
            Our prayer team is standing with you. Every request is kept private.
          </p>
        </div>
        <PrayerRequestForm />
      </div>
    </section>
  );
}
