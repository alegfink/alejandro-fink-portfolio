import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivacyView } from "@/views/privacy-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "es" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "es") return {};
  const copy = siteCopy.es.privacy;
  return buildMetadata({ locale: "es", path: "/es/privacidad", alternatePath: "/en/privacy", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "es") notFound(); return <PrivacyView locale="es" />; }
