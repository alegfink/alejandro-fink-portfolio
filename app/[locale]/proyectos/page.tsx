import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkIndexView } from "@/views/work-index-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";

export function generateStaticParams() { return [{ locale: "es" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "es") return {};
  const copy = siteCopy.es.workIndex;
  return buildMetadata({ locale: "es", path: "/es/proyectos", alternatePath: "/en/work", title: copy.metaTitle, description: copy.metaDescription });
}

export default async function ProjectsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  return <WorkIndexView locale="es" />;
}
