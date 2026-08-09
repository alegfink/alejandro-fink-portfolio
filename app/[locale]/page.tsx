import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/views/home-view";
import { isLocale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "es" }, { locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = siteCopy[locale].home;
  return buildMetadata({ locale, path: `/${locale}`, alternatePath: locale === "es" ? "/en" : "/es", title: copy.metaTitle, description: copy.metaDescription });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeView locale={locale} />;
}
