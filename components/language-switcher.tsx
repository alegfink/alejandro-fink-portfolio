"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { switchLocalePath, type Locale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

export function LanguageSwitcher({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const pathname = usePathname();
  const target: Locale = locale === "es" ? "en" : "es";
  const href = switchLocalePath(pathname, target);
  const label = locale === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish";

  return (
    <div className={`language-switcher${compact ? " language-switcher--compact" : ""}`} aria-label={locale === "es" ? "Selector de idioma" : "Language selector"}>
      <span aria-current={locale === "es" ? "page" : undefined}>ES</span>
      <span aria-hidden="true">/</span>
      <span aria-current={locale === "en" ? "page" : undefined}>EN</span>
      <Link
        prefetch={false}
        className="language-switcher__hit"
        href={href}
        aria-label={label}
        onClick={() => {
          window.localStorage.setItem("af-language", target);
          document.cookie = `af-language=${target}; Path=/; Max-Age=31536000; SameSite=Lax`;
          trackEvent("language_change", { from: locale, to: target, path: pathname });
        }}
      >
        <span className="sr-only">{label}</span>
      </Link>
    </div>
  );
}
