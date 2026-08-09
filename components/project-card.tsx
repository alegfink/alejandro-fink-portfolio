import type { Project } from "@/content/projects";
import type { Locale } from "@/lib/i18n";
import { projectPath } from "@/lib/urls";
import { siteCopy } from "@/content/site";
import { TrackedLink } from "@/components/tracked-link";
import { ProjectVisual } from "@/components/project-visual";

export function ProjectCard({ project, locale, placement, featured = false }: { project: Project; locale: Locale; placement: "home" | "index"; featured?: boolean }) {
  const content = project.content[locale];
  return (
    <article data-reveal className={`project-card project-card--${project.id}${featured ? " project-card--featured" : ""}`} style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <ProjectVisual media={project.media[0]} locale={locale} priority={project.order === 1 && placement === "home"} />
      <div className="project-card__body">
        <div className="project-card__meta"><span>{String(project.order).padStart(2, "0")}</span><span>{content.category}</span><span>{project.year}</span></div>
        <h3>{content.title}</h3>
        <p className="project-card__status">{content.statusLabel}</p>
        <p>{content.summary}</p>
        <TrackedLink
          className="text-link"
          href={projectPath(locale, project.slug[locale])}
          eventName="project_open"
          eventPayload={{ projectId: project.id, locale, placement }}
        >
          {siteCopy[locale].common.viewProject}<span aria-hidden="true">↗</span>
        </TrackedLink>
      </div>
    </article>
  );
}
