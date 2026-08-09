import Link from "next/link";
import Image from "next/image";
import { projects } from "@/content/projects";
import { siteCopy } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { projectPath } from "@/lib/urls";
import { ProjectCard } from "@/components/project-card";
import { TrackedLink } from "@/components/tracked-link";

export function HomeView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];
  const featured = projects.slice(0, 3);
  const more = projects.slice(3);

  return (
    <main id="main-content">
      <section className="hero shell">
        <div className="hero__copy">
          <div className="hero__title-block">
            <p className="eyebrow">{copy.home.eyebrow}</p>
            <h1>{copy.home.title}</h1>
          </div>
          <div className="hero__aside">
            <p className="hero__intro">{copy.home.intro}</p>
            <div className="button-row">
              <TrackedLink className="button button--primary" href={routes.contact} eventName="contact_cta" eventPayload={{ locale, placement: "hero" }}>{copy.home.primaryCta}</TrackedLink>
              <Link className="button button--secondary" href="#proyectos">{copy.home.secondaryCta}</Link>
            </div>
            <p className="hero__signal"><span aria-hidden="true">↳</span>{copy.home.signal}</p>
          </div>
        </div>
        <div className="hero-showcase" aria-label={locale === "es" ? "Vista de proyectos seleccionados" : "Selected project preview"}>
          <TrackedLink className="hero-showcase__project hero-showcase__project--main" href={projectPath(locale, projects[0].slug[locale])} eventName="project_open" eventPayload={{ projectId: projects[0].id, locale, placement: "home" }}>
            <span className="hero-showcase__media">
              <Image src="/media/projects/torvena/cover-desktop.png" alt={projects[0].media[0].alt[locale]} fill priority sizes="(max-width: 760px) 100vw, 70vw" />
            </span>
            <span className="hero-showcase__meta"><span>01 / 06</span><strong>{projects[0].content[locale].title}</strong><span>{projects[0].content[locale].statusLabel}</span></span>
          </TrackedLink>
          <div className="hero-showcase__stack">
            {[projects[1], projects[2]].map((project) => (
              <TrackedLink key={project.id} className={`hero-showcase__project hero-showcase__project--${project.id}`} href={projectPath(locale, project.slug[locale])} eventName="project_open" eventPayload={{ projectId: project.id, locale, placement: "home" }}>
                <span className="hero-showcase__media">
                  <Image src={project.id === "cuidalo" ? "/media/projects/cuidalo/cover-mobile.png" : project.media[0].src} alt={project.media[0].alt[locale]} fill sizes="(max-width: 760px) 50vw, 27vw" />
                </span>
                <span className="hero-showcase__meta"><span>{String(project.order).padStart(2, "0")} / 06</span><strong>{project.content[locale].title}</strong></span>
              </TrackedLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell" id="proyectos" aria-labelledby="featured-title">
        <div className="section-heading section-heading--split">
          <div><p className="eyebrow">{copy.home.featuredEyebrow}</p><h2 id="featured-title">{copy.home.featuredTitle}</h2></div>
          <p>{copy.home.featuredIntro}</p>
        </div>
        <div className="featured-projects">
          {featured.map((project) => <ProjectCard key={project.id} project={project} locale={locale} placement="home" featured />)}
        </div>
        <div className="section-action"><Link className="text-link text-link--large" href={routes.work}>{copy.common.viewAll}<span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="section section--ink" id="servicios" aria-labelledby="services-title">
        <div className="shell">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow">{copy.home.servicesEyebrow}</p><h2 id="services-title">{copy.home.servicesTitle}</h2></div>
            <p>{locale === "es" ? "No vendo una lista de tecnologías. Diseño la combinación necesaria para que una experiencia informe, venda, valide o destrabe una operación." : "I do not sell a technology list. I design the combination needed for an experience to inform, sell, validate or unlock an operation."}</p>
          </div>
          <ol className="services-list">
            {copy.services.map((service) => <li key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section shell" aria-labelledby="process-title">
        <div className="section-heading section-heading--split">
          <div><p className="eyebrow">{copy.home.processEyebrow}</p><h2 id="process-title">{copy.home.processTitle}</h2></div>
          <p className="process-note">{copy.home.processNote}</p>
        </div>
        <ol className="process-grid">
          {copy.process.map((step) => <li key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
        </ol>
      </section>

      <section className="section more-work" aria-labelledby="more-title">
        <div className="shell">
          <div className="section-heading"><p className="eyebrow">{copy.home.moreEyebrow}</p><h2 id="more-title">{copy.home.moreTitle}</h2></div>
          <div className="more-work__list">
            {more.map((project) => {
              const content = project.content[locale];
              return (
                <article key={project.id} className="compact-project" style={{ "--project-accent": project.accent } as React.CSSProperties}>
                  <span className="compact-project__number">{String(project.order).padStart(2, "0")}</span>
                  <div><p>{content.category}</p><h3>{content.title}</h3><span>{content.statusLabel}</span></div>
                  <p>{content.summary}</p>
                  <TrackedLink className="round-link" href={projectPath(locale, project.slug[locale])} eventName="project_open" eventPayload={{ projectId: project.id, locale, placement: "home" }} aria-label={`${copy.common.viewProject}: ${content.title}`}>↗</TrackedLink>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section shell perspective" aria-labelledby="perspective-title">
        <div className="perspective__index" aria-hidden="true">AF / 26</div>
        <div><p className="eyebrow">{copy.home.perspectiveEyebrow}</p><h2 id="perspective-title">{copy.home.perspectiveTitle}</h2><p>{copy.home.perspectiveText}</p><Link className="text-link" href={routes.about}>{copy.nav.about}<span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="closing-cta">
        <div className="shell"><p className="eyebrow">{locale === "es" ? "Una conversación útil" : "A useful conversation"}</p><h2>{copy.home.closingTitle}</h2><p>{copy.home.closingText}</p><TrackedLink className="button button--light" href={routes.contact} eventName="contact_cta" eventPayload={{ locale, placement: "footer" }}>{copy.common.contact}<span aria-hidden="true">↗</span></TrackedLink></div>
      </section>
    </main>
  );
}
