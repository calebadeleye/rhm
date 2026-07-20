import { describe, expect, it } from "vitest";
import { normaliseNowPlaying, normaliseSong } from "@/lib/azuracast/normalise";
import { FALLBACK_SONG } from "@/types/azuracast";

describe("normaliseSong", () => {
  it("returns the fallback song when given null", () => {
    expect(normaliseSong(null)).toEqual(FALLBACK_SONG);
  });

  it("prefers title over text, and falls back to artist defaults", () => {
    const song = normaliseSong({ title: "Amazing Grace", text: "Ignored Text" });
    expect(song.title).toBe("Amazing Grace");
    expect(song.artist).toBe("Redemption Radio");
  });

  it("falls back to text when title is missing", () => {
    const song = normaliseSong({ text: "Great Are You Lord" });
    expect(song.title).toBe("Great Are You Lord");
  });

  it("rejects invalid artwork URLs instead of throwing", () => {
    const song = normaliseSong({ title: "Song", art: "not-a-url" });
    expect(song.artUrl).toBeNull();
  });

  it("accepts a valid artwork URL", () => {
    const song = normaliseSong({ title: "Song", art: "https://cdn.example.com/art.jpg" });
    expect(song.artUrl).toBe("https://cdn.example.com/art.jpg");
  });
});

describe("normaliseNowPlaying", () => {
  it("handles a completely malformed/empty payload without throwing", () => {
    const result = normaliseNowPlaying(null);
    expect(result.isOnline).toBe(false);
    expect(result.isLive).toBe(false);
    expect(result.song).toEqual(FALLBACK_SONG);
    expect(result.history).toEqual([]);
  });

  it("handles a non-object payload without throwing", () => {
    const result = normaliseNowPlaying("unexpected string response");
    expect(result.isOnline).toBe(false);
  });

  it("marks the station online when a stream URL and is_online resolve", () => {
    const result = normaliseNowPlaying({
      is_online: true,
      station: { name: "Redemption Radio", listen_url: "https://stream.example.com/radio.mp3" },
      now_playing: { song: { title: "Song", artist: "Artist" }, elapsed: 30, remaining: 90, duration: 120 },
      listeners: { current: 42 },
    });

    expect(result.isOnline).toBe(true);
    expect(result.streamUrl).toBe("https://stream.example.com/radio.mp3");
    expect(result.listenerCount).toBe(42);
    expect(result.song.title).toBe("Song");
  });

  it("falls back to the first valid mount URL when listen_url is missing", () => {
    const result = normaliseNowPlaying({
      is_online: true,
      station: { name: "Redemption Radio" },
      mounts: [
        { id: 1, url: "not-a-url" },
        { id: 2, url: "https://stream.example.com/mount2.mp3" },
      ],
    });

    expect(result.streamUrl).toBe("https://stream.example.com/mount2.mp3");
  });

  it("reports offline when is_online is false even if a stream URL exists", () => {
    const result = normaliseNowPlaying({
      is_online: false,
      station: { listen_url: "https://stream.example.com/radio.mp3" },
    });

    expect(result.isOnline).toBe(false);
  });

  it("reports offline when no usable stream URL can be resolved", () => {
    const result = normaliseNowPlaying({
      is_online: true,
      station: {},
      mounts: [],
    });

    expect(result.isOnline).toBe(false);
    expect(result.streamUrl).toBeNull();
  });

  it("does not mark the station live if is_online is false, even if live.is_live is true", () => {
    const result = normaliseNowPlaying({
      is_online: false,
      station: { listen_url: "https://stream.example.com/radio.mp3" },
      live: { is_live: true, streamer_name: "Jonathan Hayes" },
    });

    expect(result.isLive).toBe(false);
    expect(result.streamerName).toBeNull();
  });

  it("normalises song history defensively, capping at 10 entries", () => {
    const history = Array.from({ length: 15 }, (_, i) => ({
      sh_id: i,
      song: { title: `Song ${i}` },
    }));

    const result = normaliseNowPlaying({
      is_online: true,
      station: { listen_url: "https://stream.example.com/radio.mp3" },
      song_history: history,
    });

    expect(result.history).toHaveLength(10);
    expect(result.history[0].song.title).toBe("Song 0");
  });
});
