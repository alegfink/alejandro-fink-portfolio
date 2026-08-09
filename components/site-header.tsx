import { LanguageSwitcher } from "@/components/language-switcher";
import { TrackedLink } from "@/components/tracked-link";
import { routeNames, type Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <a className="brand" href={routes.home} aria-label={`Alejandro Fink · ${locale === "es" ? "inicio" : "home"}`}>
          <span className="brand__mark" aria-hidden="true">AF</span>
          <span className="brand__name">Alejandro Fink</span>
        </a>
        <nav className="desktop-nav" aria-label={locale === "es" ? "Navegación principal" : "Primary navigation"}>
          <a href={routes.work}>{copy.nav.work}</a>
          <a href={`${routes.home}#servicios`}>{copy.nav.services}</a>
          <a href={routes.about}>{copy.nav.about}</a>
          <TrackedLink className="nav-cta" href={routes.contact} eventName="contact_cta" eventPayload={{ locale, placement: "header" }}>
            {copy.nav.contact}
          </TrackedLink>
          <LanguageSwitcher locale={locale} compact />
        </nav>
        <details className="mobile-nav">
          <summary>{copy.nav.menu}</summary>
          <nav aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}>
            <a href={routes.work}>{copy.nav.work}</a>
            <a href={`${routes.home}#servicios`}>{copy.nav.services}</a>
            <a href={routes.about}>{copy.nav.about}</a>
            <a href={routes.contact}>{copy.nav.contact}</a>
            <LanguageSwitcher locale={locale} />
          </nav>
        </details>
      </div>
    </header>
  );
}
