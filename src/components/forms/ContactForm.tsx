import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
}

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { status, errorMessage, submit } = useFormSubmit<ContactPayload>("/contact");

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!EMAIL_PATTERN.test(form.email)) next.email = "Enter a valid email address.";
    if (form.subject.trim().length < 3) next.subject = "Please enter a subject.";
    if (form.message.trim().length < 10) next.message = "Please share a little more detail.";
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
        <h3 className="text-lg font-bold text-ink">Message sent</h3>
        <p className="max-w-sm text-sm text-ink-soft">
          Thanks for reaching out — our team typically responds within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold text-ink">Name</label>
          <input id="c-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" autoComplete="name" />
          {errors.name && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
          <input id="c-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" autoComplete="email" />
          {errors.email && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold text-ink">Phone (optional)</label>
        <input id="c-phone" type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" autoComplete="tel" />
      </div>

      <div>
        <label htmlFor="c-subject" className="mb-1.5 block text-sm font-semibold text-ink">Subject</label>
        <input id="c-subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="input" />
        {errors.subject && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.subject}</p>}
      </div>

      <div>
        <label htmlFor="c-message" className="mb-1.5 block text-sm font-semibold text-ink">Message</label>
        <textarea id="c-message" rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="input resize-none" />
        {errors.message && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.message}</p>}
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {errorMessage && <p role="alert" className="text-sm font-medium text-red-600">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
