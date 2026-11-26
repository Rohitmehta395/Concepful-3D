import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const baseUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : undefined;

  if (!baseUrl) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
