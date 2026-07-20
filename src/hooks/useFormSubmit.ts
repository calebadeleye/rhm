import { useCallback, useState } from "react";
import { env } from "@/lib/env";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

/** Generic POST-to-backend submit helper shared by the newsletter, contact,
 * prayer request and testimony forms. Keeps the "await backend, show
 * success/error" pattern in one place rather than duplicated per form. */
export function useFormSubmit<TPayload>(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(
    async (payload: TPayload) => {
      setStatus("submitting");
      setErrorMessage(null);
      try {
        const response = await fetch(`${env.apiBase}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message ?? "The form could not be submitted. Please try again.");
        }

        setStatus("success");
        return true;
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Something went wrong. Please try again."
        );
        return false;
      }
    },
    [endpoint]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  return { status, errorMessage, submit, reset };
}
