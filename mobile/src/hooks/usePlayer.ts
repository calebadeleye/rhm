import { useCallback, useEffect, useState } from 'react';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import { setupPlayer } from '../player/setupPlayer';
import type { NormalisedNowPlaying } from '../types/azuracast';
import type { Episode } from '../types/episodes';

export interface PlayerTrackMeta {
  type: 'live' | 'episode';
  id: string;
  title: string;
  subtitle: string;
  artUrl: string | null;
}

const LIVE_TRACK_ID = 'live-stream';

/** Thin wrapper around react-native-track-player. TrackPlayer's queue is
 * native/global state, so any screen using this hook stays in sync with
 * playback started from another screen (e.g. Home's play button vs the
 * Listen Again tab) without needing a shared context. */
export function usePlayer() {
  const playbackState = usePlaybackState();
  const [currentMeta, setCurrentMeta] = useState<PlayerTrackMeta | null>(null);

  useEffect(() => {
    setupPlayer();
  }, []);

  const playLive = useCallback(async (nowPlaying: NormalisedNowPlaying) => {
    if (!nowPlaying.streamUrl) return;
    await setupPlayer();
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: LIVE_TRACK_ID,
      url: nowPlaying.streamUrl,
      title: nowPlaying.song.title,
      artist: nowPlaying.song.artist,
      artwork: nowPlaying.song.artUrl ?? undefined,
      isLiveStream: true,
    });
    await TrackPlayer.play();
    setCurrentMeta({
      type: 'live',
      id: LIVE_TRACK_ID,
      title: nowPlaying.song.title,
      subtitle: nowPlaying.song.artist,
      artUrl: nowPlaying.song.artUrl,
    });
  }, []);

  const playEpisode = useCallback(async (episode: Episode) => {
    await setupPlayer();
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: episode.id,
      url: episode.downloadUrl,
      title: episode.title,
      artist: 'Redemption Radio',
      artwork: episode.artUrl ?? undefined,
    });
    await TrackPlayer.play();
    setCurrentMeta({
      type: 'episode',
      id: episode.id,
      title: episode.title,
      subtitle: episode.description,
      artUrl: episode.artUrl,
    });
  }, []);

  const togglePlayPause = useCallback(async () => {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, []);

  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering || playbackState.state === State.Loading;
  const isLive = currentMeta?.type === 'live';

  return { currentMeta, isPlaying, isBuffering, isLive, playLive, playEpisode, togglePlayPause };
}
