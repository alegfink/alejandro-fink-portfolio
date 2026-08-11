import { projects } from "@/content/projects";
import { siteCopy } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { ProjectCard } from "@/components/project-card";
import { TrackedLink } from "@/components/tracked-link";

export function WorkIndexView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content" className="work-index-page">
      <section className="page-hero page-hero--work shell">
        <p className="eyebrow">{copy.workIndex.eyebrow}</p>
        <div className="page-hero__work-grid">
          <h1>{copy.workIndex.title}</h1>
          <p>{copy.workIndex.intro}</p>
        </div>
        <div className="page-hero__index-strip" aria-hidden="true"><span>06</span><span>{locale === "es" ? "PROYECTOS SELECCIONADOS" : "SELECTED PROJECTS"}</span></div>
      </section>
      <section className="work-index shell" data-analytics-section="work-list" aria-label={locale === "es" ? "Lista de proyectos" : "Project list"}>
        {projects.map((project) => <ProjectCard key={project.id} project={project} locale={locale} placement="index" featured={project.caseType === "full"} />)}
      </section>
      <section className="index-cta shell" data-analytics-section="work-contact"><h2>{copy.workIndex.closing}</h2><TrackedLink className="button button--primary" href={routeNames[locale].contact} eventName="contact_cta" eventPayload={{ locale, placement: "index" }}>{copy.common.contact}</TrackedLink></section>
    </main>
  );
}
