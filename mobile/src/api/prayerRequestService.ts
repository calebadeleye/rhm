import { env } from '../config/env';
import type { PrayerCategoryId } from '../data/prayerCategories';

export interface PrayerRequestPayload {
  name: string;
  email: string;
  phone: string;
  category: PrayerCategoryId;
  request: string;
  anonymous: boolean;
  consent: boolean;
  website: string;
}

export class PrayerRequestSubmitError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'PrayerRequestSubmitError';
  }
}

export async function submitPrayerRequest(payload: PrayerRequestPayload): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${env.apiBaseUrl}/prayer-requests`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new PrayerRequestSubmitError(body?.message ?? 'Unable to submit your prayer request.');
    }
  } catch (error) {
    if (error instanceof PrayerRequestSubmitError) throw error;
    throw new PrayerRequestSubmitError('Unable to submit your prayer request. Please try again.', error);
  } finally {
    clearTimeout(timeout);
  }
}
