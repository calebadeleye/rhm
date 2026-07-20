import { useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { prayerCategories, type PrayerCategoryId } from "@/data/prayerCategories";
import { useFormSubmit } from "@/hooks/useFormSubmit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PrayerRequestPayload {
  name: string;
  email: string;
  phone: string;
  category: PrayerCategoryId;
  request: string;
  anonymous: boolean;
  consent: boolean;
  website: string;
}

const initialForm = {
  name: "",
  email: "",
  phone: "",
  category: "healing" as PrayerCategoryId,
  request: "",
  anonymous: false,
  consent: false,
};

export function PrayerRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, errorMessage, submit } = useFormSubmit<PrayerRequestPayload>("/prayer-requests");

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.anonymous && form.name.trim().length < 2) next.name = "Please enter your name, or choose anonymous.";
    if (!form.anonymous && !EMAIL_PATTERN.test(form.email)) next.email = "Enter a valid email address.";
    if (form.request.trim().length < 10) next.request = "Please share a little more detail (10+ characters).";
    if (!form.consent) next.consent = "Please confirm consent to submit your request.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    const ok = await submit({ ...form, website: "" });
    if (ok) setForm(initialForm);
  };

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-ink">Your request has been received</h3>
        <p className="max-w-sm text-sm text-ink-soft">
          Our prayer team will be praying for you. Submitted requests are kept private and are
          never published without your permission.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <input
          id="pr-anonymous"
          type="checkbox"
          checked={form.anonymous}
          onChange={(event) => setForm((f) => ({ ...f, anonymous: event.target.checked }))}
          className="h-4 w-4 rounded accent-brand-600"
        />
        <label htmlFor="pr-anonymous" className="text-sm text-ink-soft">
          Submit this request anonymously
        </label>
      </div>

      {!form.anonymous && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="pr-name" error={errors.name}>
            <input
              id="pr-name"
              value={form.name}
              onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
              className="input"
              autoComplete="name"
            />
          </Field>
          <Field label="Email" htmlFor="pr-email" error={errors.email}>
            <input
              id="pr-email"
              type="email"
              value={form.email}
              onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
              className="input"
              autoComplete="email"
            />
          </Field>
        </div>
      )}

      <Field label="Phone (optional)" htmlFor="pr-phone">
        <input
          id="pr-phone"
          type="tel"
          value={form.phone}
          onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
          className="input"
          autoComplete="tel"
        />
      </Field>

      <Field label="Prayer category" htmlFor="pr-category">
        <select
          id="pr-category"
          value={form.category}
          onChange={(event) => setForm((f) => ({ ...f, category: event.target.value as PrayerCategoryId }))}
          className="input"
        >
          {prayerCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your prayer request" htmlFor="pr-request" error={errors.request}>
        <textarea
          id="pr-request"
          rows={5}
          value={form.request}
          onChange={(event) => setForm((f) => ({ ...f, request: event.target.value }))}
          className="input resize-none"
        />
      </Field>

      {/* Honeypot field for spam protection — hidden from sighted users and
          screen readers, real users never fill it in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <div className="flex items-start gap-2">
          <input
            id="pr-consent"
            type="checkbox"
            checked={form.consent}
            onChange={(event) => setForm((f) => ({ ...f, consent: event.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded accent-brand-600"
            aria-describedby={errors.consent ? "pr-consent-error" : undefined}
          />
          <label htmlFor="pr-consent" className="text-sm text-ink-soft">
            I consent to Redemption Hour Ministries storing this request in order to pray for me.
            Requests are kept private and are never published without explicit permission. See our{" "}
            <a href="/privacy" className="text-brand-700 underline">Privacy Policy</a>.
          </label>
        </div>
        {errors.consent && (
          <p id="pr-consent-error" role="alert" className="mt-1 text-xs font-medium text-red-600">
            {errors.consent}
          </p>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? "Submitting…" : "Submit Prayer Request"}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
