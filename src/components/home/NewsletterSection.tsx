import { Mail } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="container-page py-16" aria-labelledby="newsletter-heading">
      <div className="card mx-auto flex max-w-3xl flex-col items-center gap-4 p-8 text-center sm:p-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
          <Mail className="h-6 w-6 text-brand-700" aria-hidden="true" />
        </div>
        <h2 id="newsletter-heading" className="text-2xl font-bold text-ink">
          Stay Connected
        </h2>
        <p className="max-w-md text-ink-soft">
          Subscribe for updates on new programmes, events, and messages from Redemption Radio.
        </p>
        <div className="w-full max-w-sm">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
