/** Raw shapes are intentionally loose (Partial + unknown-friendly) because
 * AzuraCast responses may omit fields or return nulls depending on station
 * configuration. Never trust the raw shape beyond "it might be an object". */

export interface RawAzuraCastSong {
  id?: string;
  text?: string;
  artist?: string;
  title?: string;
  album?: string;
  art?: string;
}

export interface RawAzuraCastSongHistoryItem {
  sh_id?: number;
  played_at?: number;
  duration?: number;
  song?: RawAzuraCastSong;
}

export interface RawAzuraCastCurrentSong {
  song?: RawAzuraCastSong;
  duration?: number;
  playlist?: string;
  streamer?: string;
  is_request?: boolean;
  elapsed?: number;
  remaining?: number;
}

export interface RawAzuraCastMount {
  id?: number;
  name?: string;
  url?: string;
  bitrate?: number;
  format?: string;
  listeners?: {
    total?: number;
    unique?: number;
    current?: number;
  };
}

export interface RawAzuraCastStation {
  id?: number;
  name?: string;
  shortcode?: string;
  description?: string;
  frontend?: string;
  backend?: string;
  listen_url?: string;
  url?: string;
  public_player_url?: string;
  is_public?: boolean;
  hls_enabled?: boolean;
  hls_url?: string | null;
}

export interface RawAzuraCastNowPlaying {
  station?: RawAzuraCastStation;
  listeners?: {
    total?: number;
    unique?: number;
    current?: number;
  };
  live?: {
    is_live?: boolean;
    streamer_name?: string;
    broadcast_start?: number | null;
    art?: string;
  };
  now_playing?: RawAzuraCastCurrentSong;
  playing_next?: {
    song?: RawAzuraCastSong;
    duration?: number;
  } | null;
  song_history?: RawAzuraCastSongHistoryItem[];
  is_online?: boolean;
  cache?: string;
  mounts?: RawAzuraCastMount[];
}

/** Normalised, UI-safe shape. Every field has a defined fallback so
 * components never need to null-check deeply nested paths. */
export interface NormalisedSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  artUrl: string | null;
}

export interface NormalisedHistoryItem {
  id: string;
  song: NormalisedSong;
  playedAt: number | null;
  durationSeconds: number;
}

export interface NormalisedMount {
  id: string;
  name: string;
  url: string | null;
  bitrate: number | null;
  format: string | null;
  listeners: number;
}

export interface NormalisedNowPlaying {
  isOnline: boolean;
  isLive: boolean;
  stationName: string;
  stationDescription: string;
  streamerName: string | null;
  streamUrl: string | null;
  listenerCount: number;
  song: NormalisedSong;
  elapsedSeconds: number;
  remainingSeconds: number;
  durationSeconds: number;
  history: NormalisedHistoryItem[];
  mounts: NormalisedMount[];
  fetchedAt: number;
}

export const FALLBACK_SONG: NormalisedSong = {
  id: "unknown",
  title: "Redemption Radio",
  artist: "Christian Music & Teaching",
  album: "",
  artUrl: null,
};

export const OFFLINE_NOW_PLAYING: NormalisedNowPlaying = {
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
