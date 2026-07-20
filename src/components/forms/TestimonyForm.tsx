import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useFormSubmit } from "@/hooks/useFormSubmit";

interface TestimonyPayload {
  name: string;
  anonymous: boolean;
  text: string;
  website: string;
}

const initialForm = { name: "", anonymous: false, text: "" };

export function TestimonyForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const { status, errorMessage, submit } = useFormSubmit<TestimonyPayload>("/testimonies");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (form.text.trim().length < 20) {
      setError("Please share at least a few sentences (20+ characters).");
      return;
    }
    setError(null);
    const ok = await submit({ ...form, website: "" });
    if (ok) setForm(initialForm);
  };

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-brand-600" aria-hidden="true" />
        <h3 className="text-lg font-bold text-ink">Thank you for sharing</h3>
        <p className="max-w-sm text-sm text-ink-soft">
          Your testimony has been submitted for review. Our team moderates every submission
          before it's published, so it won't appear immediately.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <input
          id="ts-anonymous"
          type="checkbox"
          checked={form.anonymous}
          onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
          className="h-4 w-4 rounded accent-brand-600"
        />
        <label htmlFor="ts-anonymous" className="text-sm text-ink-soft">Submit anonymously</label>
      </div>

      {!form.anonymous && (
        <div>
          <label htmlFor="ts-name" className="mb-1.5 block text-sm font-semibold text-ink">Your name</label>
          <input id="ts-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" />
        </div>
      )}

      <div>
        <label htmlFor="ts-text" className="mb-1.5 block text-sm font-semibold text-ink">Your testimony</label>
        <textarea id="ts-text" rows={6} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} className="input resize-none" />
        {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      </div>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <p className="text-xs text-ink-faint">
        Submitted testimonies are reviewed by our team before publishing and are never posted
        automatically.
      </p>

      {errorMessage && <p role="alert" className="text-sm font-medium text-red-600">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? "Submitting…" : "Submit Testimony"}
      </button>
    </form>
  );
}
