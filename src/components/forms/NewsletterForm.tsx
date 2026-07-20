import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { status, errorMessage, submit } = useFormSubmit<{ email: string; website: string }>(
    "/newsletter"
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setValidationError("Enter a valid email address.");
      return;
    }
    setValidationError(null);
    // "website" is a honeypot field — real users never fill it.
    const ok = await submit({ email, website: "" });
    if (ok) setEmail("");
  };

  if (status === "success") {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-brand-700">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> You&rsquo;re subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={compact ? "" : "max-w-md"}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          className="w-full min-w-0 rounded-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus-visible:border-brand-600"
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? "newsletter-error" : undefined}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary shrink-0 !px-4"
          aria-label="Subscribe"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        By subscribing you agree to receive occasional emails from Redemption Radio. Unsubscribe anytime.
      </p>
      {(validationError || errorMessage) && (
        <p id="newsletter-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
          {validationError ?? errorMessage}
        </p>
      )}
    </form>
  );
}
