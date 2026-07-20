function read(key: string, fallback = ""): string {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

export const env = {
  siteUrl: read("VITE_SITE_URL", "https://redemptionradio.example.com"),
  contactEmail: read("VITE_CONTACT_EMAIL", "info@redemptionradio.example.com"),
  contactPhone: read("VITE_CONTACT_PHONE", "(888) 123-4567"),
  donationUrl: read("VITE_DONATION_URL", ""),
  prayerRequestUrl: read("VITE_PRAYER_REQUEST_URL", ""),
  facebookUrl: read("VITE_FACEBOOK_URL", ""),
  instagramUrl: read("VITE_INSTAGRAM_URL", ""),
  youtubeUrl: read("VITE_YOUTUBE_URL", ""),
  xUrl: read("VITE_X_URL", ""),
  stationTimezone: read("VITE_STATION_TIMEZONE", "America/New_York"),
  apiBase: read("VITE_API_BASE", "/api"),
} as const;
