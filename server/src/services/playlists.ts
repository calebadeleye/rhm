import { env } from "../env.js";
import { logger } from "../lib/logger.js";

/** Minimal, public-safe projection of an AzuraCast playlist schedule item. */
export interface SafeScheduleItem {
  /** Minutes since midnight, station-local time. */
  startMinutes: number;
  /** Minutes since midnight, station-local time. May be less than
   * startMinutes when the slot wraps past midnight. */
  endMinutes: number;
  /** 0 (Sunday) – 6 (Saturday). Empty array means "every day". */
  days: number[];
}

/** Minimal, public-safe projection of an AzuraCast playlist. Deliberately
 * excludes admin fields (the `links` object exposes toggle/clone/reshuffle/
 * empty/import endpoints that must never reach public visitors) and
 * anything else not needed to render a public schedule. */
export interface SafePlaylist {
  id: number;
  name: string;
  shortName: string;
  description: string;
  scheduleItems: SafeScheduleItem[];
}

export interface RawScheduleItem {
  start_time?: number;
  end_time?: number;
  days?: number[];
}

export interface RawPlaylist {
  id?: number;
  name?: string;
  short_name?: string;
  description?: string;
  is_enabled?: boolean;
  schedule_items?: RawScheduleItem[];
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

/** Converts AzuraCast's HHMM integer time (e.g. 1830 = 18:30) into minutes
 * since midnight. Returns null if the value isn't a plausible HHMM number. */
export function hhmmToMinutes(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const hours = Math.floor(value / 100);
  const minutes = value % 100;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function normalisePlaylist(raw: RawPlaylist): SafePlaylist | null {
  if (raw.id == null || !raw.is_enabled) return null;

  const scheduleItems: SafeScheduleItem[] = Array.isArray(raw.schedule_items)
    ? raw.schedule_items
        .map((item): SafeScheduleItem | null => {
          const startMinutes = hhmmToMinutes(item.start_time);
          const endMinutes = hhmmToMinutes(item.end_time);
          if (startMinutes == null || endMinutes == null) return null;
          const days = Array.isArray(item.days)
            ? item.days.filter((d): d is number => typeof d === "number" && d >= 0 && d <= 6)
            : [];
          return { startMinutes, endMinutes, days };
        })
        .filter((item): item is SafeScheduleItem => item !== null)
    : [];

  // Only playlists with an actual time slot represent a public "programme
  // block". Always-on rotation/interstitial playlists (station IDs,
  // scripture drops, ad breaks) have no schedule_items and are excluded —
  // they're mixed into whichever daypart is active, not a daypart
  // themselves.
  if (scheduleItems.length === 0) return null;

  return {
    id: raw.id,
    name: safeString(raw.name, `Playlist ${raw.id}`),
    shortName: safeString(raw.short_name),
    description: safeString(raw.description),
    scheduleItems,
  };
}

interface CacheEntry {
  data: SafePlaylist[];
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60_000;
const UPSTREAM_TIMEOUT_MS = 8_000;

/** Fetches the station's playlists from AzuraCast's authenticated API and
 * returns only the scheduled ones, stripped down to public-safe fields.
 * This is the ONLY place server/src touches AZURACAST_API_KEY for playlist
 * data — the key never leaves this process. */
export async function fetchScheduledPlaylists(): Promise<SafePlaylist[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  if (!env.azuracastApiKey) {
    throw new Error("AZURACAST_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const url = `${env.azuracastBaseUrl.replace(/\/$/, "")}/api/station/${env.azuracastStationShortcode}/playlists`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.azuracastApiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream responded with status ${response.status}`);
    }

    const raw = (await response.json()) as unknown;
    const list = Array.isArray(raw) ? raw : [];
    const playlists = list
      .map((item) => normalisePlaylist(item as RawPlaylist))
      .filter((item): item is SafePlaylist => item !== null)
      .sort((a, b) => a.scheduleItems[0].startMinutes - b.scheduleItems[0].startMinutes);

    cache = { data: playlists, expiresAt: Date.now() + CACHE_TTL_MS };
    return playlists;
  } catch (error) {
    logger.error("Failed to fetch AzuraCast station playlists", error);
    if (cache) return cache.data;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
