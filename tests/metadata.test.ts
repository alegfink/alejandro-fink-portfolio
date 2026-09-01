import { afterEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { buildMetadata, indexingEnabled } from "@/lib/metadata";

describe("canonical metadata", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("enables indexing only for the verified production hostname", () => {
    vi.stubEnv("NEXT_PUBLIC_INDEXING_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.alejandrofink.com");
    expect(indexingEnabled()).toBe(true);

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com");
    expect(indexingEnabled()).toBe(false);

    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://127.0.0.1:3000");
    expect(indexingEnabled()).toBe(false);
  });

  it("keeps Spanish as x-default in page metadata and sitemap", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.alejandrofink.com");
    const metadata = buildMetadata({
      locale: "en",
      path: "/en/projects",
      alternatePath: "/proyectos",
      title: "Projects",
      description: "Selected projects",
      noIndex: false,
    });

    expect(metadata.alternates).toMatchObject({
      canonical: "/en/projects",
      languages: { es: "/proyectos", en: "/en/projects", "x-default": "/proyectos" },
    });
    expect(sitemap()).toHaveLength(8);
    for (const entry of sitemap()) {
      expect(entry.alternates?.languages?.["x-default"]).toMatch(/^https:\/\/www\.alejandrofink\.com\/(?!en(?:\/|$))/);
    }
  });

  it("keeps previews closed while production exposes the sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_INDEXING_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com");
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });

    vi.stubEnv("NEXT_PUBLIC_INDEXING_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.alejandrofink.com");
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://www.alejandrofink.com/sitemap.xml",
    });
  });
});
