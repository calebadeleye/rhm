import { env } from "@/lib/env";
import type { Programme, SermonMessage, Presenter } from "@/types/content";
import { getNextBroadcast } from "@/lib/schedule";

export function radioStationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RadioStation",
    name: "Redemption Radio",
    url: env.siteUrl,
    broadcastFrequency: "Internet Radio",
    description:
      "Redemption Radio streams Christian worship music, biblical teaching, prayer and hope 24/7.",
    parentOrganization: {
      "@type": "Organization",
      name: "Redemption Hour Ministries",
    },
  };
}

export function broadcastEventSchema(programme: Programme, presenter?: Presenter) {
  const next = getNextBroadcast(programme);
  return {
    "@context": "https://schema.org",
    "@type": "BroadcastEvent",
    name: programme.title,
    description: programme.shortDescription,
    startDate: next?.toISOString(),
    isLiveBroadcast: true,
    publishedOn: {
      "@type": "RadioBroadcastService",
      name: "Redemption Radio",
      broadcastDisplayName: "Redemption Radio",
      url: env.siteUrl,
    },
    performer: presenter
      ? { "@type": "Person", name: presenter.name }
      : undefined,
  };
}

export function audioObjectSchema(message: SermonMessage, speaker?: Presenter) {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: message.title,
    description: message.description,
    datePublished: message.publishedAt,
    duration: `PT${Math.round(message.durationSeconds / 60)}M`,
    associatedMedia: message.audioUrl
      ? { "@type": "AudioObject", contentUrl: message.audioUrl }
      : undefined,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Redemption Radio Messages",
      url: `${env.siteUrl}/messages`,
    },
    author: speaker ? { "@type": "Person", name: speaker.name } : undefined,
  };
}
