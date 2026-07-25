import { Router } from "express";
import { fetchScheduledPlaylists } from "../services/playlists.js";
import { logger } from "../lib/logger.js";

export const scheduleRouter = Router();

/**
 * Public, read-only endpoint returning the station's scheduled programme
 * blocks (playlists with schedule_items). Requires AZURACAST_API_KEY
 * server-side to fetch from AzuraCast, but that key is never forwarded to
 * the client — only the safe projection from services/playlists.ts is.
 * No admin/management action is reachable through this route.
 */
scheduleRouter.get("/", async (_req, res) => {
  try {
    const playlists = await fetchScheduledPlaylists();
    res.json({ playlists });
  } catch (error) {
    logger.error("Failed to serve station schedule", error);
    res.status(502).json({ message: "Unable to load the station schedule right now." });
  }
});
