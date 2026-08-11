import { projectBase, type Locale } from "@/lib/i18n";

export function getSiteUrl(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export function projectPath(locale: Locale, slug: string): string {
  return `${projectBase(locale)}/${slug}`;
}
