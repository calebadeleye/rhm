import type { SermonMessage } from "@/types/content";

/**
 * Editable message/sermon catalogue. In production this can be backed by a
 * podcast feed or an AzuraCast on-demand playlist via the backend
 * integration layer in server/services/sermons — components should not
 * assume every AzuraCast history item is a sermon.
 */
export const sermons: SermonMessage[] = [
  {
    id: "faith-that-moves-mountains",
    slug: "faith-that-moves-mountains",
    title: "Faith That Moves Mountains",
    description:
      "A study through Mark 11, on praying with unwavering faith and what it means to speak to the mountains in your life.",
    speakerId: "eric-johnson",
    category: "sermon",
    publishedAt: "2026-05-18",
    durationSeconds: 2205,
    thumbnailUrl: "",
    audioUrl: null,
  },
  {
    id: "grace-that-transforms",
    slug: "grace-that-transforms",
    title: "Grace That Transforms",
    description:
      "How the grace of God does more than forgive — it reshapes character, habits and the way we see ourselves.",
    speakerId: "eric-johnson",
    category: "teaching",
    publishedAt: "2026-05-11",
    durationSeconds: 2530,
    thumbnailUrl: "",
    audioUrl: null,
  },
  {
    id: "walking-in-purpose",
    slug: "walking-in-purpose",
    title: "Walking in Purpose",
    description:
      "An encouragement for anyone feeling stuck: how to discern God's calling one faithful step at a time.",
    speakerId: "eric-johnson",
    category: "teaching",
    publishedAt: "2026-05-04",
    durationSeconds: 2368,
    thumbnailUrl: "",
    audioUrl: null,
  },
  {
    id: "a-testimony-of-healing",
    slug: "a-testimony-of-healing",
    title: "A Testimony of Healing",
    description:
      "A listener shares her journey through illness and the moment she says she experienced God's healing hand.",
    speakerId: "sarah-collins",
    category: "testimony",
    publishedAt: "2026-04-22",
    durationSeconds: 980,
    thumbnailUrl: "",
    audioUrl: null,
  },
  {
    id: "real-talk-doubt-and-faith",
    slug: "real-talk-doubt-and-faith",
    title: "Real Talk: Doubt and Faith",
    description:
      "Jonathan Hayes and guests talk honestly about seasons of doubt, and why questioning God isn't the opposite of faith.",
    speakerId: "jonathan-hayes",
    category: "teaching",
    publishedAt: "2026-04-14",
    durationSeconds: 3120,
    thumbnailUrl: "",
    audioUrl: null,
  },
  {
    id: "evening-worship-devotional",
    slug: "evening-worship-devotional",
    title: "Evening Worship Devotional",
    description:
      "A quiet, reflective devotional recorded for listeners winding down after a long day.",
    speakerId: "eric-johnson",
    category: "worship-devotional",
    publishedAt: "2026-04-02",
    durationSeconds: 720,
    thumbnailUrl: "",
    audioUrl: null,
  },
];

export function getSermonBySlug(slug: string): SermonMessage | undefined {
  return sermons.find((sermon) => sermon.slug === slug);
}
