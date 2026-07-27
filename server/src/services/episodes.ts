import { env } from "../env.js";
import { logger } from "../lib/logger.js";
import { resolveDaypartCategory, type DaypartCategory } from "./daypartCategories.js";

/** Minimal, public-safe projection of an AzuraCast on-demand media item or
 * podcast episode. */
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

/** AzuraCast `Api_Podcast` — see the station's own /api/docs/openapi.yml. */
export interface RawPodcast {
  id?: string;
  title?: string;
  art?: string;
  has_custom_art?: boolean;
  is_published?: boolean;
}

/** AzuraCast `Api_PodcastEpisode`. */
export interface RawPodcastEpisode {
  id?: string;
  title?: string;
  description?: string;
  description_short?: string;
  publish_at?: number;
  is_published?: boolean;
  has_media?: boolean;
  art?: string | null;
  media?: {
    length?: number;
  } | null;
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

export function normalisePodcastEpisode(
  raw: RawPodcastEpisode,
  podcast: RawPodcast,
  baseUrl: string,
  shortcode: string,
): SafeEpisode | null {
  if (!raw.id || raw.has_media === false || raw.is_published === false) return null;

  const podcastId = podcast.id;
  if (!podcastId) return null;

  const title = safeString(raw.title, "Untitled episode");
  const description = safeString(raw.description_short) || safeString(raw.description);
  const art = safeString(raw.art) || safeString(podcast.art) || null;

  return {
    id: `podcast-${raw.id}`,
    title,
    description,
    category: resolveDaypartCategory(safeString(podcast.title).toLowerCase().replace(/\s+/g, "_")),
    artUrl: art,
    durationSeconds: typeof raw.media?.length === "number" && raw.media.length >= 0 ? raw.media.length : 0,
    publishedAt: typeof raw.publish_at === "number" ? new Date(raw.publish_at * 1000).toISOString() : null,
    downloadUrl: `${baseUrl}/api/station/${shortcode}/podcast/${podcastId}/episode/${raw.id}/media`,
  };
}

interface CacheEntry {
  data: SafeEpisode[];
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 5 * 60_000;
const UPSTREAM_TIMEOUT_MS = 8_000;

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (env.azuracastApiKey) headers.Authorization = `Bearer ${env.azuracastApiKey}`;
  return headers;
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  const response = await fetch(url, { signal, headers: authHeaders() });
  if (response.status >= 400 && response.status < 500) {
    // 404/405 here means the feature isn't enabled/available for this
    // station — a valid "nothing here" state, not an upstream failure.
    return null;
  }
  if (!response.ok) {
    throw new Error(`Upstream responded with status ${response.status} for ${url}`);
  }
  return response.json();
}

/** Fetches all published podcast episodes across every podcast configured
 * for the station, using AzuraCast's public (unauthenticated) podcast API. */
async function fetchPodcastEpisodes(baseUrl: string, shortcode: string, signal: AbortSignal): Promise<SafeEpisode[]> {
  const podcastsUrl = `${baseUrl}/api/station/${shortcode}/public/podcasts`;
  const rawPodcasts = (await fetchJson(podcastsUrl, signal)) as RawPodcast[] | null;
  if (!Array.isArray(rawPodcasts) || rawPodcasts.length === 0) return [];

  const episodeLists = await Promise.all(
    rawPodcasts
      .filter((podcast) => podcast.id && podcast.is_published !== false)
      .map(async (podcast) => {
        const episodesUrl = `${baseUrl}/api/station/${shortcode}/public/podcast/${podcast.id}/episodes`;
        try {
          const rawEpisodes = (await fetchJson(episodesUrl, signal)) as RawPodcastEpisode[] | null;
          if (!Array.isArray(rawEpisodes)) return [];
          return rawEpisodes
            .map((episode) => normalisePodcastEpisode(episode, podcast, baseUrl, shortcode))
            .filter((item): item is SafeEpisode => item !== null);
        } catch (error) {
          logger.error("Failed to fetch episodes for AzuraCast podcast", { podcastId: podcast.id, error });
          return [];
        }
      }),
  );

  return episodeLists.flat();
}

async function fetchOnDemandEpisodes(baseUrl: string, shortcode: string, signal: AbortSignal): Promise<SafeEpisode[]> {
  const url = `${baseUrl}/api/station/${shortcode}/on-demand`;
  const raw = (await fetchJson(url, signal)) as RawOnDemandItem[] | null;
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => normaliseOnDemandItem(item, baseUrl))
    .filter((item): item is SafeEpisode => item !== null);
}

/** Fetches the station's on-demand listening content from AzuraCast: the
 * dedicated Podcasts module (primary) plus any per-playlist on-demand
 * downloads (secondary). A station with neither configured simply has
 * nothing to return — that's a valid, expected state, not an error, so
 * callers always get a (possibly empty) list rather than a thrown error
 * for "feature not configured". */
export async function fetchEpisodes(): Promise<SafeEpisode[]> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const baseUrl = env.azuracastBaseUrl.replace(/\/$/, "");
    const shortcode = env.azuracastStationShortcode;

    const [podcastResult, onDemandResult] = await Promise.allSettled([
      fetchPodcastEpisodes(baseUrl, shortcode, controller.signal),
      fetchOnDemandEpisodes(baseUrl, shortcode, controller.signal),
    ]);

    if (podcastResult.status === "rejected") {
      logger.error("Failed to fetch AzuraCast podcast episodes", podcastResult.reason);
    }
    if (onDemandResult.status === "rejected") {
      logger.error("Failed to fetch AzuraCast on-demand episodes", onDemandResult.reason);
    }

    if (podcastResult.status === "rejected" && onDemandResult.status === "rejected") {
      throw podcastResult.reason;
    }

    const episodes = [
      ...(podcastResult.status === "fulfilled" ? podcastResult.value : []),
      ...(onDemandResult.status === "fulfilled" ? onDemandResult.value : []),
    ].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));

    cache = { data: episodes, expiresAt: Date.now() + CACHE_TTL_MS };
    return episodes;
  } catch (error) {
    logger.error("Failed to fetch AzuraCast episodes", error);
    if (cache) return cache.data;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
