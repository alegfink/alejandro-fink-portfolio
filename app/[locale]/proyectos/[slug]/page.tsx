import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/content/projects";
import { ProjectCaseView } from "@/views/project-case-view";
import { buildMetadata } from "@/lib/metadata";
import { projectPath } from "@/lib/urls";

export function generateStaticParams() {
  return projects.map((project) => ({ locale: "es", slug: project.slug.es }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "es") return {};
  const project = getProjectBySlug("es", slug);
  if (!project) return {};
  const content = project.content.es;
  return buildMetadata({ locale: "es", path: projectPath("es", project.slug.es), alternatePath: projectPath("en", project.slug.en), title: content.seoTitle, description: content.seoDescription, image: project.media[0].src });
}

export default async function SpanishProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "es") notFound();
  const project = getProjectBySlug("es", slug);
  if (!project) notFound();
  return <ProjectCaseView project={project} locale="es" />;
}
