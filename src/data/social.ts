import { env } from "@/lib/env";

export interface SocialLink {
  id: "facebook" | "instagram" | "youtube" | "x";
  label: string;
  url: string;
}

const allSocialLinks: SocialLink[] = [
  { id: "facebook", label: "Facebook", url: env.facebookUrl },
  { id: "instagram", label: "Instagram", url: env.instagramUrl },
  { id: "youtube", label: "YouTube", url: env.youtubeUrl },
  { id: "x", label: "X (Twitter)", url: env.xUrl },
];

export const socialLinks: SocialLink[] = allSocialLinks.filter((link) => link.url.length > 0);
