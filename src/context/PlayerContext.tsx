import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNowPlaying } from "@/hooks/useNowPlaying";
import { OFFLINE_NOW_PLAYING, type NormalisedNowPlaying } from "@/types/azuracast";
import { clampVolume, isBufferingStatus, isPlayingStatus, resolveToggleAction, shouldUpdateStreamSource } from "@/lib/playerLogic";

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "buffering" | "error";

interface PlayerContextValue {
  nowPlaying: NormalisedNowPlaying;
  status: PlaybackStatus;
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  volume: number;
  errorMessage: string | null;
  isFetchError: boolean;
  isStationOffline: boolean;
  isExpanded: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  retry: () => void;
  setExpanded: (value: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const nowPlayingQuery = useNowPlaying();
  const nowPlaying = nowPlayingQuery.data ?? OFFLINE_NOW_PLAYING;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setExpanded] = useState(false);
  const [wantsToPlay, setWantsToPlay] = useState(false);

  // Create the single audio element once. Never recreated on re-render.
  if (!audioRef.current && typeof window !== "undefined") {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volume;
    audioRef.current = audio;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => setStatus("playing");
    const handleWaiting = () => setStatus("buffering");
    const handlePause = () => setStatus((prev) => (prev === "error" ? prev : "paused"));
    const handleError = () => {
      setStatus("error");
      setErrorMessage("Stream connection was interrupted.");
    };
    const handleCanPlay = () => setErrorMessage(null);

    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Only touch `src` when the actual stream URL changes, never on every
  // now-playing metadata refresh. This is the key rule that prevents the
  // audio from restarting/glitching every 15s.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextUrl = nowPlaying.streamUrl;

    if (!shouldUpdateStreamSource(currentSrcRef.current, nextUrl)) return;

    const wasPlaying = wantsToPlay;
    currentSrcRef.current = nextUrl;

    if (!nextUrl) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      setStatus("idle");
      return;
    }

    audio.src = nextUrl;
    audio.load();

    if (wasPlaying) {
      setStatus("loading");
      audio.play().catch(() => {
        setStatus("error");
        setErrorMessage("Playback could not start automatically.");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying.streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying.streamUrl) return;
    setWantsToPlay(true);
    setErrorMessage(null);

    if (!audio.src) {
      audio.src = nowPlaying.streamUrl;
      currentSrcRef.current = nowPlaying.streamUrl;
    }

    setStatus("loading");
    audio.play().catch(() => {
      setStatus("error");
      setErrorMessage("Playback could not start. Please try again.");
    });
  }, [nowPlaying.streamUrl]);

  const pause = useCallback(() => {
    setWantsToPlay(false);
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    if (resolveToggleAction(status) === "pause") {
      pause();
    } else {
      play();
    }
  }, [status, play, pause]);

  const retry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !nowPlaying.streamUrl) return;
    setErrorMessage(null);
    currentSrcRef.current = null;
    audio.src = nowPlaying.streamUrl;
    currentSrcRef.current = nowPlaying.streamUrl;
    audio.load();
    setStatus("loading");
    setWantsToPlay(true);
    audio.play().catch(() => {
      setStatus("error");
      setErrorMessage("Redemption Radio is temporarily unreachable.");
    });
  }, [nowPlaying.streamUrl]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(clampVolume(value));
    setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Media Session API for lock-screen / OS-level controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: nowPlaying.song.title,
      artist: nowPlaying.song.artist,
      album: nowPlaying.stationName,
      artwork: nowPlaying.song.artUrl
        ? [{ src: nowPlaying.song.artUrl, sizes: "512x512", type: "image/jpeg" }]
        : [],
    });
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.playbackState = status === "playing" ? "playing" : "paused";

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [nowPlaying.song, nowPlaying.stationName, play, pause, status]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      nowPlaying,
      status,
      isPlaying: isPlayingStatus(status),
      isBuffering: isBufferingStatus(status),
      isMuted,
      volume,
      errorMessage,
      isFetchError: nowPlayingQuery.isError,
      isStationOffline: !nowPlaying.isOnline,
      isExpanded,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
      retry,
      setExpanded,
    }),
    [
      nowPlaying,
      status,
      isMuted,
      volume,
      errorMessage,
      nowPlayingQuery.isError,
      isExpanded,
      play,
      pause,
      toggle,
      setVolume,
      toggleMute,
      retry,
    ]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to this provider's context
export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within a PlayerProvider");
  return ctx;
}
