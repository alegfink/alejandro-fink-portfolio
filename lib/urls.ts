import { projectBase, type Locale } from "@/lib/i18n";

const LOCAL_SITE_URL = "http://localhost:3000";
const PRODUCTION_SITE_URL = "https://www.alejandrofink.com";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

function fallbackSiteUrl(): string {
  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : LOCAL_SITE_URL;
}

export function getSiteUrl(): URL {
  const fallback = fallbackSiteUrl();
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback;
  try {
    const configured = new URL(raw);
    if (process.env.NODE_ENV === "production" && LOCAL_HOSTNAMES.has(configured.hostname)) {
      return new URL(PRODUCTION_SITE_URL);
    }
    return configured;
  } catch {
    return new URL(fallback);
  }
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function projectPath(locale: Locale, slug: string): string {
  return `${projectBase(locale)}/${slug}`;
}
