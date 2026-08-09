import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "../globals.css";
import "../portfolio.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollDirector } from "@/components/scroll-director";
import { isLocale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/urls";
import { siteCopy } from "@/content/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: getSiteUrl(),
    applicationName: "Alejandro Fink",
    authors: [{ name: "Alejandro Fink" }],
    creator: "Alejandro Fink",
    formatDetection: { email: false, address: false, telephone: false },
    other: { "color-scheme": "light" },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = siteCopy[locale];
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>
        <ScrollDirector />
        <a className="skip-link" href="#main-content">{copy.skip}</a>
        <SiteHeader locale={locale} />
        {children}
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
