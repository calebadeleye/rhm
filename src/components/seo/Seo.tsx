import { Helmet } from "react-helmet-async";
import { env } from "@/lib/env";

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "music.radio_station";
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  structuredData,
  noIndex = false,
}: SeoProps) {
  const fullTitle = `${title} | Redemption Hour Radio`;
  const url = new URL(path, env.siteUrl).toString();
  const ogImage = image ?? new URL("/social-preview.svg", env.siteUrl).toString();
  const jsonLd = Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Redemption Hour Radio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
