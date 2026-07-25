import { Router } from "express";
import { fetchEpisodes } from "../services/episodes.js";
import { logger } from "../lib/logger.js";

export const episodesRouter = Router();

/**
 * Public, read-only endpoint returning the station's on-demand episodes
 * ("Listen Again"). Requires AZURACAST_API_KEY server-side, but that key is
 * never forwarded to the client — only the safe projection from
 * services/episodes.ts is. Stations without on-demand enabled simply get
 * back an empty list, which is a valid state, not an error.
 */
episodesRouter.get("/", async (_req, res) => {
  try {
    const episodes = await fetchEpisodes();
    res.json({ episodes });
  } catch (error) {
    logger.error("Failed to serve on-demand episodes", error);
    res.status(502).json({ message: "Unable to load episodes right now." });
  }
});
