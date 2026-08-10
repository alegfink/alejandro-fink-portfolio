import type { Locale } from "@/lib/i18n";
import { projectPath } from "@/lib/urls";
import { projects, type Project } from "@/content/projects";
import { siteCopy } from "@/content/site";
import { ProjectVisual } from "@/components/project-visual";
import { TrackedLink } from "@/components/tracked-link";
import { CaseStudyAnalytics } from "@/components/analytics-page-marker";

export function ProjectCaseView({ project, locale }: { project: Project; locale: Locale }) {
  const copy = siteCopy[locale];
  const content = project.content[locale];
  const currentIndex = projects.findIndex((candidate) => candidate.id === project.id);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const nextContent = nextProject.content[locale];

  return (
    <main id="main-content" className={`case-page case-page--${project.caseType}`} style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <CaseStudyAnalytics projectId={project.id} locale={locale} caseType={project.caseType} />
      <header className="case-hero shell" data-project-number={String(project.order).padStart(2, "0")} data-reveal>
        <div className="case-hero__topline"><span>{String(project.order).padStart(2, "0")} / 06</span><span>{content.category}</span><span>{project.year}</span></div>
        <p className="status-pill"><span aria-hidden="true" />{content.statusLabel}</p>
        <h1>{content.title}</h1>
        <p className="case-hero__summary">{content.summary}</p>
        <div className="case-hero__actions">
          <TrackedLink className="button button--primary" href={project.publicUrl} target="_blank" rel="noreferrer" eventName="external_link" eventPayload={{ locale, destinationDomain: new URL(project.publicUrl).hostname.replace(/^www\./, ""), context: "project" }}>{copy.common.visit}<span aria-hidden="true">↗</span></TrackedLink>
          <a className="text-link" href={locale === "es" ? "/es/proyectos" : "/en/work"}>{locale === "es" ? "Volver al índice" : "Back to work"}</a>
        </div>
      </header>

      <section className="case-lead-visual shell-wide" data-reveal>
        <ProjectVisual media={project.media[0]} locale={locale} priority className={`project-visual--${project.id}`} />
      </section>

      <section className="case-overview shell section" data-reveal data-analytics-section="case-overview" aria-label={locale === "es" ? "Resumen del caso" : "Case overview"}>
        <article><p className="eyebrow">{copy.common.problem}</p><h2>{locale === "es" ? "Contexto antes que interfaz." : "Context before interface."}</h2><p>{content.problem}</p></article>
        <article><p className="eyebrow">{copy.common.solution}</p><h2>{locale === "es" ? "La respuesta construida." : "The response I built."}</h2><p>{content.solution}</p></article>
        <aside className="case-facts">
          <div><span>{copy.common.state}</span><strong>{content.statusLabel}</strong></div>
          <div><span>{copy.common.role}</span><p>{content.role}</p></div>
          <div><span>{copy.common.stack}</span><ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
        </aside>
      </section>

      <section className="section section--soft" data-reveal data-analytics-section="case-decisions" aria-labelledby="decisions-title">
        <div className="shell">
          <div className="section-heading section-heading--split"><div><p className="eyebrow">{copy.common.decisions}</p><h2 id="decisions-title">{locale === "es" ? "Decisiones que explican la solución." : "Decisions that explain the solution."}</h2></div><p>{locale === "es" ? "No son resultados atribuidos: son elecciones verificables del proceso y la implementación." : "These are not attributed outcomes; they are verifiable choices in the process and implementation."}</p></div>
          <ol className="decision-grid">{content.decisions.map((decision, index) => <li key={decision.title}><span>0{index + 1}</span><h3>{decision.title}</h3><p>{decision.text}</p></li>)}</ol>
        </div>
      </section>

      {project.media.length > 1 ? (
        <section className="case-gallery shell-wide section" data-reveal data-analytics-section="case-evidence" aria-labelledby="evidence-title">
          <div className="section-heading shell"><p className="eyebrow">{copy.common.evidence}</p><h2 id="evidence-title">{locale === "es" ? "Pantallas y material autorizado." : "Screens and authorized material."}</h2></div>
          <div className="case-gallery__grid">{project.media.slice(1).map((media) => <ProjectVisual key={media.src} media={media} locale={locale} />)}</div>
        </section>
      ) : null}

      <section className="case-scope section shell" data-reveal data-analytics-section="case-scope">
        <article><p className="eyebrow">{locale === "es" ? "Alcance verificable" : "Verified scope"}</p><h2>{locale === "es" ? "Qué existe en esta versión." : "What exists in this version."}</h2><ul className="check-list">{content.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></article>
        <article className="limits-panel"><p className="eyebrow">{copy.common.limits}</p><h2>{locale === "es" ? "Lo que no presento como terminado." : "What I do not present as finished."}</h2><ul>{content.limits.map((limit) => <li key={limit}>{limit}</li>)}</ul></article>
      </section>

      <section className="case-outcomes section shell" data-reveal data-analytics-section="case-outcomes" aria-labelledby="outcome-title">
        <p className="eyebrow">{copy.common.outcomes}</p>
        <h2 id="outcome-title">{project.caseType === "full" ? (locale === "es" ? "Evidencia, sin inflar el resultado." : "Evidence, without inflating the outcome.") : (locale === "es" ? "Estado actual, sin reescribirlo como éxito final." : "Current state, without rewriting it as a final success.")}</h2>
        <ul>{content.outcomes.map((outcome, index) => <li key={outcome}><span>0{index + 1}</span><p>{outcome}</p></li>)}</ul>
      </section>

      <section className="case-next" data-reveal>
        <div className="shell"><p className="eyebrow">{copy.common.next} · {String(nextProject.order).padStart(2, "0")}</p><a href={projectPath(locale, nextProject.slug[locale])}><span>{nextContent.category}</span><strong>{nextContent.title}</strong><span aria-hidden="true">↗</span></a><p>{nextContent.statusLabel}</p></div>
      </section>

      <section className="closing-cta closing-cta--case" data-analytics-section="case-contact">
        <div className="shell"><p className="eyebrow">{locale === "es" ? "¿Un problema parecido?" : "A similar problem?"}</p><h2>{locale === "es" ? "Conversemos sobre el contexto antes de elegir la solución." : "Let’s discuss the context before choosing the solution."}</h2><TrackedLink className="button button--light" href={locale === "es" ? "/es/contacto" : "/en/contact"} eventName="contact_cta" eventPayload={{ locale, placement: "case" }}>{copy.common.contact}<span aria-hidden="true">↗</span></TrackedLink></div>
      </section>
    </main>
  );
}
