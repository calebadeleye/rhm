import TrackPlayer, { Event } from 'react-native-track-player';

/** Registered once in index.js via TrackPlayer.registerPlaybackService.
 * Wires lock-screen / notification remote controls to the player. */
export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
}
