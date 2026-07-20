import {
  FALLBACK_SONG,
  type NormalisedHistoryItem,
  type NormalisedMount,
  type NormalisedNowPlaying,
  type NormalisedSong,
  type RawAzuraCastMount,
  type RawAzuraCastNowPlaying,
  type RawAzuraCastSong,
  type RawAzuraCastSongHistoryItem,
} from "@/types/azuracast";

function safeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function safeUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return value;
  } catch {
    return null;
  }
}

export function normaliseSong(raw: RawAzuraCastSong | undefined | null): NormalisedSong {
  if (!raw) return FALLBACK_SONG;
  const title = safeString(raw.title) || safeString(raw.text) || FALLBACK_SONG.title;
  return {
    id: safeString(raw.id, `${title}-${safeString(raw.artist)}`),
    title,
    artist: safeString(raw.artist, "Redemption Radio"),
    album: safeString(raw.album),
    artUrl: safeUrl(raw.art),
  };
}

function normaliseHistoryItem(
  raw: RawAzuraCastSongHistoryItem,
  index: number
): NormalisedHistoryItem {
  return {
    id: raw.sh_id != null ? String(raw.sh_id) : `history-${index}`,
    song: normaliseSong(raw.song),
    playedAt: typeof raw.played_at === "number" ? raw.played_at : null,
    durationSeconds: safeNumber(raw.duration),
  };
}

function normaliseMount(raw: RawAzuraCastMount, index: number): NormalisedMount {
  return {
    id: raw.id != null ? String(raw.id) : `mount-${index}`,
    name: safeString(raw.name, `Mount ${index + 1}`),
    url: safeUrl(raw.url),
    bitrate: typeof raw.bitrate === "number" ? raw.bitrate : null,
    format: safeString(raw.format) || null,
    listeners: safeNumber(raw.listeners?.current ?? raw.listeners?.total),
  };
}

/** Picks the best playable stream URL: station.listen_url first, then the
 * first mount with a valid URL. Returns null if nothing usable is found. */
function resolveStreamUrl(
  station: RawAzuraCastNowPlaying["station"],
  mounts: NormalisedMount[]
): string | null {
  const direct = safeUrl(station?.listen_url) ?? safeUrl(station?.url);
  if (direct) return direct;
  const firstMount = mounts.find((mount) => mount.url !== null);
  return firstMount?.url ?? null;
}

/** Converts a raw AzuraCast /api/nowplaying/{shortcode} payload into a fully
 * null-safe shape. Handles missing fields, offline stations, and malformed
 * payloads without throwing. */
export function normaliseNowPlaying(raw: unknown): NormalisedNowPlaying {
  if (!raw || typeof raw !== "object") {
    return { ...FALLBACK_OFFLINE(), fetchedAt: Date.now() };
  }

  const data = raw as RawAzuraCastNowPlaying;
  const mounts = Array.isArray(data.mounts) ? data.mounts.map(normaliseMount) : [];
  const streamUrl = resolveStreamUrl(data.station, mounts);

  const isOnline = data.is_online !== false && streamUrl !== null;
  const isLive = Boolean(data.live?.is_live) && isOnline;
  const currentSong = normaliseSong(data.now_playing?.song);

  const history = Array.isArray(data.song_history)
    ? data.song_history.slice(0, 10).map(normaliseHistoryItem)
    : [];

  return {
    isOnline,
    isLive,
    stationName: safeString(data.station?.name, "Redemption Radio"),
    stationDescription: safeString(data.station?.description),
    streamerName: isLive ? safeString(data.live?.streamer_name) || null : null,
    streamUrl,
    listenerCount: safeNumber(data.listeners?.current ?? data.listeners?.total),
    song: currentSong,
    elapsedSeconds: safeNumber(data.now_playing?.elapsed),
    remainingSeconds: safeNumber(data.now_playing?.remaining),
    durationSeconds: safeNumber(data.now_playing?.duration),
    history,
    mounts,
    fetchedAt: Date.now(),
  };
}

function FALLBACK_OFFLINE(): NormalisedNowPlaying {
  return {
    isOnline: false,
    isLive: false,
    stationName: "Redemption Radio",
    stationDescription: "",
    streamerName: null,
    streamUrl: null,
    listenerCount: 0,
    song: FALLBACK_SONG,
    elapsedSeconds: 0,
    remainingSeconds: 0,
    durationSeconds: 0,
    history: [],
    mounts: [],
    fetchedAt: Date.now(),
  };
}
