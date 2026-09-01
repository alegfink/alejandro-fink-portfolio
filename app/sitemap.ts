import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/urls";

type Pair = { es: string; en: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs: Array<Pair & { priority: number }> = [
    { es: "/", en: "/en", priority: 1 },
    { es: "/proyectos", en: "/en/projects", priority: .9 },
    { es: "/acerca-de", en: "/en/about", priority: .8 },
    { es: "/privacidad", en: "/en/privacy", priority: .4 },
  ];

  return pairs.flatMap((pair) => (["es", "en"] as const).map((locale) => ({
    url: absoluteUrl(pair[locale]),
    lastModified: new Date("2026-08-31"),
    changeFrequency: "monthly" as const,
    priority: pair.priority,
    alternates: { languages: { es: absoluteUrl(pair.es), en: absoluteUrl(pair.en), "x-default": absoluteUrl(pair.es) } },
  })));
}
