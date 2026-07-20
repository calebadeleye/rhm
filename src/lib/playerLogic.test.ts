import { describe, expect, it } from "vitest";
import {
  clampVolume,
  isBufferingStatus,
  isPlayingStatus,
  resolveToggleAction,
  shouldUpdateStreamSource,
} from "@/lib/playerLogic";

describe("shouldUpdateStreamSource", () => {
  it("returns false when the URL is unchanged (prevents restarting on metadata refresh)", () => {
    expect(shouldUpdateStreamSource("https://stream.example.com/a.mp3", "https://stream.example.com/a.mp3")).toBe(false);
  });

  it("returns true when the URL actually changes", () => {
    expect(shouldUpdateStreamSource("https://stream.example.com/a.mp3", "https://stream.example.com/b.mp3")).toBe(true);
  });

  it("returns true when going from null to a real URL", () => {
    expect(shouldUpdateStreamSource(null, "https://stream.example.com/a.mp3")).toBe(true);
  });

  it("returns true when going from a URL to null (station went offline)", () => {
    expect(shouldUpdateStreamSource("https://stream.example.com/a.mp3", null)).toBe(true);
  });

  it("returns false when both are null", () => {
    expect(shouldUpdateStreamSource(null, null)).toBe(false);
  });
});

describe("resolveToggleAction", () => {
  it("pauses when currently playing", () => {
    expect(resolveToggleAction("playing")).toBe("pause");
  });

  it("pauses when buffering (avoids stacking a second play call mid-buffer)", () => {
    expect(resolveToggleAction("buffering")).toBe("pause");
  });

  it("pauses when loading", () => {
    expect(resolveToggleAction("loading")).toBe("pause");
  });

  it("plays when paused", () => {
    expect(resolveToggleAction("paused")).toBe("play");
  });

  it("plays when idle", () => {
    expect(resolveToggleAction("idle")).toBe("play");
  });

  it("plays when in an error state (lets the user retry via toggle)", () => {
    expect(resolveToggleAction("error")).toBe("play");
  });
});

describe("isPlayingStatus / isBufferingStatus", () => {
  it("only 'playing' counts as playing", () => {
    expect(isPlayingStatus("playing")).toBe(true);
    expect(isPlayingStatus("buffering")).toBe(false);
    expect(isPlayingStatus("paused")).toBe(false);
  });

  it("'buffering' and 'loading' count as buffering", () => {
    expect(isBufferingStatus("buffering")).toBe(true);
    expect(isBufferingStatus("loading")).toBe(true);
    expect(isBufferingStatus("playing")).toBe(false);
  });
});

describe("clampVolume", () => {
  it("clamps above 1 down to 1", () => {
    expect(clampVolume(1.5)).toBe(1);
  });

  it("clamps below 0 up to 0", () => {
    expect(clampVolume(-0.2)).toBe(0);
  });

  it("passes through valid values unchanged", () => {
    expect(clampVolume(0.5)).toBe(0.5);
  });

  it("treats NaN as 0", () => {
    expect(clampVolume(Number.NaN)).toBe(0);
  });
});
