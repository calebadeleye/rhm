import { describe, expect, it } from "vitest";
import {
  normaliseOnDemandItem,
  normalisePodcastEpisode,
  type RawOnDemandItem,
  type RawPodcast,
  type RawPodcastEpisode,
} from "./episodes.js";

describe("normaliseOnDemandItem", () => {
  const baseItem: RawOnDemandItem = {
    media: {
      id: "42",
      title: "Morning Praise — Week 1",
      artist: "Pastor Emmanuel",
      description: "Uplifting songs to start your day",
      art: "https://radio.rhm.com.ng/api/station/1/art/42",
      length: 1800,
      uploaded_at: 1_700_000_000,
    },
    playlist: "morning_praise",
    is_downloadable: true,
    download_url: "/api/station/1/ondemand/download/42",
  };

  it("normalises a valid on-demand item", () => {
    const result = normaliseOnDemandItem(baseItem, "https://radio.rhm.com.ng");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("42");
    expect(result?.title).toBe("Morning Praise — Week 1");
    expect(result?.category).toBe("worship");
    expect(result?.durationSeconds).toBe(1800);
    expect(result?.publishedAt).toBe(new Date(1_700_000_000 * 1000).toISOString());
  });

  it("resolves a relative download_url against the AzuraCast base URL", () => {
    const result = normaliseOnDemandItem(baseItem, "https://radio.rhm.com.ng");
    expect(result?.downloadUrl).toBe(
      "https://radio.rhm.com.ng/api/station/1/ondemand/download/42"
    );
  });

  it("leaves an absolute download_url untouched", () => {
    const result = normaliseOnDemandItem(
      { ...baseItem, download_url: "https://cdn.example.com/42.mp3" },
      "https://radio.rhm.com.ng"
    );
    expect(result?.downloadUrl).toBe("https://cdn.example.com/42.mp3");
  });

  it("excludes items with no media", () => {
    expect(normaliseOnDemandItem({ ...baseItem, media: undefined }, "https://radio.rhm.com.ng")).toBeNull();
  });

  it("excludes items with no media id", () => {
    expect(
      normaliseOnDemandItem(
        { ...baseItem, media: { ...baseItem.media, id: undefined } },
        "https://radio.rhm.com.ng"
      )
    ).toBeNull();
  });

  it("excludes items with no download_url", () => {
    expect(normaliseOnDemandItem({ ...baseItem, download_url: undefined }, "https://radio.rhm.com.ng")).toBeNull();
  });

  it("falls back to the default category for an unrecognised playlist", () => {
    const result = normaliseOnDemandItem({ ...baseItem, playlist: "special_event" }, "https://radio.rhm.com.ng");
    expect(result?.category).toBe("special");
  });

  it("falls back to a generic title when missing", () => {
    const result = normaliseOnDemandItem(
      { ...baseItem, media: { ...baseItem.media, title: undefined } },
      "https://radio.rhm.com.ng"
    );
    expect(result?.title).toBe("Untitled episode");
  });

  it("returns null publishedAt when uploaded_at is missing", () => {
    const result = normaliseOnDemandItem(
      { ...baseItem, media: { ...baseItem.media, uploaded_at: undefined } },
      "https://radio.rhm.com.ng"
    );
    expect(result?.publishedAt).toBeNull();
  });
});

describe("normalisePodcastEpisode", () => {
  const podcast: RawPodcast = {
    id: "pod-1",
    title: "Sunday Sermons",
    art: "https://radio.rhm.com.ng/api/station/1/podcast/pod-1/art",
    is_published: true,
  };

  const episode: RawPodcastEpisode = {
    id: "ep-1",
    title: "Walking in Faith",
    description: "<p>Full sermon notes</p>",
    description_short: "Full sermon notes",
    publish_at: 1_700_000_000,
    is_published: true,
    has_media: true,
    art: null,
    media: { length: 2400 },
  };

  it("normalises a valid podcast episode", () => {
    const result = normalisePodcastEpisode(episode, podcast, "https://radio.rhm.com.ng", "1");
    expect(result).not.toBeNull();
    expect(result?.id).toBe("podcast-ep-1");
    expect(result?.title).toBe("Walking in Faith");
    expect(result?.description).toBe("Full sermon notes");
    expect(result?.durationSeconds).toBe(2400);
    expect(result?.publishedAt).toBe(new Date(1_700_000_000 * 1000).toISOString());
  });

  it("builds the media URL from the station/podcast/episode ids", () => {
    const result = normalisePodcastEpisode(episode, podcast, "https://radio.rhm.com.ng", "1");
    expect(result?.downloadUrl).toBe(
      "https://radio.rhm.com.ng/api/station/1/podcast/pod-1/episode/ep-1/media"
    );
  });

  it("falls back to the podcast's art when the episode has none", () => {
    const result = normalisePodcastEpisode(episode, podcast, "https://radio.rhm.com.ng", "1");
    expect(result?.artUrl).toBe(podcast.art);
  });

  it("prefers the episode's own art when present", () => {
    const result = normalisePodcastEpisode(
      { ...episode, art: "https://radio.rhm.com.ng/episode-art.jpg" },
      podcast,
      "https://radio.rhm.com.ng",
      "1"
    );
    expect(result?.artUrl).toBe("https://radio.rhm.com.ng/episode-art.jpg");
  });

  it("excludes episodes with no media", () => {
    expect(
      normalisePodcastEpisode({ ...episode, has_media: false }, podcast, "https://radio.rhm.com.ng", "1")
    ).toBeNull();
  });

  it("excludes unpublished episodes", () => {
    expect(
      normalisePodcastEpisode({ ...episode, is_published: false }, podcast, "https://radio.rhm.com.ng", "1")
    ).toBeNull();
  });

  it("excludes episodes with no id", () => {
    expect(
      normalisePodcastEpisode({ ...episode, id: undefined }, podcast, "https://radio.rhm.com.ng", "1")
    ).toBeNull();
  });

  it("returns null when the podcast has no id", () => {
    expect(
      normalisePodcastEpisode(episode, { ...podcast, id: undefined }, "https://radio.rhm.com.ng", "1")
    ).toBeNull();
  });
});
