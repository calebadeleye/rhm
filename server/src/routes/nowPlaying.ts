import { Router } from "express";
import { env } from "../env.js";
import { logger } from "../lib/logger.js";

export const nowPlayingRouter = Router();

interface CacheEntry {
  body: unknown;
  expiresAt: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 8_000;
const UPSTREAM_TIMEOUT_MS = 6_000;

/**
 * Proxies AzuraCast's public Now Playing endpoint. This endpoint does not
 * require an API key by design (it's public station data), but we still
 * route it through our own backend rather than calling AzuraCast directly
 * from the browser so we can: enforce a request timeout, apply a short
 * server-side cache to absorb bursts of client polling, and keep a single
 * choke point for future auth if the AzuraCast instance is locked down.
 */
nowPlayingRouter.get("/", async (_req, res) => {
  if (cache && cache.expiresAt > Date.now()) {
    res.json(cache.body);
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const url = `${env.azuracastBaseUrl.replace(/\/$/, "")}/api/nowplaying/${env.azuracastStationShortcode}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Upstream responded with status ${response.status}`);
    }

    const body = await response.json();
    cache = { body, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(body);
  } catch (error) {
    logger.error("Failed to fetch AzuraCast now-playing data", error, { shortcode: env.azuracastStationShortcode });

    // Serve stale cache if we have it, rather than failing outright.
    if (cache) {
      res.json(cache.body);
      return;
    }

    res.status(502).json({ message: "Unable to reach the radio station right now." });
  } finally {
    clearTimeout(timeout);
  }
});
