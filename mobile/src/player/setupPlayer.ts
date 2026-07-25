import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from 'react-native-track-player';

let setupPromise: Promise<void> | null = null;

/** Idempotent: safe to call from multiple mount points (e.g. Home and
 * Player screens both want the player ready). */
export function setupPlayer(): Promise<void> {
  if (!setupPromise) {
    setupPromise = TrackPlayer.setupPlayer().then(() =>
      TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
        compactCapabilities: [Capability.Play, Capability.Pause],
        notificationCapabilities: [Capability.Play, Capability.Pause, Capability.Stop],
      }),
    );
  }
  return setupPromise;
}
