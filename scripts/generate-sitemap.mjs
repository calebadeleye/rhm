import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Mirrors the slugs in src/data/programmes.ts and src/data/sermons.ts.
// Keep this list in sync when adding/removing content entries.
const programmeSlugs = [
  "morning-devotion",
  "redemption-word",
  "worship-flow",
  "real-talk-live",
  "victory-in-prayer",
  "sermons-and-messages",
  "testimonies",
  "overnight-worship",
];

const messageSlugs = [
  "faith-that-moves-mountains",
  "grace-that-transforms",
  "walking-in-purpose",
  "a-testimony-of-healing",
  "real-talk-doubt-and-faith",
  "evening-worship-devotional",
];

const staticRoutes = [
  "/",
  "/about",
  "/programmes",
  "/schedule",
  "/listen-live",
  "/messages",
  "/testimonies",
  "/prayer-request",
  "/donate",
  "/contact",
  "/privacy",
  "/terms",
];

const siteUrl = process.env.VITE_SITE_URL || "https://redemptionradio.example.com";

const urls = [
  ...staticRoutes,
  ...programmeSlugs.map((slug) => `/programmes/${slug}`),
  ...messageSlugs.map((slug) => `/messages/${slug}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${new URL(path, siteUrl).toString()}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve("public/sitemap.xml"), xml, "utf-8");
console.log(`Generated public/sitemap.xml with ${urls.length} URLs`);
