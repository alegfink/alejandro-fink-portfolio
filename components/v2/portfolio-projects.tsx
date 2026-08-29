"use client";

import Image from "next/image";
import { NativeLink as Link } from "@/components/v2/native-link";
import { useEffect, useState, type CSSProperties } from "react";
import { projects, type Project } from "@/content/projects";
import styles from "@/components/v2/portfolio-projects.module.css";
import { usePageEntrance } from "@/components/v2/use-page-entrance";
import { LourdesHeroPreview } from "@/components/v2/lourdes-hero-preview";
import { V2LanguageSwitcher } from "@/components/v2/v2-language-switcher";
import { V2MobileMenu } from "@/components/v2/v2-mobile-menu";
import { V2TrackedContactLink } from "@/components/v2/v2-tracked-contact-link";
import { domainFromUrl, trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";
import { getV2Path, gmailComposeUrl, v2PrivacyRoutes, v2SharedCopy } from "@/lib/v2-i18n";

type ProjectAsset = {
  src: string;
  alt: string;
  label: string;
  layout: "hero" | "landscape" | "portrait" | "square";
  video?: boolean;
  poster?: string;
  position?: string;
};

const servicesByProject: Record<string, string[]> = {
  torvena: ["Estrategia de e-commerce", "Identidad y oferta", "UX & storefront", "Operación & medición"],
  "brisa-do-mar": ["Descubrimiento", "Arquitectura UX", "Copy multilingüe", "Frontend & panel"],
  cuidalo: ["Research de mercado", "Marca y posicionamiento", "UX de conversión", "MVP & medición"],
  "salto-cuantico": ["Auditoría de funnel", "Estrategia de producto", "UX & contenido", "Prototipo funcional"],
  "luca-ds": ["Estrategia comercial", "Dirección visual", "Copy & UX", "Frontend asistido"],
  "lourdes-mirada": ["Curaduría editorial", "Identidad aplicada", "UX narrativa", "Desarrollo web"],
};

const servicesByProjectEn: Record<string, string[]> = {
  torvena: ["E-commerce strategy", "Identity & offer", "UX & storefront", "Operations & measurement"],
  "brisa-do-mar": ["Discovery", "UX architecture", "Multilingual copy", "Frontend & dashboard"],
  cuidalo: ["Market research", "Brand & positioning", "Conversion UX", "MVP & measurement"],
  "salto-cuantico": ["Funnel audit", "Product strategy", "UX & content", "Functional prototype"],
  "luca-ds": ["Commercial strategy", "Art direction", "Copy & UX", "AI-assisted frontend"],
  "lourdes-mirada": ["Editorial curation", "Applied identity", "Narrative UX", "Web development"],
};

const assetsByProject: Record<string, ProjectAsset[]> = {
  torvena: [
    {
      src: "/media/projects/torvena/page-preview.mp4",
      poster: "/media/projects/torvena/live-desktop.png",
      alt: "Recorrido de la tienda Torvena en funcionamiento",
      label: "Storefront en movimiento",
      layout: "hero",
      video: true,
    },
    {
      src: "/media/projects/torvena/context-luo.png",
      alt: "Producto tecnológico del catálogo de Torvena",
      label: "Producto & contexto",
      layout: "landscape",
    },
    {
      src: "/media/projects/torvena/live-mobile.png",
      alt: "Tienda Torvena en su versión mobile",
      label: "Experiencia mobile",
      layout: "portrait",
      position: "top",
    },
  ],
  "brisa-do-mar": [
    {
      src: "/media/projects/brisa-do-mar/context-playa.webp",
      alt: "Paisaje de playa que contextualiza la propuesta turística de Brisa do Mar",
      label: "El destino como punto de partida",
      layout: "hero",
    },
    {
      src: "/media/projects/brisa-do-mar/live-desktop.png",
      alt: "Landing multilingüe de Brisa do Mar en desktop",
      label: "Comparación & recomendación",
      layout: "landscape",
      position: "top",
    },
    {
      src: "/media/projects/brisa-do-mar/live-mobile.png",
      alt: "Landing multilingüe de Brisa do Mar en mobile",
      label: "Consulta desde el teléfono",
      layout: "portrait",
      position: "top",
    },
  ],
  cuidalo: [
    {
      src: "/media/projects/cuidalo/uso-llaves.webp",
      alt: "Localizador CUIDALO junto a unas llaves",
      label: "El producto en una situación cotidiana",
      layout: "square",
    },
    {
      src: "/media/projects/cuidalo/live-desktop.png",
      alt: "MVP de CUIDALO en desktop",
      label: "MVP medible",
      layout: "hero",
      position: "top",
    },
    {
      src: "/media/projects/cuidalo/uso-equipaje.webp",
      alt: "Localizador CUIDALO aplicado a equipaje",
      label: "Casos de uso antes que promesas",
      layout: "square",
    },
  ],
  "salto-cuantico": [
    {
      src: "/media/projects/salto-cuantico/cover-desktop.png",
      alt: "Dirección visual de la propuesta Salto Cuántico",
      label: "Dirección de la propuesta",
      layout: "hero",
      position: "top",
    },
    {
      src: "/media/projects/salto-cuantico/live-desktop.png",
      alt: "Prototipo de Salto Cuántico en desktop",
      label: "Un recorrido antes del formulario",
      layout: "landscape",
      position: "top",
    },
    {
      src: "/media/projects/salto-cuantico/live-mobile.png",
      alt: "Prototipo de Salto Cuántico en mobile",
      label: "Narrativa adaptable",
      layout: "portrait",
      position: "top",
    },
  ],
  "luca-ds": [
    {
      src: "/media/projects/luca-ds/hero-transition.mp4",
      poster: "/media/projects/luca-ds/hero-first-frame.png",
      alt: "Apertura cinemática del hero de Luca DS",
      label: "El hero como primera declaración",
      layout: "hero",
      video: true,
    },
    {
      src: "/media/projects/luca-ds/entrenamiento-disciplina.webp",
      alt: "Luca entrenando con una barra en un gimnasio oscuro",
      label: "La disciplina como punto de partida",
      layout: "landscape",
      position: "center 36%",
    },
    {
      src: "/media/projects/luca-ds/caso-real.jpg",
      alt: "Caso real presentado por Luca DS a través de entrenamiento sostenido",
      label: "El método respaldado por una historia real",
      layout: "portrait",
      position: "center 34%",
    },
    {
      src: "/media/projects/luca-ds/luca-entrenando.jpg",
      alt: "Luca entrenando en una pieza vertical de la landing",
      label: "Entrenamiento antes que promesa",
      layout: "portrait",
      position: "center",
    },
  ],
  "lourdes-mirada": [
    {
      src: "/media/projects/lourdes-mirada/work-04.jpg",
      alt: "Retrato editorial del archivo de Lourdes",
      label: "El archivo como materia prima",
      layout: "portrait",
      position: "center 38%",
    },
    {
      src: "/media/projects/lourdes-mirada/live-desktop.png",
      alt: "Portfolio Lourdes Mirada en desktop",
      label: "Portfolio & manifiesto",
      layout: "hero",
      position: "top",
    },
    {
      src: "/media/projects/lourdes-mirada/work-08.jpg",
      alt: "Fotografía lifestyle del archivo real de Lourdes",
      label: "Ritmo, pausa y curaduría",
      layout: "landscape",
      position: "center",
    },
  ],
};

const projectAssetEnglish: Record<string, { alt: string; label: string }> = {
  "/media/projects/torvena/page-preview.mp4": { alt: "Tour of the live Torvena store", label: "Storefront in motion" },
  "/media/projects/torvena/context-luo.png": { alt: "Technology product from the Torvena catalog", label: "Product & context" },
  "/media/projects/torvena/live-mobile.png": { alt: "Torvena store on mobile", label: "Mobile experience" },
  "/media/projects/brisa-do-mar/context-playa.webp": { alt: "Beach landscape framing Brisa do Mar's tourism proposition", label: "The destination as a starting point" },
  "/media/projects/brisa-do-mar/live-desktop.png": { alt: "Brisa do Mar multilingual landing page on desktop", label: "Comparison & recommendation" },
  "/media/projects/brisa-do-mar/live-mobile.png": { alt: "Brisa do Mar multilingual landing page on mobile", label: "Inquiry from a phone" },
  "/media/projects/cuidalo/uso-llaves.webp": { alt: "CUIDALO finder next to a set of keys", label: "The product in an everyday situation" },
  "/media/projects/cuidalo/live-desktop.png": { alt: "CUIDALO MVP on desktop", label: "Measurable MVP" },
  "/media/projects/cuidalo/uso-equipaje.webp": { alt: "CUIDALO finder attached to luggage", label: "Use cases before promises" },
  "/media/projects/salto-cuantico/cover-desktop.png": { alt: "Art direction for the Salto Cuántico proposal", label: "Proposal direction" },
  "/media/projects/salto-cuantico/live-desktop.png": { alt: "Salto Cuántico prototype on desktop", label: "A journey before the form" },
  "/media/projects/salto-cuantico/live-mobile.png": { alt: "Salto Cuántico prototype on mobile", label: "Responsive narrative" },
  "/media/projects/luca-ds/hero-transition.mp4": { alt: "Cinematic Luca DS hero opening", label: "The hero as a first statement" },
  "/media/projects/luca-ds/entrenamiento-disciplina.webp": { alt: "Luca training with a barbell in a dark gym", label: "Discipline as a starting point" },
  "/media/projects/luca-ds/caso-real.jpg": { alt: "Real Luca DS case built through sustained training", label: "A real story behind the method" },
  "/media/projects/luca-ds/luca-entrenando.jpg": { alt: "Luca training in a vertical landing-page image", label: "Training before promises" },
  "/media/projects/lourdes-mirada/work-04.jpg": { alt: "Editorial portrait from Lourdes's archive", label: "The archive as raw material" },
  "/media/projects/lourdes-mirada/live-desktop.png": { alt: "Lourdes Mirada portfolio on desktop", label: "Portfolio & manifesto" },
  "/media/projects/lourdes-mirada/work-08.jpg": { alt: "Lifestyle photograph from Lourdes's real archive", label: "Rhythm, pause & curation" },
};

const projectsPageCopy = {
  es: {
    visualResources: "Recursos visuales de", challenge: "Desafío", services: "Servicios", role: "Mi rol", visit: "Visitar el sitio", live: "Ver proyecto en vivo",
    coordinates: ["Archivo de proyectos", "Buenos Aires · AR", "Una selección abierta que sigue creciendo"],
    heroLabel: "Negocio · experiencia · operación", heroTitle: ["Trabajo", "en contexto"],
    introLead: "No alcanza con mostrar una pantalla linda", intro: "Acá cada proyecto se presenta con el problema que había que ordenar, las decisiones que tomé y el rol que ocupé para llevarlo a algo concreto.",
    index: "Índice de proyectos", archive: "Archivo de proyectos", closingLabel: "El archivo sigue abierto", closingTitle: "Lo próximo todavía se está construyendo",
    closing: "Estoy trabajando en nuevos proyectos y recursos. Esta página va a crecer con ellos, sin inflar procesos ni resultados que todavía no existen.", talk: "Hablemos",
  },
  en: {
    visualResources: "Visual resources for", challenge: "Challenge", services: "Services", role: "My role", visit: "Visit the site", live: "View live project",
    coordinates: ["Project archive", "Buenos Aires · AR", "An open selection that keeps growing"],
    heroLabel: "Business · experience · operations", heroTitle: ["Work", "in context"],
    introLead: "A polished screen is not enough", intro: "Each project is presented through the problem that needed structure, the decisions I made and the role I took to turn it into something concrete.",
    index: "Project index", archive: "Project archive", closingLabel: "The archive stays open", closingTitle: "What comes next is still being built",
    closing: "I am working on new projects and resources. This page will grow with them, without inflating processes or results that do not exist yet.", talk: "Let's talk",
  },
} as const;

const projectToneById: Record<string, string> = {
  torvena: "#0a7483",
  "brisa-do-mar": "#c99269",
  cuidalo: "#ad4a3e",
  "salto-cuantico": "#5c326f",
  "luca-ds": "#ed1c24",
  "lourdes-mirada": "#a04b68",
};

const projectArchiveOrder = [
  "torvena",
  "luca-ds",
  "lourdes-mirada",
  "brisa-do-mar",
  "cuidalo",
  "salto-cuantico",
] as const;

const archiveProjects = projectArchiveOrder
  .map((projectId) => projects.find((project) => project.id === projectId))
  .filter((project): project is Project => Boolean(project));

function BrandMark() {
  return (
    <svg className={styles.brandMark} viewBox="0 0 48 36" aria-hidden="true">
      <path d="M5 32L20.5 4" />
      <path d="M33 21H42" />
      <path d="M21.5 32L34.4 7C35.1 5.6 36.3 4.8 38 4.8H44" />
    </svg>
  );
}

function HeaderWord({ children }: Readonly<{ children: string }>) {
  return (
    <span className={styles.headerWordViewport} aria-hidden="true">
      <span>{children}</span>
      <span>{children}</span>
    </span>
  );
}

function ProjectMedia({ asset, project, locale }: Readonly<{ asset: ProjectAsset; project: Project; locale: Locale }>) {
  const localizedAsset = locale === "en" ? projectAssetEnglish[asset.src] : undefined;
  const alt = localizedAsset?.alt ?? asset.alt;
  const label = localizedAsset?.label ?? asset.label;
  return (
    <figure className={`${styles.projectMedia} ${styles[`projectMedia${asset.layout}`]}`} data-project-reveal>
      <div className={styles.projectMediaSurface}>
        {project.id === "lourdes-mirada" && asset.src.endsWith("/live-desktop.png") ? (
          <LourdesHeroPreview locale={locale} />
        ) : asset.video ? (
          <video
            src={asset.src}
            poster={asset.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={alt}
          />
        ) : (
          <Image
            src={asset.src}
            alt={alt}
            fill
            sizes="(max-width: 760px) 92vw, 64vw"
            style={{ objectPosition: asset.position ?? "center" }}
          />
        )}
        <span className={styles.projectMediaGrid} aria-hidden="true" />
      </div>
      <figcaption>
        <span>{label}</span>
        <span>{project.content[locale].title} · {project.year}</span>
      </figcaption>
    </figure>
  );
}

function ProjectCase({ project, index, locale }: Readonly<{ project: Project; index: number; locale: Locale }>) {
  const content = project.content[locale];
  const copy = projectsPageCopy[locale];
  const assets = assetsByProject[project.id] ?? [];
  const services = (locale === "en" ? servicesByProjectEn : servicesByProject)[project.id] ?? project.technologies;

  return (
    <article
      className={styles.projectCase}
      id={project.id}
      data-project-case={project.id}
      data-analytics-section={`project_${project.id}`}
      style={{ "--project-tone": projectToneById[project.id] ?? project.accent } as CSSProperties}
    >
      <div className={styles.projectCaseBackdrop} aria-hidden="true">
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className={styles.projectCaseLayout}>
        <div className={styles.projectCaseInfo}>
          <div className={styles.projectCaseHeading} data-project-reveal>
            <p>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{content.statusLabel}</span>
            </p>
            <h2>{content.title}</h2>
            <p className={styles.projectSummary}>{content.summary}</p>
          </div>

          <dl className={styles.projectFacts}>
            <div data-project-reveal>
              <dt>{copy.challenge}</dt>
              <dd>{content.problem}</dd>
            </div>
            <div data-project-reveal>
              <dt>{copy.services}</dt>
              <dd>
                <ul className={styles.serviceList}>
                  {services.map((service) => <li key={service}>{service}</li>)}
                </ul>
              </dd>
            </div>
            <div data-project-reveal>
              <dt>{copy.role}</dt>
              <dd>{content.role}</dd>
            </div>
          </dl>

          <a
            className={styles.liveButton}
            href={project.publicUrl}
            target="_blank"
            rel="noreferrer"
            data-project-reveal
            onClick={() => trackEvent("external_link", { locale, destinationDomain: domainFromUrl(project.publicUrl), context: "project" })}
          >
            <span className={styles.liveButtonIcon} aria-hidden="true">↗</span>
            <span className={styles.liveButtonWords}>
              <i>{copy.visit}</i>
              <i>{copy.live}</i>
            </span>
          </a>
        </div>

        <div className={styles.projectGallery} aria-label={`${copy.visualResources} ${content.title}`}>
          {assets.map((asset) => <ProjectMedia asset={asset} project={project} locale={locale} key={asset.src} />)}
        </div>
      </div>
    </article>
  );
}

export function PortfolioV2Projects({ locale = "es" }: Readonly<{ locale?: Locale }>) {
  const pageReady = usePageEntrance();
  const shared = v2SharedCopy[locale];
  const copy = projectsPageCopy[locale];
  const [activeProject, setActiveProject] = useState(archiveProjects[0]?.id ?? "");

  useEffect(() => {
    const cases = Array.from(document.querySelectorAll<HTMLElement>("[data-project-case]"));
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-project-reveal]"));
    const projectIndex = document.querySelector<HTMLElement>("[data-project-index]");

    if (window.innerWidth <= 760 && projectIndex) projectIndex.scrollLeft = 0;

    const seenProjects = new Set<string>();
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = visible?.target.getAttribute("data-project-case");
      if (id) {
        setActiveProject(id);
        if (!seenProjects.has(id)) {
          seenProjects.add(id);
          const position = cases.findIndex((projectCase) => projectCase.dataset.projectCase === id) + 1;
          trackEvent("project_story_view", { projectId: id, locale, position });
          trackEvent("case_study_view", { projectId: id, locale, caseType: "full" });
        }
      }
    }, { rootMargin: "-30% 0px -52%", threshold: [0, .15, .4] });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -9%", threshold: .08 });

    cases.forEach((projectCase) => activeObserver.observe(projectCase));
    revealItems.forEach((item) => revealObserver.observe(item));

    return () => {
      activeObserver.disconnect();
      revealObserver.disconnect();
    };
  }, [locale]);

  return (
    <div className={styles.page} data-page-ready={String(pageReady)} lang={locale}>
      <a className={styles.skipLink} href="#archivo">{shared.skipProjects}</a>

      <header className={styles.header}>
        <Link className={`${styles.headerButton} ${styles.brand}`} href={getV2Path(locale, "home")} aria-label={`Alejandro Fink, ${shared.backJourney}`}>
          <BrandMark />
          <HeaderWord>Alejandro Fink</HeaderWord>
        </Link>

        <nav className={styles.headerNav} aria-label={shared.mainNav}>
          <Link className={`${styles.headerButton} ${styles.headerButtonActive}`} href={getV2Path(locale, "projects")} aria-current="page" aria-label={shared.projects}>
            <HeaderWord>{shared.projects}</HeaderWord>
          </Link>
          <Link className={styles.headerButton} href={getV2Path(locale, "about")} aria-label={shared.about}>
            <HeaderWord>{shared.about}</HeaderWord>
          </Link>
          <V2LanguageSwitcher locale={locale} page="projects" />
        </nav>

        <V2TrackedContactLink
          className={`${styles.headerButton} ${styles.contact}`}
          channel="gmail"
          href={gmailComposeUrl(locale)}
          locale={locale}
          placement="header"
          target="_blank"
          rel="noreferrer"
          aria-label={shared.contactLabel}
        >
          <HeaderWord>{shared.contact}</HeaderWord>
          <span aria-hidden="true">↗</span>
        </V2TrackedContactLink>
        <V2MobileMenu locale={locale} page="projects" />
      </header>

      <div className={styles.topDiffuser} aria-hidden="true" />

      <main>
        <section className={styles.projectsHero} id="top" data-analytics-section="projects_hero">
          <div className={styles.heroCoordinates}>
            <p><span>{copy.coordinates[0]}</span><span>{copy.coordinates[1]}</span></p>
            <p>{copy.coordinates[2]}</p>
          </div>

          <div className={styles.heroTitle}>
            <p>{copy.heroLabel}</p>
            <h1>
              <span>{copy.heroTitle[0]}</span>
              <span>{copy.heroTitle[1]}</span>
            </h1>
          </div>

          <div className={styles.heroIntro}>
            <p>{copy.introLead}</p>
            <p>{copy.intro}</p>
          </div>

          <nav className={styles.projectIndex} aria-label={copy.index} data-project-index>
            {archiveProjects.map((project, index) => (
              <a
                href={`#${project.id}`}
                className={activeProject === project.id ? styles.projectIndexActive : ""}
                onClick={() => trackEvent("project_open", { projectId: project.id, locale, placement: "index" })}
                key={project.id}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{project.content[locale].title}</strong>
                <i aria-hidden="true">↓</i>
              </a>
            ))}
          </nav>
        </section>

        <section className={styles.projectsArchive} id="archivo" aria-label={copy.archive} data-analytics-section="projects_archive">
          {archiveProjects.map((project, index) => <ProjectCase project={project} index={index} locale={locale} key={project.id} />)}
        </section>

        <section className={styles.projectsClosing} data-analytics-section="projects_contact">
          <p>{copy.closingLabel}</p>
          <h2>{copy.closingTitle}</h2>
          <div>
            <p>{copy.closing}</p>
            <V2TrackedContactLink channel="mailto" href={`mailto:alegfink@gmail.com?subject=${encodeURIComponent(shared.contactSubject)}`} locale={locale} placement="projects">
              <span>{copy.talk}</span>
              <i aria-hidden="true">↗</i>
            </V2TrackedContactLink>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <Link href={getV2Path(locale, "home")} className={styles.footerHome}>
          <BrandMark />
          <span>{shared.backJourney}</span>
        </Link>
        <p className={styles.footerName} aria-label="Alejandro Fink">
          <span>Alejandro</span> <span>Fink</span>
        </p>
        <div>
          <Link href={v2PrivacyRoutes[locale]}>{shared.privacy}</Link>
          <a href="#top">{shared.backTop} ↑</a>
        </div>
      </footer>
    </div>
  );
}
