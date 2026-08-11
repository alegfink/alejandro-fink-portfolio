import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutView } from "@/views/about-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "es" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "es") return {};
  const copy = siteCopy.es.about;
  return buildMetadata({ locale: "es", path: "/es/sobre-mi", alternatePath: "/en/about", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "es") notFound(); return <AboutView locale="es" />; }
