import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/content/projects";
import { ProjectCaseView } from "@/views/project-case-view";
import { buildMetadata } from "@/lib/metadata";
import { projectPath } from "@/lib/urls";

export function generateStaticParams() {
  return projects.map((project) => ({ locale: "en", slug: project.slug.en }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en") return {};
  const project = getProjectBySlug("en", slug);
  if (!project) return {};
  const content = project.content.en;
  return buildMetadata({ locale: "en", path: projectPath("en", project.slug.en), alternatePath: projectPath("es", project.slug.es), title: content.seoTitle, description: content.seoDescription, image: project.media[0].src });
}

export default async function EnglishProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "en") notFound();
  const project = getProjectBySlug("en", slug);
  if (!project) notFound();
  return <ProjectCaseView project={project} locale="en" />;
}
