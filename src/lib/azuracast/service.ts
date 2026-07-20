import { env } from "@/lib/env";
import { normaliseNowPlaying } from "@/lib/azuracast/normalise";
import type { NormalisedNowPlaying } from "@/types/azuracast";

export class NowPlayingFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "NowPlayingFetchError";
  }
}

/** Fetches Now Playing data through our backend proxy, which forwards to
 * AzuraCast's public /api/nowplaying/{shortcode} endpoint. Routing through
 * our own backend (rather than calling AzuraCast directly from the browser)
 * avoids CORS issues and keeps a single choke point for timeouts/caching. */
export async function fetchNowPlaying(signal?: AbortSignal): Promise<NormalisedNowPlaying> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  if (signal) {
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(`${env.apiBase}/nowplaying`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new NowPlayingFetchError(`Now playing request failed with status ${response.status}`);
    }

    const json = await response.json();
    return normaliseNowPlaying(json);
  } catch (error) {
    if (error instanceof NowPlayingFetchError) throw error;
    throw new NowPlayingFetchError("Unable to reach Redemption Radio's now-playing service", error);
  } finally {
    clearTimeout(timeout);
  }
}
