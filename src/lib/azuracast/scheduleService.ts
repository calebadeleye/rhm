import { env } from "@/lib/env";
import { normaliseSchedule } from "@/lib/azuracast/normaliseSchedule";
import type { Daypart } from "@/types/schedule";

export class ScheduleFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ScheduleFetchError";
  }
}

export async function fetchStationSchedule(signal?: AbortSignal): Promise<Daypart[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${env.apiBase}/schedule`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new ScheduleFetchError(`Schedule request failed with status ${response.status}`);
    }

    const json = await response.json();
    return normaliseSchedule(json);
  } catch (error) {
    if (error instanceof ScheduleFetchError) throw error;
    throw new ScheduleFetchError("Unable to load the station schedule", error);
  } finally {
    clearTimeout(timeout);
  }
}
