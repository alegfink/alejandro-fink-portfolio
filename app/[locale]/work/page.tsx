import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkIndexView } from "@/views/work-index-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en") return {};
  const copy = siteCopy.en.workIndex;
  return buildMetadata({ locale: "en", path: "/en/work", alternatePath: "/es/proyectos", title: copy.metaTitle, description: copy.metaDescription });
}

export default async function WorkIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  return <WorkIndexView locale="en" />;
}
