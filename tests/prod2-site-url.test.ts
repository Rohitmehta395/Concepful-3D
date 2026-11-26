import { describe, it, expect, beforeEach, afterEach } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("NEXT_PUBLIC_SITE_URL metadata routes", () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    if (originalSiteUrl === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
    }
  });

  it("disallows all and emits no sitemap entries when NEXT_PUBLIC_SITE_URL is unset", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    });
    expect(sitemap()).toEqual([]);
  });

  it("disallows all and emits no sitemap entries when NEXT_PUBLIC_SITE_URL is whitespace", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "   ";
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    });
    expect(sitemap()).toEqual([]);
  });

  it("allows all, includes Sitemap, and emits single entry without lastModified when NEXT_PUBLIC_SITE_URL is set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org/";
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://example.org/sitemap.xml",
    });

    const entries = sitemap();
    expect(entries).toEqual([
      {
        url: "https://example.org",
        changeFrequency: "monthly",
        priority: 1,
      },
    ]);
    expect(entries[0]).toBeDefined();
    expect("lastModified" in entries[0]!).toBe(false);
  });
});
