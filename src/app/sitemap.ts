import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : undefined;

  if (!baseUrl) {
    return [];
  }

  return [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
