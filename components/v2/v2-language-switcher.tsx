"use client";

import { NativeLink as Link } from "@/components/v2/native-link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { getV2Path, v2SharedCopy, type V2Page } from "@/lib/v2-i18n";
import styles from "@/components/v2/v2-language-switcher.module.css";

export function V2LanguageSwitcher({ locale, page }: Readonly<{ locale: Locale; page: V2Page }>) {
  const copy = v2SharedCopy[locale];

  useEffect(() => {
    try {
      const rememberedLocale = window.localStorage.getItem("af-language");
      if ((rememberedLocale === "es" || rememberedLocale === "en") && rememberedLocale !== locale) {
        window.location.replace(getV2Path(rememberedLocale, page));
      }
    } catch {
      // The selector still works when storage is unavailable.
    }
  }, [locale, page]);

  const remember = (nextLocale: Locale) => {
    if (nextLocale !== locale) {
      trackEvent("language_change", { from: locale, to: nextLocale, path: window.location.pathname });
    }
    try {
      window.localStorage.setItem("af-language", nextLocale);
    } catch {
      // Navigation is independent from browser storage.
    }
  };

  return (
    <div className={styles.switcher} role="group" aria-label={copy.languageLabel}>
      {(["es", "en"] as const).map((option) => (
        <Link
          className={option === locale ? styles.active : undefined}
          href={getV2Path(option, page)}
          hrefLang={option}
          lang={option}
          aria-current={option === locale ? "page" : undefined}
          aria-label={option === locale ? undefined : copy.languageChange}
          onClick={() => remember(option)}
          key={option}
        >
          {option.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
