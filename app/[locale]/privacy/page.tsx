import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrivacyView } from "@/views/privacy-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  const copy = siteCopy.en.privacy;
  return buildMetadata({ locale: "en", path: "/en/privacy", alternatePath: "/es/privacidad", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "en") notFound(); return <PrivacyView locale="en" />; }
