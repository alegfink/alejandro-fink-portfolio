"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { getV2Path, gmailComposeUrl, v2SharedCopy } from "@/lib/v2-i18n";
import { V2LanguageSwitcher } from "@/components/v2/v2-language-switcher";
import { usePageEntrance } from "@/components/v2/use-page-entrance";
import styles from "@/components/v2/portfolio-privacy.module.css";

function BrandMark() {
  return (
    <svg className={styles.brandMark} viewBox="0 0 48 36" aria-hidden="true">
      <path d="M5 32L20.5 4" />
      <path d="M33 21H42" />
      <path d="M21.5 32L34.4 7C35.1 5.6 36.3 4.8 38 4.8H44" />
    </svg>
  );
}

export function PortfolioV2Privacy({ locale }: Readonly<{ locale: Locale }>) {
  const shared = v2SharedCopy[locale];
  const copy = siteCopy[locale].privacy;
  const pageReady = usePageEntrance();

  return (
    <div className={styles.page} data-page-ready={String(pageReady)} lang={locale}>
      <a className={styles.skipLink} href="#privacy-content">{locale === "es" ? "Saltar a la política" : "Skip to the policy"}</a>

      <header className={styles.header}>
        <Link className={`${styles.headerButton} ${styles.brand}`} href={getV2Path(locale, "home")} aria-label={`Alejandro Fink, ${shared.backJourney}`}>
          <BrandMark />
          <span>Alejandro Fink</span>
        </Link>
        <nav className={styles.headerNav} aria-label={shared.mainNav}>
          <Link className={styles.headerButton} href={getV2Path(locale, "projects")}>{shared.projects}</Link>
          <Link className={styles.headerButton} href={getV2Path(locale, "about")}>{shared.about}</Link>
          <V2LanguageSwitcher locale={locale} page="privacy" />
        </nav>
        <a className={`${styles.headerButton} ${styles.contact}`} href={gmailComposeUrl(locale)} target="_blank" rel="noreferrer" aria-label={shared.contactLabel}>
          <span>{shared.contact}</span><i aria-hidden="true">↗</i>
        </a>
      </header>

      <div className={styles.topDiffuser} aria-hidden="true" />

      <main id="privacy-content" className={styles.main}>
        <section className={styles.hero}>
          <p>{locale === "es" ? "Información clara · sin letra chica" : "Clear information · no fine print"}</p>
          <h1>{locale === "es" ? "Privacidad sin letra chica." : "Privacy without fine print."}</h1>
          <div><span>{copy.updated}</span><p>{copy.title}</p></div>
        </section>

        <section className={styles.policy} aria-label={copy.title}>
          {copy.sections.map((section, index) => (
            <article key={section.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{section.title}</h2><p>{section.text}</p></div>
            </article>
          ))}
        </section>

        <section className={styles.closing}>
          <p>{locale === "es" ? "Si algo no está claro" : "If anything is unclear"}</p>
          <h2>{locale === "es" ? "La privacidad también se diseña con contexto." : "Privacy is also designed with context."}</h2>
          <a href={gmailComposeUrl(locale)} target="_blank" rel="noreferrer">{shared.contact}<span aria-hidden="true">↗</span></a>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href={getV2Path(locale, "home")}><BrandMark /><span>{shared.backJourney}</span></Link>
        <p aria-label="Alejandro Fink"><span>Alejandro</span> <span>Fink</span></p>
        <a href="#privacy-content">{shared.backTop} ↑</a>
      </footer>
    </div>
  );
}
