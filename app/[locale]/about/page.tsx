import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutView } from "@/views/about-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  const copy = siteCopy.en.about;
  return buildMetadata({ locale: "en", path: "/en/about", alternatePath: "/es/sobre-mi", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "en") notFound(); return <AboutView locale="en" />; }
