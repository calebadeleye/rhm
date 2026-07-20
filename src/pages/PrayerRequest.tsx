import { Seo } from "@/components/seo/Seo";
import { PrayerRequestForm } from "@/components/forms/PrayerRequestForm";

export default function PrayerRequest() {
  return (
    <>
      <Seo
        title="Prayer Request"
        description="Submit a private prayer request to the Redemption Radio prayer team."
        path="/prayer-request"
      />

      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-2">We're Here for You</p>
            <h1 className="text-3xl font-bold text-ink">Submit a Prayer Request</h1>
            <p className="mt-3 text-ink-soft">
              Our prayer team is standing with you. Every request is kept private and prayed over
              — never published without your permission.
            </p>
          </div>
          <PrayerRequestForm />
        </div>
      </section>
    </>
  );
}
