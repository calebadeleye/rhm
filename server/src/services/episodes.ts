import { env } from "../env.js";
import { logger } from "../lib/logger.js";
import { resolveDaypartCategory, type DaypartCategory } from "./daypartCategories.js";

/** Minimal, public-safe projection of an AzuraCast on-demand media item. */
export interface SafeEpisode {
  id: string;
  title: string;
  description: string;
  category: DaypartCategory;
  artUrl: string | null;
  durationSeconds: number;
  publishedAt: string | null;
  downloadUrl: string;
}

/** Raw shape is intentionally loose — AzuraCast's on-demand API response
 * varies by version and station configuration, and undocumented fields may
 * be missing or null. Never trust it beyond "it might be an object". */
export interface RawOnDemandMedia {
  id?: string;
  title?: string;
  artist?: string;
  album?: string;
  description?: string;
  art?: string;
  length?: number;
  uploaded_at?: number;
}

export interface RawOnDemandItem {
  media?: RawOnDemandMedia;
  playlist?: string;
  is_downloadable?: boolean;
  download_url?: string;
}

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

export function normaliseOnDemandItem(raw: RawOnDemandItem, baseUrl: string): SafeEpisode | null {
  const media = raw.media;
  if (!media || !media.id || !raw.download_url) return null;

  const title = safeString(media.title, "Untitled episode");
  const artist = safeString(media.artist);
  const description = artist ? `${safeString(media.description)} — ${artist}`.replace(/^— /, "") : safeString(media.description);

  return {
    id: String(media.id),
    title,
    description,
    category: resolveDaypartCategory(safeString(raw.playlist)),
    artUrl: typeof media.art === "string" && media.art.length > 0 ? media.art : null,
    durationSeconds: typeof media.length === "number" && media.length >= 0 ? media.length : 0,
    publishedAt:
      typeof media.uploaded_at === "number" ? new Date(media.uploaded_at * 1000).toISOString() : null,
    downloadUrl: raw.download_url.startsWith("http")
      ? raw.download_url
      : `${baseUrl.replace(/\/$/, "")}${raw.download_url.startsWith("/") ? "" : "/"}${raw.download_url}`,
  };
}

interface CacheEntry {
  data: SafeEpisode[];
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60_000;
const UPSTREAM_TIMEOUT_MS = 8_000;

/** Fetches the station's on-demand media from AzuraCast, if the station has
 * on-demand downloads enabled for any playlist. Stations without on-demand
 * configured will simply have nothing to return — that's a valid, expected
 * state, not an error, so callers always get a (possibly empty) list rather
 * than a thrown error for "feature not configured". */
export async function fetchEpisodes(): Promise<SafeEpisode[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  if (!env.azuracastApiKey) {
    throw new Error("AZURACAST_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const baseUrl = env.azuracastBaseUrl.replace(/\/$/, "");
    const url = `${baseUrl}/api/station/${env.azuracastStationShortcode}/on-demand`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.azuracastApiKey}`,
      },
    });

    // Any 4xx here means on-demand isn't available at this path for this
    // station/AzuraCast version (seen in practice: 404 when the feature is
    // off, 405 when the route doesn't accept GET on some AzuraCast builds)
    // — treat it as "no episodes yet", not an upstream failure. Only 5xx
    // (a real AzuraCast-side problem) falls through to the error path below.
    if (response.status >= 400 && response.status < 500) {
      logger.error("AzuraCast on-demand endpoint returned a client error", {
        status: response.status,
        url,
      });
      cache = { data: [], expiresAt: Date.now() + CACHE_TTL_MS };
      return [];
    }

    if (!response.ok) {
      throw new Error(`Upstream responded with status ${response.status}`);
    }

    const raw = (await response.json()) as unknown;
    const list = Array.isArray(raw) ? raw : [];
    const episodes = list
      .map((item) => normaliseOnDemandItem(item as RawOnDemandItem, baseUrl))
      .filter((item): item is SafeEpisode => item !== null)
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

    cache = { data: episodes, expiresAt: Date.now() + CACHE_TTL_MS };
    return episodes;
  } catch (error) {
    logger.error("Failed to fetch AzuraCast on-demand episodes", error);
    if (cache) return cache.data;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
