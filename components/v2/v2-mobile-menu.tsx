"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import { getV2Path, gmailComposeUrl, v2SharedCopy, type V2Page } from "@/lib/v2-i18n";
import styles from "@/components/v2/v2-mobile-menu.module.css";

const menuCopy = {
  es: {
    menu: "Menú",
    close: "Cerrar menú",
    eyebrow: "Navegación",
    title: "¿Hacia dónde seguimos?",
    language: "Idioma",
    contact: "Hablemos de lo que sigue",
  },
  en: {
    menu: "Menu",
    close: "Close menu",
    eyebrow: "Navigation",
    title: "Where do we go next?",
    language: "Language",
    contact: "Let’s talk about what comes next",
  },
} as const;

const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
const subscribeToClient = () => () => undefined;

function MenuMark() {
  return (
    <svg className={styles.mark} viewBox="0 0 48 36" aria-hidden="true">
      <path d="M5 32L20.5 4" />
      <path d="M33 21H42" />
      <path d="M21.5 32L34.4 7C35.1 5.6 36.3 4.8 38 4.8H44" />
    </svg>
  );
}

export function V2MobileMenu({ locale, page }: Readonly<{ locale: Locale; page: V2Page }>) {
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const shared = v2SharedCopy[locale];
  const copy = menuCopy[locale];

  useEffect(() => {
    const query = window.matchMedia("(max-width: 760px)");
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setIsOpen(false);
    };
    query.addEventListener("change", handleViewportChange);
    return () => query.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) triggerRef.current?.focus();
      return;
    }

    wasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

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
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const rememberLocale = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem("af-language", nextLocale);
    } catch {
      // Navigation does not depend on storage being available.
    }
    setIsOpen(false);
  };

  const menu = (
    <div className={styles.portal} data-open={String(isOpen)} aria-hidden={!isOpen}>
      <div className={styles.backdrop} aria-hidden="true" onClick={() => setIsOpen(false)} />
      <div
        className={styles.sheet}
        id="v2-mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label={shared.mainNav}
        ref={panelRef}
      >
        <div className={styles.texture} aria-hidden="true" />

        <header className={styles.panelHeader}>
          <Link
            className={styles.panelBrand}
            href={getV2Path(locale, "home")}
            aria-label={`Alejandro Fink, ${shared.home}`}
            aria-current={page === "home" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            <MenuMark />
            <span>Alejandro Fink</span>
          </Link>
          <button className={styles.closeButton} type="button" onClick={() => setIsOpen(false)} aria-label={copy.close}>
            <i aria-hidden="true" /><i aria-hidden="true" />
          </button>
        </header>

        <div className={styles.panelIntro}>
          <p><span>AF</span>{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>

        <nav className={styles.panelNav} aria-label={shared.mainNav}>
          <Link
            href={getV2Path(locale, "projects")}
            aria-current={page === "projects" ? "page" : undefined}
            data-active={String(page === "projects")}
            onClick={() => setIsOpen(false)}
          >
            <span>01</span><strong>{shared.projects}</strong><i aria-hidden="true">↗</i>
          </Link>
          <Link
            href={getV2Path(locale, "about")}
            aria-current={page === "about" ? "page" : undefined}
            data-active={String(page === "about")}
            onClick={() => setIsOpen(false)}
          >
            <span>02</span><strong>{shared.about}</strong><i aria-hidden="true">↗</i>
          </Link>
        </nav>

        <div className={styles.panelUtility}>
          <div className={styles.language} role="group" aria-label={shared.languageLabel}>
            <span>{copy.language}</span>
            <div>
              {(["es", "en"] as const).map((option) => (
                <Link
                  href={getV2Path(option, page)}
                  hrefLang={option}
                  lang={option}
                  aria-current={option === locale ? "page" : undefined}
                  data-active={String(option === locale)}
                  onClick={() => rememberLocale(option)}
                  key={option}
                >
                  {option.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          <Link
            className={styles.privacy}
            href={getV2Path(locale, "privacy")}
            aria-current={page === "privacy" ? "page" : undefined}
            onClick={() => setIsOpen(false)}
          >
            {shared.privacy}
          </Link>
        </div>

        <a className={styles.contact} href={gmailComposeUrl(locale)} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)}>
          <span>{copy.contact}</span><i aria-hidden="true">↗</i>
        </a>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <button
        className={styles.trigger}
        type="button"
        aria-expanded={isOpen}
        aria-controls="v2-mobile-navigation"
        aria-haspopup="dialog"
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
        data-mobile-menu-trigger
      >
        <span>{copy.menu}</span>
        <i className={styles.triggerIcon} aria-hidden="true"><b /><b /></i>
      </button>
      {isMounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
