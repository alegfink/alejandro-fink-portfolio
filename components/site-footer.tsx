import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { routeNames, type Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="brand brand--footer"><span className="brand__mark" aria-hidden="true">AF</span><span className="brand__name">Alejandro Fink</span></p>
          <p>{copy.footer.note}</p>
        </div>
        <nav aria-label={locale === "es" ? "Navegación de pie" : "Footer navigation"}>
          <Link href={routes.work}>{copy.nav.work}</Link>
          <Link href={routes.about}>{copy.nav.about}</Link>
          <Link href={routes.contact}>{copy.nav.contact}</Link>
          <Link href={routes.privacy}>{copy.footer.privacy}</Link>
        </nav>
        <div className="site-footer__locale">
          <span>{copy.footer.language}</span>
          <LanguageSwitcher locale={locale} compact />
        </div>
      </div>
      <div className="shell site-footer__base"><span>© {new Date().getFullYear()} Alejandro Fink</span><span>{copy.descriptor}</span></div>
    </footer>
  );
}
