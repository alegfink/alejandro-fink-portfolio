import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { absoluteUrl, getSiteUrl } from "@/lib/urls";

type MetadataInput = {
  locale: Locale;
  path: string;
  alternatePath: string;
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
};

export function indexingEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_INDEXING_ENABLED !== "true") return false;

  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let hostname = getSiteUrl().hostname;
  if (configuredUrl) {
    try {
      hostname = new URL(configuredUrl).hostname;
    } catch {
      return false;
    }
  }

  return hostname === "alejandrofink.com" || hostname === "www.alejandrofink.com";
}

export function buildMetadata({ locale, path, alternatePath, title, description, image, noIndex = true }: MetadataInput): Metadata {
  const esPath = locale === "es" ? path : alternatePath;
  const enPath = locale === "en" ? path : alternatePath;
  const shouldIndex = indexingEnabled() && !noIndex;
  const ogImage = image ?? "/og.png";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: { es: esPath, en: enPath, "x-default": esPath },
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title,
      description,
      siteName: "Alejandro Fink",
      locale: locale === "es" ? "es_AR" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_AR"],
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(ogImage)] },
    robots: { index: shouldIndex, follow: shouldIndex },
  };
}
