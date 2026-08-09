"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TrackedLink } from "@/components/tracked-link";
import { routeNames, type Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const updateHeader = () => {
      frame = 0;
      const currentY = window.scrollY;
      const movingDown = currentY > lastY + 8;
      const movingUp = currentY < lastY - 8;

      if (!menuOpen && movingDown && currentY > 180) setHeaderHidden(true);
      if (movingUp || currentY < 80 || menuOpen) setHeaderHidden(false);
      lastY = currentY;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.classList.remove("mobile-nav-open");
      return;
    }

    document.body.classList.add("mobile-nav-open");
    const focusables = Array.from(
      mobileNavRef.current?.querySelectorAll<HTMLElement>('.mobile-nav__trigger, nav a[href]') ?? [],
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("mobile-nav-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${headerHidden ? " site-header--hidden" : ""}${menuOpen ? " site-header--menu-open" : ""}`}>
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
        <div className="mobile-nav" ref={mobileNavRef}>
          <button
            ref={menuButtonRef}
            type="button"
            className="mobile-nav__trigger"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-panel"
            onClick={(event) => {
              setMenuOpen((current) => !current);
              if (menuOpen && event.detail > 0) event.currentTarget.blur();
            }}
          >
            <span>{menuOpen ? (locale === "es" ? "Cerrar menú" : "Close menu") : copy.nav.menu}</span>
            <i aria-hidden="true"><b /><b /></i>
          </button>
          {menuOpen ? (
            <>
              <button className="mobile-nav__backdrop" type="button" aria-label={locale === "es" ? "Cerrar menú" : "Close menu"} onClick={() => setMenuOpen(false)} />
              <nav id="mobile-navigation-panel" aria-label={locale === "es" ? "Navegación móvil" : "Mobile navigation"}>
                <a href={routes.work} onClick={() => setMenuOpen(false)}>{copy.nav.work}</a>
                <a href={`${routes.home}#servicios`} onClick={() => setMenuOpen(false)}>{copy.nav.services}</a>
                <a href={routes.about} onClick={() => setMenuOpen(false)}>{copy.nav.about}</a>
                <a href={routes.contact} onClick={() => setMenuOpen(false)}>{copy.nav.contact}</a>
                <LanguageSwitcher locale={locale} />
              </nav>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
