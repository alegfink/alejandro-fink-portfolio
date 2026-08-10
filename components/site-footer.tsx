import { LanguageSwitcher } from "@/components/language-switcher";
import { routeNames, type Locale } from "@/lib/i18n";
import { publicContactEmail, siteCopy } from "@/content/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <p className="brand brand--footer"><span className="brand__mark" aria-hidden="true">AF</span><span className="brand__name">Alejandro Fink</span></p>
          <p>{copy.footer.note}</p>
          <a className="site-footer__email" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>
        </div>
        <nav aria-label={locale === "es" ? "Navegación de pie" : "Footer navigation"}>
          <a href={routes.work}>{copy.nav.work}</a>
          <a href={routes.about}>{copy.nav.about}</a>
          <a href={routes.contact}>{copy.nav.contact}</a>
          <a href={routes.privacy}>{copy.footer.privacy}</a>
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
