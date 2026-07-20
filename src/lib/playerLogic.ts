import type { PlaybackStatus } from "@/context/PlayerContext";

/**
 * Pure decision function extracted from PlayerContext so the "never restart
 * the stream on a metadata-only refresh" rule can be unit tested without a
 * real <audio> element or React. Returns true only when the resolved stream
 * URL has actually changed.
 */
export function shouldUpdateStreamSource(currentSrc: string | null, nextUrl: string | null): boolean {
  return nextUrl !== currentSrc;
}

export function isPlayingStatus(status: PlaybackStatus): boolean {
  return status === "playing";
}

export function isBufferingStatus(status: PlaybackStatus): boolean {
  return status === "buffering" || status === "loading";
}

/** Given the current status and a user's toggle action, what should happen. */
export function resolveToggleAction(status: PlaybackStatus): "play" | "pause" {
  return isPlayingStatus(status) || isBufferingStatus(status) ? "pause" : "play";
}

export function clampVolume(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}
