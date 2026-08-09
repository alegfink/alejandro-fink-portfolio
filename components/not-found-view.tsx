"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/site";
import { routeNames, type Locale } from "@/lib/i18n";

export function NotFoundView({ forceLocale }: { forceLocale?: Locale }) {
  const pathname = usePathname();
  const locale: Locale = forceLocale ?? (pathname.startsWith("/es") ? "es" : "en");
  const copy = siteCopy[locale];
  return (
    <main className="not-found shell" id="main-content">
      <p className="eyebrow">{copy.notFound.eyebrow}</p>
      <h1>{copy.notFound.title}</h1>
      <p>{copy.notFound.text}</p>
      <div className="button-row"><Link className="button button--primary" href={routeNames[locale].home}>{copy.common.backHome}</Link><Link className="button button--secondary" href={routeNames[locale].work}>{copy.nav.work}</Link></div>
    </main>
  );
}
