"use client";

import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/site";
import { routeNames, type Locale } from "@/lib/i18n";
import { GlobalNotFoundView } from "@/components/global-not-found-view";

export function NotFoundView({ forceLocale }: { forceLocale?: Locale }) {
  const pathname = usePathname();
  const hasLocale = pathname === "/es" || pathname.startsWith("/es/") || pathname === "/en" || pathname.startsWith("/en/");
  if (!forceLocale && !hasLocale) return <GlobalNotFoundView />;
  const locale: Locale = forceLocale ?? (pathname.startsWith("/es") ? "es" : "en");
  const copy = siteCopy[locale];
  return (
    <main className="not-found shell" id="main-content">
      <p className="eyebrow">{copy.notFound.eyebrow}</p>
      <h1>{copy.notFound.title}</h1>
      <p>{copy.notFound.text}</p>
      <div className="button-row"><a className="button button--primary" href={routeNames[locale].home}>{copy.common.backHome}</a><a className="button button--secondary" href={routeNames[locale].work}>{copy.nav.work}</a></div>
    </main>
  );
}
