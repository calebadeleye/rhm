import { env } from '../config/env';

export class ApiFetchError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ApiFetchError';
  }
}

/** Fetches JSON from the Redemption Radio backend with a hard timeout,
 * mirroring the web app's per-service fetch pattern (schedule/nowPlaying
 * services each build their own AbortController the same way). */
export async function fetchJson<T>(
  path: string,
  options: { signal?: AbortSignal; timeoutMs?: number; init?: RequestInit } = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 8000);
  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  try {
    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      ...options.init,
      signal: controller.signal,
      headers: { Accept: 'application/json', ...options.init?.headers },
    });

    if (!response.ok) {
      throw new ApiFetchError(`Request to ${path} failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiFetchError) throw error;
    throw new ApiFetchError(`Unable to reach Redemption Radio's API (${path})`, error);
  } finally {
    clearTimeout(timeout);
  }
}
