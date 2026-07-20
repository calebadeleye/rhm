import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",

  azuracastBaseUrl: required("AZURACAST_BASE_URL"),
  azuracastStationShortcode: required("AZURACAST_STATION_SHORTCODE"),
  // Never sent to the browser. Only used server-side for endpoints that
  // require authentication; the public nowplaying endpoint does not need it.
  azuracastApiKey: process.env.AZURACAST_API_KEY ?? "",

  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL ?? "",
} as const;
