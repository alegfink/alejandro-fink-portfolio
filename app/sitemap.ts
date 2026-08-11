import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl, projectPath } from "@/lib/urls";

type Pair = { es: string; en: string };

const staticPairs: Pair[] = [
  { es: "/es", en: "/en" },
  { es: "/es/proyectos", en: "/en/work" },
  { es: "/es/sobre-mi", en: "/en/about" },
  { es: "/es/contacto", en: "/en/contact" },
  { es: "/es/privacidad", en: "/en/privacy" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs = [
    ...staticPairs,
    ...projects.map((project) => ({ es: projectPath("es", project.slug.es), en: projectPath("en", project.slug.en) })),
  ];

  return pairs.flatMap((pair) => (["es", "en"] as const).map((locale) => ({
    url: absoluteUrl(pair[locale]),
    lastModified: new Date("2026-08-08"),
    changeFrequency: "monthly" as const,
    priority: pair[locale] === `/${locale}` ? 1 : pair[locale].includes(locale === "es" ? "/proyectos/" : "/work/") ? 0.8 : 0.7,
    alternates: { languages: { es: absoluteUrl(pair.es), en: absoluteUrl(pair.en), "x-default": absoluteUrl(pair.en) } },
  })));
}
