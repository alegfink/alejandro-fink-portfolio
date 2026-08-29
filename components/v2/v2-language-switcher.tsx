"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { getV2Path, v2SharedCopy, type V2Page } from "@/lib/v2-i18n";
import styles from "@/components/v2/v2-language-switcher.module.css";

export function V2LanguageSwitcher({ locale, page }: Readonly<{ locale: Locale; page: V2Page }>) {
  const copy = v2SharedCopy[locale];
  const router = useRouter();

  useEffect(() => {
    try {
      const rememberedLocale = window.localStorage.getItem("af-language");
      if ((rememberedLocale === "es" || rememberedLocale === "en") && rememberedLocale !== locale) {
        router.replace(getV2Path(rememberedLocale, page));
      }
    } catch {
      // The selector still works when storage is unavailable.
    }
  }, [locale, page, router]);

  const remember = (nextLocale: Locale) => {
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
