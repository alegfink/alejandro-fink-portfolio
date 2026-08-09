import Link from "next/link";
import { projects } from "@/content/projects";
import { siteCopy } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { ProjectCard } from "@/components/project-card";

export function WorkIndexView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content">
      <section className="page-hero shell">
        <p className="eyebrow">{copy.workIndex.eyebrow}</p>
        <h1>{copy.workIndex.title}</h1>
        <p>{copy.workIndex.intro}</p>
      </section>
      <section className="work-index shell" aria-label={locale === "es" ? "Lista de proyectos" : "Project list"}>
        {projects.map((project) => <ProjectCard key={project.id} project={project} locale={locale} placement="index" featured={project.caseType === "full"} />)}
      </section>
      <section className="index-cta shell"><h2>{copy.workIndex.closing}</h2><Link prefetch={false} className="button button--primary" href={routeNames[locale].contact}>{copy.common.contact}</Link></section>
    </main>
  );
}
