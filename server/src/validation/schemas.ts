import { z } from "zod";

const honeypot = z.object({
  website: z.string().max(0).or(z.literal("")).optional(),
});

export function isHoneypotTripped(body: { website?: string }): boolean {
  return Boolean(body.website && body.website.length > 0);
}

export const newsletterSchema = honeypot.extend({
  email: z.string().email(),
});

export const contactSchema = honeypot.extend({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const prayerCategoryEnum = z.enum([
  "healing",
  "family",
  "finances",
  "guidance",
  "salvation",
  "grief",
  "thanksgiving",
  "other",
]);

export const prayerRequestSchema = honeypot.extend({
  name: z.string().max(200).optional().default(""),
  email: z.string().email().optional().or(z.literal("")).default(""),
  phone: z.string().max(40).optional().default(""),
  category: prayerCategoryEnum,
  request: z.string().min(10).max(5000),
  anonymous: z.boolean().default(false),
  consent: z.literal(true),
});

export const testimonySchema = honeypot.extend({
  name: z.string().max(200).optional().default(""),
  anonymous: z.boolean().default(false),
  text: z.string().min(20).max(5000),
});
