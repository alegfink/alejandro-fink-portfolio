import Image from "next/image";
import { projects } from "@/content/projects";
import { siteCopy } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { projectPath } from "@/lib/urls";
import { TrackedLink } from "@/components/tracked-link";

const liveVisuals: Record<string, { desktop: string; mobile: string }> = {
  torvena: { desktop: "/media/projects/torvena/live-desktop.png", mobile: "/media/projects/torvena/live-mobile.png" },
  "brisa-do-mar": { desktop: "/media/projects/brisa-do-mar/live-desktop.png", mobile: "/media/projects/brisa-do-mar/live-mobile.png" },
  cuidalo: { desktop: "/media/projects/cuidalo/live-desktop.png", mobile: "/media/projects/cuidalo/live-mobile.png" },
  "salto-cuantico": { desktop: "/media/projects/salto-cuantico/live-desktop.png", mobile: "/media/projects/salto-cuantico/live-mobile.png" },
  "luca-ds": { desktop: "/media/projects/luca-ds/live-desktop.png", mobile: "/media/projects/luca-ds/live-mobile.png" },
  "lourdes-mirada": { desktop: "/media/projects/lourdes-mirada/live-desktop.png", mobile: "/media/projects/lourdes-mirada/live-mobile.png" },
};

export function HomeView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  const routes = routeNames[locale];
  const heroLines = locale === "es"
    ? ["Diseño y desarrollo", "sitios web y productos", "digitales que resuelven", "problemas reales de negocio."]
    : ["I design and build", "websites and digital products", "that solve real", "business problems."];

  return (
    <main id="main-content" className="motion-home">
      <section className="motion-hero" data-scroll-hero>
        <div className="motion-hero__sticky">
          <div className="motion-grid" aria-hidden="true" />
          <div className="motion-hero__content shell">
            <div className="motion-hero__copy">
              <p className="eyebrow">{copy.home.eyebrow}</p>
              <h1>
                {heroLines.map((line, index) => (
                  <span key={line} className={`${index === 1 ? "motion-hero__serif " : ""}${index === heroLines.length - 1 ? "motion-hero__line--long" : ""}`.trim()}>{line}</span>
                ))}
              </h1>
              <div className="motion-hero__footer">
                <p>{copy.home.intro}</p>
                <div className="button-row">
                  <TrackedLink className="button button--primary" href={routes.contact} eventName="contact_cta" eventPayload={{ locale, placement: "hero" }}>{copy.home.primaryCta}</TrackedLink>
                  <a className="button button--secondary" href="#proyectos">{copy.home.secondaryCta}</a>
                </div>
              </div>
            </div>

            <div className="motion-hero__scene" aria-hidden="true">
              <div className="scene-window scene-window--back">
                <span>02 / 06 · BRISA DO MAR</span>
                <Image src={liveVisuals["brisa-do-mar"].desktop} alt="" fill priority sizes="40vw" />
              </div>
              <div className="scene-window scene-window--main">
                <span>01 / 06 · TORVENA</span>
                <Image src={liveVisuals.torvena.desktop} alt="" fill priority sizes="55vw" />
              </div>
              <div className="scene-phone">
                <Image src={liveVisuals.cuidalo.mobile} alt="" fill priority sizes="18vw" />
              </div>
              <div className="scene-orbit scene-orbit--one" />
              <div className="scene-orbit scene-orbit--two" />
            </div>
          </div>

          <div className="motion-hero__ticker" aria-hidden="true">
            <span>BUSINESS × UX × PRODUCT × CODE × BUSINESS × UX × PRODUCT × CODE ×</span>
          </div>
          <div className="motion-hero__progress" aria-hidden="true"><span>SCROLL</span><i /></div>
        </div>
      </section>

      <section className="story-intro shell" data-reveal>
        <p className="eyebrow">{locale === "es" ? "Archivo de trabajo · 06 proyectos" : "Work archive · 06 projects"}</p>
        <div>
          <h2>{locale === "es" ? "Cada proyecto revela una forma distinta de convertir contexto en experiencia." : "Every project reveals a different way to turn context into experience."}</h2>
          <p>{locale === "es" ? "Desplazate para recorrerlos. Cada caso declara qué existe, qué fue una decisión y qué todavía es un límite." : "Scroll to explore them. Every case states what exists, what was a decision and what remains a limit."}</p>
        </div>
      </section>

      <section className="project-story" id="proyectos" data-project-story style={{ "--project-count": projects.length } as React.CSSProperties} aria-label={locale === "es" ? "Recorrido por seis proyectos" : "Six-project journey"}>
        <div className="project-story__sticky">
          <div className="project-story__chrome shell-wide">
            <div className="project-story__topline" aria-hidden="true">
              <span>{locale === "es" ? "Trabajo seleccionado" : "Selected work"}</span>
              <i><b /></i>
              <span>01—06</span>
            </div>

            <div className="project-story__canvas">
              {projects.map((project, index) => {
                const content = project.content[locale];
                const visual = liveVisuals[project.id];
                return (
                  <article
                    key={project.id}
                    className={`project-slide project-slide--${project.id}`}
                    data-story-slide
                    data-state={index === 0 ? "active" : "after"}
                    aria-hidden={index === 0 ? "false" : "true"}
                    style={{ "--project-accent": project.accent, "--slide-index": index } as React.CSSProperties}
                  >
                    <div className="project-slide__visual">
                      <div className="project-slide__browser">
                        <div className="project-slide__browserbar"><span /><span /><span /><i>{project.publicUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</i></div>
                        <div className="project-slide__image">
                          <Image className="project-slide__desktop" src={visual.desktop} alt={project.media[0].alt[locale]} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 58vw" />
                          <Image className="project-slide__mobile" src={visual.mobile} alt="" fill priority={index === 0} sizes="(max-width: 760px) 100vw, 1px" />
                        </div>
                      </div>
                      <div className="project-slide__number" aria-hidden="true">{String(project.order).padStart(2, "0")}</div>
                    </div>

                    <div className="project-slide__copy">
                      <div className="project-slide__meta"><span>{content.category}</span><span>{project.year}</span></div>
                      <h3>{content.title}</h3>
                      <p className="project-slide__status"><span aria-hidden="true" />{content.statusLabel}</p>
                      <p>{content.summary}</p>
                      <TrackedLink
                        className="project-slide__link"
                        href={projectPath(locale, project.slug[locale])}
                        tabIndex={index === 0 ? 0 : -1}
                        eventName="project_open"
                        eventPayload={{ projectId: project.id, locale, placement: "home" }}
                      >
                        <span>{copy.common.viewProject}</span><b aria-hidden="true">↗</b>
                      </TrackedLink>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="project-story__markers" aria-hidden="true">
              {projects.map((project, index) => <span key={project.id} data-story-marker data-state={index === 0 ? "active" : "idle"}>{String(index + 1).padStart(2, "0")}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="capability-story" id="servicios" data-horizontal-story>
        <div className="capability-story__sticky">
          <div className="shell capability-story__heading">
            <p className="eyebrow">{copy.home.servicesEyebrow}</p>
            <h2>{copy.home.servicesTitle}</h2>
          </div>
          <ol className="capability-rail" data-capability-rail>
            {copy.services.map((service, index) => (
              <li key={service.number} style={{ "--service-index": index } as React.CSSProperties}>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <i aria-hidden="true">AF / BUILD</i>
              </li>
            ))}
          </ol>
          <p className="capability-story__hint shell" aria-hidden="true">{locale === "es" ? "DESPLAZAR PARA CONECTAR CAPACIDADES" : "SCROLL TO CONNECT CAPABILITIES"}</p>
        </div>
      </section>

      <section className="process-story shell" aria-labelledby="process-title">
        <div className="process-story__heading" data-reveal>
          <p className="eyebrow">{copy.home.processEyebrow}</p>
          <h2 id="process-title">{copy.home.processTitle}</h2>
          <p>{copy.home.processNote}</p>
        </div>
        <ol className="process-story__steps">
          {copy.process.map((step, index) => (
            <li key={step.number} data-reveal style={{ "--step-index": index } as React.CSSProperties}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="manifesto-story" data-scroll-manifesto>
        <div className="manifesto-story__sticky">
          <div className="manifesto-story__words" aria-hidden="true">
            <span>BUSINESS</span><span>EXPERIENCE</span><span>EXECUTION</span>
          </div>
          <div className="manifesto-story__card shell">
            <p className="eyebrow">{copy.home.perspectiveEyebrow}</p>
            <h2>{copy.home.perspectiveTitle}</h2>
            <p>{copy.home.perspectiveText}</p>
            <a className="text-link" href={routes.about}>{copy.nav.about}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="closing-cta closing-cta--motion" data-reveal>
        <div className="shell">
          <p className="eyebrow">{locale === "es" ? "Una conversación útil" : "A useful conversation"}</p>
          <h2>{copy.home.closingTitle}</h2>
          <p>{copy.home.closingText}</p>
          <TrackedLink className="button button--light" href={routes.contact} eventName="contact_cta" eventPayload={{ locale, placement: "footer" }}>{copy.common.contact}<span aria-hidden="true">↗</span></TrackedLink>
        </div>
      </section>
    </main>
  );
}
