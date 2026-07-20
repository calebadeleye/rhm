import { Router } from "express";
import { appendRecord } from "../lib/storage.js";
import { logger } from "../lib/logger.js";
import {
  contactSchema,
  isHoneypotTripped,
  newsletterSchema,
  prayerRequestSchema,
  testimonySchema,
} from "../validation/schemas.js";

export const formsRouter = Router();

formsRouter.post("/newsletter", async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please provide a valid email address." });
    return;
  }
  if (isHoneypotTripped(parsed.data)) {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    await appendRecord("newsletter.jsonl", { email: parsed.data.email });
    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error("Failed to store newsletter signup", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

formsRouter.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please check your form details and try again." });
    return;
  }
  if (isHoneypotTripped(parsed.data)) {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const { website: _website, ...record } = parsed.data;
    await appendRecord("contact.jsonl", record);
    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error("Failed to store contact message", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

formsRouter.post("/prayer-requests", async (req, res) => {
  const parsed = prayerRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please check your form details and try again." });
    return;
  }
  if (isHoneypotTripped(parsed.data)) {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const { website: _website, ...record } = parsed.data;
    // Prayer requests are private — never exposed via any public API route.
    await appendRecord("prayer-requests.jsonl", record);
    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error("Failed to store prayer request", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

formsRouter.post("/testimonies", async (req, res) => {
  const parsed = testimonySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please share a little more detail." });
    return;
  }
  if (isHoneypotTripped(parsed.data)) {
    res.status(200).json({ ok: true });
    return;
  }

  try {
    const { website: _website, ...record } = parsed.data;
    // Stored as "pending" — never published automatically. A moderator
    // reviews server/data/testimonies.jsonl and promotes approved entries
    // into src/data/testimonies.ts (or a future admin backend).
    await appendRecord("testimonies.jsonl", { ...record, status: "pending" });
    res.status(200).json({ ok: true });
  } catch (error) {
    logger.error("Failed to store testimony submission", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});
