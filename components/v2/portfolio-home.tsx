"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { projects, type Project, type ProjectMedia } from "@/content/projects";
import { HeroLab } from "@/components/v2/hero-lab";
import { LourdesHeroPreview } from "@/components/v2/lourdes-hero-preview";
import { usePageEntrance } from "@/components/v2/use-page-entrance";
import { V2LanguageSwitcher } from "@/components/v2/v2-language-switcher";
import { V2MobileMenu } from "@/components/v2/v2-mobile-menu";
import styles from "@/components/v2/portfolio-home.module.css";
import type { Locale } from "@/lib/i18n";
import { getV2Path, gmailComposeUrl, v2PrivacyRoutes, v2SharedCopy } from "@/lib/v2-i18n";

const projectById = new Map(projects.map((project) => [project.id, project]));

const projectCollectionConfig = {
  es: [
    { number: "01", label: "E-commerce & conversión", title: "Páginas que convierten interés en una próxima acción", description: "Tienda, catálogo y decisión conectados para que la experiencia no termine en una pieza aislada.", projectIds: ["torvena", "brisa-do-mar", "cuidalo"] },
    { number: "02", label: "Experiencia & relato", title: "Páginas que hacen que quieras seguir recorriendo", description: "Dirección visual, ritmo y narrativa para construir una primera impresión que se sostiene más allá del hero.", projectIds: ["luca-ds", "salto-cuantico", "lourdes-mirada"] },
  ],
  en: [
    { number: "01", label: "E-commerce & conversion", title: "Pages that turn interest into a next action", description: "Store, catalog and decision connected so the experience does not end as an isolated piece.", projectIds: ["torvena", "brisa-do-mar", "cuidalo"] },
    { number: "02", label: "Experience & story", title: "Pages that make you want to keep exploring", description: "Art direction, rhythm and narrative that sustain a first impression beyond the hero.", projectIds: ["luca-ds", "salto-cuantico", "lourdes-mirada"] },
  ],
} as const;

const projectPreviewBackdrops: Record<string, { src: string; position: string }> = {
  torvena: { src: "/media/projects/torvena/context-luo.png", position: "center" },
  "brisa-do-mar": { src: "/media/projects/brisa-do-mar/context-playa.webp", position: "center" },
  cuidalo: { src: "/media/projects/cuidalo/uso-llaves.webp", position: "center" },
  "luca-ds": { src: "/media/projects/luca-ds/entrenamiento-disciplina.webp", position: "center 37%" },
  "salto-cuantico": { src: "/media/projects/salto-cuantico/cover-desktop.png", position: "center" },
  "lourdes-mirada": { src: "/media/projects/lourdes-mirada/work-04.jpg", position: "center 62%" },
};

const strengthsByLocale = {
  es: [
    { number: "01", title: "Orden antes de pantalla", text: "Transformo una necesidad difusa en prioridades, recorrido y una próxima acción concreta." },
    { number: "02", title: "Una decisión, más de una consecuencia", text: "Conecto experiencia con catálogo, atención, proveedores y operación para evitar soluciones aisladas." },
    { number: "03", title: "Tecnología con propósito", text: "Incorporo IA y herramientas nuevas cuando aceleran, aclaran o vuelven verificable el trabajo." },
    { number: "04", title: "Implementación que se sostiene", text: "No me quedo en la recomendación: acompaño la implementación y dejo un sistema que el equipo pueda seguir usando." },
  ],
  en: [
    { number: "01", title: "Order before screens", text: "I turn a diffuse need into priorities, a journey and a concrete next action." },
    { number: "02", title: "One decision, multiple consequences", text: "I connect experience with catalog, support, suppliers and operations to avoid isolated solutions." },
    { number: "03", title: "Technology with purpose", text: "I bring in AI and new tools when they accelerate, clarify or make the work verifiable." },
    { number: "04", title: "Implementation that lasts", text: "I go beyond the recommendation: I support implementation and leave a system the team can keep using." },
  ],
} as const;

const homeCopy = {
  es: {
    selectedProjects: "Proyectos seleccionados", rail: "RECORRIDO", strengths: "Fortalezas", approach: "ENFOQUE",
    kinetic: ["DECISIONES AISLADAS", "CUESTAN TIEMPO"], answer: "Conecto las partes para que el trabajo avance",
    proofEyebrow: "Cuando hay que pasar de una idea a algo real", proofTitle: "Contexto + criterio + ejecución",
    ctaEyebrow: "El próximo movimiento", ctaTitle: "Hagamos algo", ctaTitleAccent: "que la gente quiera recorrer",
    ctaLead: "Una experiencia clara, útil y conectada con lo que tu negocio necesita mover", talk: "Hablemos", copied: "Correo copiado", copy: "Copiar correo",
    footerEyebrow: "Una última coordenada", footerThanks: "Gracias por recorrer hasta acá", footerTitle: ["Fin del scroll", "Inicio de lo que sigue"],
    footerNav: "Navegación de cierre", designed: "Diseñado y desarrollado por Alejandro Fink", location: "Buenos Aires · 2026",
  },
  en: {
    selectedProjects: "Selected projects", rail: "JOURNEY", strengths: "Strengths", approach: "APPROACH",
    kinetic: ["ISOLATED DECISIONS", "COST TIME"], answer: "I connect the parts so the work can move forward",
    proofEyebrow: "When an idea needs to become something real", proofTitle: "Context + judgment + execution",
    ctaEyebrow: "The next move", ctaTitle: "Let's make something", ctaTitleAccent: "people want to explore",
    ctaLead: "A clear, useful experience connected to what your business needs to move", talk: "Let's talk", copied: "Email copied", copy: "Copy email",
    footerEyebrow: "One last coordinate", footerThanks: "Thanks for making it this far", footerTitle: ["End of the scroll", "Start of what comes next"],
    footerNav: "Closing navigation", designed: "Designed and developed by Alejandro Fink", location: "Buenos Aires · 2026",
  },
} as const;

const strengthRevealRanges = [
  { titleStart: .5, titleEnd: .54, textStart: .55, textEnd: .61 },
  { titleStart: .6, titleEnd: .64, textStart: .65, textEnd: .7 },
  { titleStart: .69, titleEnd: .73, textStart: .74, textEnd: .78 },
  { titleStart: .77, titleEnd: .81, textStart: .82, textEnd: .86 },
] as const;

const mobileStrengthRevealRanges = [
  { titleStart: .495, titleEnd: .525, textStart: .53, textEnd: .575 },
  { titleStart: .58, titleEnd: .61, textStart: .615, textEnd: .66 },
  { titleStart: .665, titleEnd: .695, textStart: .7, textEnd: .745 },
  { titleStart: .75, titleEnd: .78, textStart: .785, textEnd: .83 },
] as const;

const contactEmail = "alegfink@gmail.com";

function HeaderWord({ label }: Readonly<{ label: string }>) {
  return (
    <span className={styles.headerWordViewport} aria-hidden="true">
      <span className={`${styles.headerWord} ${styles.headerWordCurrent}`}>{label}</span>
      <span className={`${styles.headerWord} ${styles.headerWordClone}`}>{label}</span>
    </span>
  );
}

function BrandMark() {
  return (
    <svg className={styles.brandMark} viewBox="0 0 48 36" aria-hidden="true">
      <path className={`${styles.brandMarkStroke} ${styles.brandMarkLead}`} d="M5 32L20.5 4" />
      <path className={`${styles.brandMarkStroke} ${styles.brandMarkAccent}`} d="M33 21H42" />
      <path className={`${styles.brandMarkStroke} ${styles.brandMarkBody}`} d="M21.5 32L34.4 7C35.1 5.6 36.3 4.8 38 4.8H44" />
    </svg>
  );
}

function StoryReveal({ label, reveal, wide = false, locale = "es" }: Readonly<{ label: string; reveal: string; wide?: boolean; locale?: Locale }>) {
  const answerDensity = reveal.length >= 46
    ? styles.storyRevealAnswerLong
    : reveal.length >= 40
      ? styles.storyRevealAnswerMedium
      : styles.storyRevealAnswerShort;

  return (
    <button className={`${styles.storyReveal} ${wide ? styles.storyRevealWide : ""}`} type="button">
      <span className={styles.storyRevealViewport} aria-hidden="true">
        <span className={`${styles.storyRevealWord} ${styles.storyRevealCurrent}`}>{label}</span>
        <span className={`${styles.storyRevealWord} ${styles.storyRevealAnswer} ${answerDensity}`}>{reveal}</span>
      </span>
      <span className={styles.srOnly}>{label}. {locale === "es" ? "Descubrí" : "Discover"}: {reveal}</span>
    </button>
  );
}

function ProjectPreviewMedia({ media }: Readonly<{ media: ProjectMedia }>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !media.videoSrc || shouldLoad) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: "700px 0px", threshold: 0.01 });

    observer.observe(video);
    return () => observer.disconnect();
  }, [media.videoSrc, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !media.videoSrc || !shouldLoad) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }, { threshold: 0.15 });

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [media.videoSrc, shouldLoad]);

  if (media.videoSrc) {
    return (
      <video
        ref={videoRef}
        className={styles.projectPreviewVideo}
        src={shouldLoad ? media.videoSrc : undefined}
        poster={media.src}
        muted
        loop
        playsInline
        preload={shouldLoad ? "metadata" : "none"}
        aria-hidden="true"
      />
    );
  }

  return (
    <Image
      className={styles.projectPreviewDesktop}
      src={media.src}
      alt={media.alt.es}
      fill
      sizes="(max-width: 760px) 92vw, 31vw"
    />
  );
}

function ProjectFolderPreview({ project, media, locale }: Readonly<{ project: Project; media: ProjectMedia; locale: Locale }>) {
  const backdrop = projectPreviewBackdrops[project.id] ?? { src: media.src, position: "center" };

  return (
    <div className={styles.projectPreviewFrame}>
      <Image
        className={styles.projectPreviewBackdrop}
        src={backdrop.src}
        alt=""
        fill
        sizes="(max-width: 700px) 82vw, 31vw"
        style={{ objectPosition: backdrop.position }}
        aria-hidden="true"
      />
      <span className={styles.projectPreviewBackdropWash} aria-hidden="true" />
      <div className={styles.projectSiteWindow}>
        <div className={styles.projectSiteViewport}>
          {project.id === "lourdes-mirada"
            ? <LourdesHeroPreview locale={locale} />
            : <ProjectPreviewMedia media={media} />}
        </div>
      </div>
    </div>
  );
}

function StaggeredProjectTitle({ text, id }: Readonly<{ text: string; id: string }>) {
  const words = text.trim().split(/\s+/);

  return (
    <h3 className={styles.projectFolderTitle} id={id} data-project-title aria-label={text}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span
            className={styles.projectFolderTitleWord}
            style={{ "--project-word-index": index } as CSSProperties}
            aria-hidden="true"
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h3>
  );
}

function KineticPhrase({ text }: Readonly<{ text: string }>) {
  const letters = Array.from(text);

  return (
    <span aria-label={text}>
      {letters.map((letter, index) => (
        <i
          aria-hidden="true"
          data-kinetic-letter
          data-kinetic-index={index}
          data-kinetic-count={letters.length}
          key={`${letter}-${index}`}
        >
          {letter === " " ? "\u00a0" : letter}
        </i>
      ))}
    </span>
  );
}

function ScrubbedWords({
  text,
  start,
  end,
  track = "progress",
  exitStart,
  exitEnd,
}: Readonly<{
  text: string;
  start: number;
  end: number;
  track?: "entry" | "progress";
  exitStart?: number;
  exitEnd?: number;
}>) {
  const words = text.trim().split(/\s+/);

  return (
    <>
      <span className={styles.srOnly}>{text}</span>
      <span className={styles.scrubbedWords} aria-hidden="true">
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span
              className={styles.scrubbedWord}
              data-benefit-word
              data-word-count={words.length}
              data-word-end={end}
              data-word-exit-end={exitEnd}
              data-word-exit-start={exitStart}
              data-word-index={index}
              data-word-start={start}
              data-word-track={track}
            >
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}

export function PortfolioV2Home({ locale = "es" }: Readonly<{ locale?: Locale }>) {
  const pageReady = usePageEntrance();
  const shared = v2SharedCopy[locale];
  const copy = homeCopy[locale];
  const projectCollections = projectCollectionConfig[locale].map((collection) => ({
    ...collection,
    projects: collection.projectIds
      .map((projectId) => projectById.get(projectId))
      .filter((project): project is Project => Boolean(project)),
  }));
  const strengths = strengthsByLocale[locale];
  const storyChapters = locale === "es" ? [
    { number: "01", label: "Contexto antes que pantalla", copy: <>No parto de una pantalla. Parto de un <StoryReveal label="contexto" reveal="una necesidad que todavía pide orden" wide /></> },
    { number: "02", label: "Después del clic", copy: <>Opero mi propia marca y veo qué ocurre <StoryReveal label="después del clic" reveal="atención · pedidos · proveedores · logística" wide /></> },
    { number: "03", label: "Un mismo sistema", copy: <>La decisión conecta <span className={styles.storyAccent}>negocio, experiencia y operación</span></> },
    { number: "04", label: "Innovación con criterio", copy: <>Exploro herramientas nuevas, pero las incorporo cuando ayudan a construir <StoryReveal label="algo real" reveal="menos fricción · más claridad · mejor operación" wide /></> },
  ] : [
    { number: "01", label: "Context before screens", copy: <>I do not start with a screen. I start with <StoryReveal label="context" reveal="a need that still needs order" wide locale="en" /></> },
    { number: "02", label: "After the click", copy: <>I operate my own brand and see what happens <StoryReveal label="after the click" reveal="support · orders · suppliers · logistics" wide locale="en" /></> },
    { number: "03", label: "One system", copy: <>The decision connects <span className={styles.storyAccent}>business, experience and operations</span></> },
    { number: "04", label: "Innovation with judgment", copy: <>I explore new tools, but adopt them when they help build <StoryReveal label="something real" reveal="less friction · more clarity · better operations" wide locale="en" /></> },
  ];
  const pageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const storyWorldRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const closingCtaRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const projectSceneRefs = useRef<Array<HTMLElement | null>>([]);
  const headerMagnetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastHeaderPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const headerIdleTimerRef = useRef<number | null>(null);
  const storyFrameRef = useRef<number | null>(null);
  const projectFrameRef = useRef<number | null>(null);
  const benefitsFrameRef = useRef<number | null>(null);
  const emailCopyTimerRef = useRef<number | null>(null);
  const activeStoryIndexRef = useRef(0);
  const [headerAwake, setHeaderAwake] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    const root = pageRef.current;
    const hero = document.getElementById("hero-panel-pulse");
    if (!root || !hero) return;

    const lastPointer = { x: -1, y: -1, type: "" };
    const updateCursorVisibility = () => {
      const rect = hero.getBoundingClientRect();
      const active = lastPointer.type !== "touch"
        && lastPointer.x >= rect.left
        && lastPointer.x <= rect.right
        && lastPointer.y >= rect.top
        && lastPointer.y <= rect.bottom;
      root.dataset.heroCursor = active ? "true" : "false";
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      lastPointer.type = event.pointerType;
      root.style.setProperty("--page-cursor-x", `${event.clientX}px`);
      root.style.setProperty("--page-cursor-y", `${event.clientY}px`);
      updateCursorVisibility();
    };

    const hideCursor = () => { root.dataset.heroCursor = "false"; };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", updateCursorVisibility, { passive: true });
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", updateCursorVisibility);
      window.removeEventListener("blur", hideCursor);
    };
  }, []);

  useEffect(() => () => {
    if (headerIdleTimerRef.current !== null) window.clearTimeout(headerIdleTimerRef.current);
    if (emailCopyTimerRef.current !== null) window.clearTimeout(emailCopyTimerRef.current);
  }, []);

  useEffect(() => {
    const section = closingCtaRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.ctaVisible = "true";
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      section.dataset.ctaVisible = "true";
      observer.disconnect();
    }, { threshold: .035 });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      footer.dataset.animationActive = String(Boolean(entry?.isIntersecting));
    }, { rootMargin: "160px 0px", threshold: 0.01 });

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const story = storyRef.current;
    const world = storyWorldRef.current;
    if (!story || !world) return;

    const chapters = Array.from(world.querySelectorAll<HTMLElement>("[data-story-chapter]"));

    const smoothstep = (from: number, to: number, value: number) => {
      const normalized = Math.min(1, Math.max(0, (value - from) / (to - from)));
      return normalized * normalized * (3 - 2 * normalized);
    };

    const updateStory = () => {
      storyFrameRef.current = null;
      const rect = story.getBoundingClientRect();
      const travel = Math.max(1, story.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const worldTravel = Math.max(1, world.scrollHeight - window.innerHeight);
      const worldProgress = Math.max(0, progress * 1.14);
      const worldY = -worldTravel * worldProgress;
      const visualDrift = -12 + progress * 24;

      story.style.setProperty("--story-progress", progress.toFixed(4));
      story.style.setProperty("--story-world-y", `${worldY.toFixed(2)}px`);
      story.style.setProperty("--story-backdrop-opacity", smoothstep(0, .045, progress).toFixed(4));
      story.style.setProperty("--story-visual-drift", `${visualDrift.toFixed(2)}px`);

      const viewportTarget = window.innerHeight * .44;
      const nextIndex = chapters.reduce((closest, chapter, index) => {
        const chapterRect = chapter.getBoundingClientRect();
        const distance = Math.abs(chapterRect.top + chapterRect.height / 2 - viewportTarget);
        const closestRect = chapters[closest].getBoundingClientRect();
        const closestDistance = Math.abs(closestRect.top + closestRect.height / 2 - viewportTarget);
        return distance < closestDistance ? index : closest;
      }, 0);

      if (nextIndex !== activeStoryIndexRef.current) {
        activeStoryIndexRef.current = nextIndex;
        setActiveStoryIndex(nextIndex);
      }
    };

    const requestStoryUpdate = () => {
      if (storyFrameRef.current !== null) return;
      storyFrameRef.current = window.requestAnimationFrame(updateStory);
    };

    updateStory();
    window.addEventListener("scroll", requestStoryUpdate, { passive: true });
    window.addEventListener("resize", requestStoryUpdate);

    return () => {
      window.removeEventListener("scroll", requestStoryUpdate);
      window.removeEventListener("resize", requestStoryUpdate);
      if (storyFrameRef.current !== null) window.cancelAnimationFrame(storyFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const scenes = projectSceneRefs.current.filter((scene): scene is HTMLElement => Boolean(scene));
    if (!scenes.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const titles = scenes
      .map((scene) => scene.querySelector<HTMLElement>("[data-project-title]"))
      .filter((title): title is HTMLElement => Boolean(title));

    if (reducedMotion) {
      titles.forEach((title) => { title.dataset.projectTitleVisible = "true"; });
      scenes.forEach((scene) => { scene.dataset.folderStatic = "true"; });
      return;
    }

    titles.forEach((title) => { title.dataset.projectTitleMotion = "ready"; });

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const title = entry.target as HTMLElement;
        title.dataset.projectTitleVisible = "true";
        titleObserver.unobserve(title);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.2 });

    titles.forEach((title) => titleObserver.observe(title));

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smoothstep = (from: number, to: number, value: number) => {
      const normalized = clamp((value - from) / Math.max(.0001, to - from));
      return normalized * normalized * (3 - 2 * normalized);
    };

    const updateFolders = () => {
      projectFrameRef.current = null;
      const isMobile = window.innerWidth <= 700;

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const travel = Math.max(1, scene.offsetHeight - window.innerHeight);
        const progress = clamp(-rect.top / travel);
        const stage = scene.querySelector<HTMLElement>("[data-folder-stage]");
        const cards = Array.from(scene.querySelectorAll<HTMLElement>("[data-folder-page]"));
        if (!stage || cards.length === 0) return;

        const arrival = smoothstep(.02, .2, progress);
        const open = smoothstep(.14, .42, progress);
        const fan = smoothstep(.32, .72, progress);
        const exit = smoothstep(.9, 1, progress);
        const copyExit = smoothstep(.48, .74, progress);
        const stageWidth = stage.getBoundingClientRect().width;
        const spread = Math.min(stageWidth * .335, 450);

        scene.style.setProperty("--folder-progress", progress.toFixed(4));
        scene.style.setProperty("--folder-shell-y", `${((1 - arrival) * 38 - exit * 8).toFixed(2)}vh`);
        scene.style.setProperty("--folder-shell-scale", `${(.92 + arrival * .08 - exit * .025).toFixed(4)}`);
        scene.style.setProperty("--folder-shell-opacity", `${arrival.toFixed(4)}`);
        scene.style.setProperty("--folder-front-angle", `${(-76 * open).toFixed(2)}deg`);
        scene.style.setProperty("--folder-front-y", `${(34 * open).toFixed(2)}px`);
        scene.style.setProperty("--folder-copy-y", `${(-44 * copyExit).toFixed(2)}px`);
        scene.style.setProperty("--folder-copy-opacity", `${(1 - copyExit * .72).toFixed(4)}`);

        cards.forEach((card, index) => {
          const direction = index - 1;
          const initialX = direction * (isMobile ? 7 : 12);
          const targetX = isMobile ? direction * 16 : direction * spread;
          const initialY = 92 + Math.abs(direction) * 12;
          const targetY = isMobile ? direction * 112 : index === 1 ? -18 : 4;
          const x = initialX + (targetX - initialX) * fan;
          const y = (1 - arrival) * 110 + initialY * (1 - fan) + targetY * fan - exit * 58;
          const rotation = direction * 4.4 * (1 - fan) + (isMobile ? direction * 1.2 * fan : 0);
          const scale = .84 + fan * .16;
          const opacity = (.18 + smoothstep(.2, .38, progress) * .82) * (1 - exit * .42);

          card.style.setProperty("--folder-card-transform", `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`);
          card.style.setProperty("--folder-card-opacity", opacity.toFixed(4));
        });
      });
    };

    const requestFolderUpdate = () => {
      if (projectFrameRef.current !== null) return;
      projectFrameRef.current = window.requestAnimationFrame(updateFolders);
    };

    updateFolders();
    window.addEventListener("scroll", requestFolderUpdate, { passive: true });
    window.addEventListener("resize", requestFolderUpdate);

    return () => {
      titleObserver.disconnect();
      window.removeEventListener("scroll", requestFolderUpdate);
      window.removeEventListener("resize", requestFolderUpdate);
      if (projectFrameRef.current !== null) window.cancelAnimationFrame(projectFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const section = benefitsRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const proof = section.querySelector<HTMLElement>("[data-benefits-proof]");
    const proofHeading = proof?.querySelector<HTMLElement>("h3");
    const benefitItems = Array.from(section.querySelectorAll<HTMLElement>("[data-benefit-item]"));
    const kineticLetters = Array.from(section.querySelectorAll<HTMLElement>("[data-kinetic-letter]"));
    const scrubbedWords = Array.from(section.querySelectorAll<HTMLElement>("[data-benefit-word]"));

    if (reducedMotion) {
      section.dataset.benefitsStatic = "true";
      benefitItems.forEach((item) => {
        item.style.setProperty("--benefit-opacity", "1");
        item.style.setProperty("--benefit-y", "0px");
        item.style.setProperty("--benefit-blur", "0px");
      });
      kineticLetters.forEach((letter) => { letter.style.setProperty("--kinetic-letter-opacity", "1"); });
      scrubbedWords.forEach((word) => {
        word.style.setProperty("--benefit-word-progress", "1");
        word.style.setProperty("--benefit-word-exit", "0");
      });
      return;
    }

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smoothstep = (from: number, to: number, value: number) => {
      const normalized = clamp((value - from) / Math.max(.0001, to - from));
      return normalized * normalized * (3 - 2 * normalized);
    };

    const updateBenefits = () => {
      benefitsFrameRef.current = null;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);
      const entryProgress = clamp((window.innerHeight - rect.top) / Math.max(1, window.innerHeight));
      const wordTravel = smoothstep(.04, .88, entryProgress);
      const wordsIn = smoothstep(.02, .3, entryProgress);
      const isNarrow = window.innerWidth <= 700;
      const answerIn = smoothstep(.025, .045, progress);
      const answerOut = smoothstep(isNarrow ? .35 : .4, isNarrow ? .39 : .43, progress);
      const photoJourney = smoothstep(isNarrow ? .57 : .66, isNarrow ? .88 : .92, progress);
      const proofIn = smoothstep(isNarrow ? .365 : .402, isNarrow ? .405 : .442, progress);
      const proofTravel = smoothstep(.66, .92, progress);
      const proofOut = smoothstep(isNarrow ? .855 : .875, isNarrow ? .965 : .985, progress);
      const photoY = isNarrow ? 7 - photoJourney * 18 : 2 - photoJourney * 5;
      const photoScale = isNarrow ? 1.22 - photoJourney * .12 : 1.08 - photoJourney * .045;
      const portraitHeight = window.innerWidth * (1672 / 941);
      const photoCropTravelVh = Math.max(0, ((portraitHeight - window.innerHeight) / window.innerHeight) * 62);
      const proofY = (1 - proofIn) * 72 - proofOut * 44;

      section.style.setProperty("--benefits-progress", progress.toFixed(4));
      section.style.setProperty("--benefits-entry-progress", entryProgress.toFixed(4));
      section.style.setProperty("--benefits-photo-position-y", `${(16 + photoJourney * 62).toFixed(2)}%`);
      section.style.setProperty("--benefits-photo-y", `${photoY.toFixed(2)}vh`);
      section.style.setProperty("--benefits-photo-scale", photoScale.toFixed(4));
      section.style.setProperty("--benefits-photo-opacity", "1");
      section.style.setProperty("--benefits-subject-opacity", `${(wordsIn * (1 - smoothstep(.3, .4, progress))).toFixed(4)}`);
      section.style.setProperty("--benefits-words-opacity", wordsIn.toFixed(4));
      section.style.setProperty("--benefits-word-a-x", `${(68 - wordTravel * 66.5).toFixed(2)}vw`);
      section.style.setProperty("--benefits-word-b-x", `${(-74 + wordTravel * 67).toFixed(2)}vw`);
      section.style.setProperty("--benefits-answer-opacity", `${(answerIn * (1 - answerOut)).toFixed(4)}`);
      section.style.setProperty("--benefits-answer-y", `${((1 - answerIn) * 28 - answerOut * 26).toFixed(2)}px`);
      section.style.setProperty("--benefits-proof-opacity", `${(proofIn * (1 - proofOut)).toFixed(4)}`);
      section.style.setProperty("--benefits-proof-y", `${proofY.toFixed(2)}px`);

      const benefitRevealStartY = window.innerHeight * .92;
      const benefitRevealCompleteY = window.innerHeight * .5;
      const benefitRevealDistance = Math.max(1, benefitRevealStartY - benefitRevealCompleteY);

      const benefitEnterProgresses: number[] = [];

      benefitItems.forEach((item, itemIndex) => {
        const itemTop = item.getBoundingClientRect().top;
        const rawViewportProgress = clamp((benefitRevealStartY - itemTop) / benefitRevealDistance);
        const activeRevealRanges = isNarrow ? mobileStrengthRevealRanges : strengthRevealRanges;
        const revealRange = activeRevealRanges[itemIndex] ?? activeRevealRanges.at(-1)!;
        const revealDuration = Math.max(.0001, revealRange.textEnd - revealRange.titleStart);
        const scrollDrivenProgress = clamp((progress - revealRange.titleStart) / revealDuration);
        const headlineGate = itemIndex === 0
          ? smoothstep(isNarrow ? .425 : .49, isNarrow ? .445 : .505, progress)
          : 1;
        // On narrow viewports the stacked cards can enter the physical viewport
        // before the proof headline has finished. Keep mobile on one shared,
        // top-to-bottom timeline so a later card can never overtake the title or
        // a preceding card. Desktop keeps the viewport assist for its wider,
        // less vertically constrained composition.
        const viewportProgress = isNarrow
          ? scrollDrivenProgress
          : Math.max(rawViewportProgress * headlineGate, scrollDrivenProgress);
        const enter = smoothstep(0, .16, viewportProgress);
        benefitEnterProgresses.push(enter);
        const opacity = enter * (1 - proofOut);
        const y = (1 - enter) * 18 - proofOut * 62;
        const blur = proofOut * 5;
        item.dataset.benefitViewportProgress = viewportProgress.toFixed(4);
        item.style.setProperty("--benefit-opacity", opacity.toFixed(4));
        item.style.setProperty("--benefit-y", `${y.toFixed(2)}px`);
        item.style.setProperty("--benefit-blur", `${blur.toFixed(2)}px`);
      });

      if (isNarrow && proof && proofHeading) {
        const proofRect = proof.getBoundingClientRect();
        let revealedBottom = proofHeading.getBoundingClientRect().bottom - proofRect.top;

        benefitItems.forEach((item, itemIndex) => {
          const itemBottom = item.getBoundingClientRect().bottom - proofRect.top;
          const enter = benefitEnterProgresses[itemIndex] ?? 0;
          revealedBottom += (itemBottom - revealedBottom) * enter;
        });

        const bottomLimit = window.innerHeight * .9;
        const visibleContentBottom = proof.offsetTop + proofY + revealedBottom;
        const requiredTravelPx = Math.max(0, visibleContentBottom - bottomLimit);
        const maxTravelPx = window.innerHeight * .7;
        const proofScrollY = -Math.min(requiredTravelPx, maxTravelPx) / window.innerHeight * 100;
        section.style.setProperty("--benefits-proof-scroll-y", `${proofScrollY.toFixed(2)}vh`);
      } else {
        const proofTravelVh = photoCropTravelVh + 5;
        const proofScrollY = -proofTravel * proofTravelVh;
        section.style.setProperty("--benefits-proof-scroll-y", `${proofScrollY.toFixed(2)}vh`);
      }

      scrubbedWords.forEach((word) => {
        const index = Number(word.dataset.wordIndex ?? 0);
        const count = Math.max(1, Number(word.dataset.wordCount ?? 1));
        const benefitItem = word.closest<HTMLElement>("[data-benefit-item]");

        if (benefitItem) {
          const viewportProgress = Number(benefitItem.dataset.benefitViewportProgress ?? 0);
          const sequenceProgress = count === 1 ? 0 : index / (count - 1);
          const isTitle = word.closest("h4") !== null;
          const localStart = isTitle
            ? sequenceProgress * (isNarrow ? .25 : .3)
            : (isNarrow ? .42 + sequenceProgress * .32 : .56 + sequenceProgress * .28);
          const localEnd = Math.min(
            1,
            localStart + (isTitle ? (isNarrow ? .27 : .22) : (isNarrow ? .2 : .14)),
          );
          const localProgress = smoothstep(localStart, localEnd, viewportProgress);
          word.style.setProperty("--benefit-word-progress", localProgress.toFixed(4));
          word.style.setProperty("--benefit-word-exit", "0");
          return;
        }

        const trackProgress = word.dataset.wordTrack === "entry" ? entryProgress : progress;
        const start = Number(word.dataset.wordStart ?? 0);
        const end = Number(word.dataset.wordEnd ?? 1);
        const groupProgress = clamp((trackProgress - start) / Math.max(.0001, end - start));
        const overlap = .72;
        const localProgress = clamp(groupProgress * ((count - 1) * overlap + 1) - index * overlap);
        word.style.setProperty("--benefit-word-progress", localProgress.toFixed(4));

        const exitStart = Number(word.dataset.wordExitStart);
        const exitEnd = Number(word.dataset.wordExitEnd);
        if (Number.isFinite(exitStart) && Number.isFinite(exitEnd)) {
          const exitGroupProgress = clamp((progress - exitStart) / Math.max(.0001, exitEnd - exitStart));
          const localExit = clamp(exitGroupProgress * ((count - 1) * overlap + 1) - index * overlap);
          word.style.setProperty("--benefit-word-exit", localExit.toFixed(4));
        } else {
          word.style.setProperty("--benefit-word-exit", "0");
        }
      });

      kineticLetters.forEach((letter) => {
        const index = Number(letter.dataset.kineticIndex ?? 0);
        const count = Math.max(1, Number(letter.dataset.kineticCount ?? 1));
        const sequenceProgress = count === 1 ? 0 : index / (count - 1);
        const fadeStart = .29 + sequenceProgress * .045;
        const opacity = 1 - smoothstep(fadeStart, fadeStart + .045, progress);
        letter.style.setProperty("--kinetic-letter-opacity", opacity.toFixed(4));
      });
    };

    const requestBenefitsUpdate = () => {
      if (benefitsFrameRef.current !== null) return;
      benefitsFrameRef.current = window.requestAnimationFrame(updateBenefits);
    };

    updateBenefits();
    window.addEventListener("scroll", requestBenefitsUpdate, { passive: true });
    window.addEventListener("resize", requestBenefitsUpdate);

    return () => {
      window.removeEventListener("scroll", requestBenefitsUpdate);
      window.removeEventListener("resize", requestBenefitsUpdate);
      if (benefitsFrameRef.current !== null) window.cancelAnimationFrame(benefitsFrameRef.current);
    };
  }, []);

  const resetHeaderMagnets = (duration = 260) => {
    headerMagnetRefs.current.forEach((magnet) => {
      if (!magnet) return;
      magnet.style.setProperty("--header-magnet-x", "0px");
      magnet.style.setProperty("--header-magnet-y", "0px");
      magnet.style.setProperty("--header-magnet-duration", `${duration}ms`);
    });
    lastHeaderPointerRef.current.time = 0;
  };

  const updateHeaderMagnets = (event: PointerEvent<HTMLElement>) => {
    const now = performance.now();
    const last = lastHeaderPointerRef.current;
    const elapsed = last.time > 0 ? Math.max(8, now - last.time) : 16;
    const pointerDistance = last.time > 0 ? Math.hypot(event.clientX - last.x, event.clientY - last.y) : 0;
    const pointerSpeed = pointerDistance / elapsed;
    lastHeaderPointerRef.current = { x: event.clientX, y: event.clientY, time: now };

    headerMagnetRefs.current.forEach((magnet) => {
      if (!magnet) return;
      const currentX = Number.parseFloat(magnet.style.getPropertyValue("--header-magnet-x")) || 0;
      const currentY = Number.parseFloat(magnet.style.getPropertyValue("--header-magnet-y")) || 0;
      const rect = magnet.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - currentX;
      const centerY = rect.top + rect.height / 2 - currentY;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const proximity = Math.max(0, 1 - distance / 190);

      if (proximity > 0) {
        const pull = Math.pow(proximity, 1.15) * .26;
        const targetX = Math.max(-18, Math.min(18, deltaX * pull));
        const targetY = Math.max(-12, Math.min(12, deltaY * pull));
        magnet.style.setProperty("--header-magnet-x", `${targetX.toFixed(2)}px`);
        magnet.style.setProperty("--header-magnet-y", `${targetY.toFixed(2)}px`);
        magnet.style.setProperty("--header-magnet-duration", `${Math.round(Math.max(120, 235 - pointerSpeed * 48))}ms`);
        return;
      }

      magnet.style.setProperty("--header-magnet-x", "0px");
      magnet.style.setProperty("--header-magnet-y", "0px");
      magnet.style.setProperty("--header-magnet-duration", `${Math.round(Math.max(140, 560 - pointerSpeed * 190))}ms`);
    });
  };

  const handleHeaderPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    setHeaderAwake(true);
    updateHeaderMagnets(event);
    if (headerIdleTimerRef.current !== null) window.clearTimeout(headerIdleTimerRef.current);
    headerIdleTimerRef.current = window.setTimeout(() => setHeaderAwake(false), 260);
  };

  const handleHeaderPointerLeave = () => {
    setHeaderAwake(false);
    resetHeaderMagnets();
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      setEmailCopied(true);
      if (emailCopyTimerRef.current !== null) window.clearTimeout(emailCopyTimerRef.current);
      emailCopyTimerRef.current = window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(shared.contactSubject)}`;
    }
  };

  return (
    <div className={styles.page} ref={pageRef} data-hero-cursor="false" data-page-ready={String(pageReady)} lang={locale}>
      <a className={styles.skipLink} href="#contenido">{shared.skipHome}</a>

      <header
        className={`${styles.header} ${headerAwake ? styles.headerAwake : ""}`}
        onPointerMove={handleHeaderPointerMove}
        onPointerLeave={handleHeaderPointerLeave}
      >
        <div className={`${styles.headerMagnet} ${styles.brandMagnet}`} ref={(node) => { headerMagnetRefs.current[0] = node; }}>
          <Link className={`${styles.headerButton} ${styles.brand}`} href={getV2Path(locale, "home")} aria-label={`Alejandro Fink, ${shared.home}`}>
            <BrandMark />
            <HeaderWord label="Alejandro Fink" />
          </Link>
        </div>

        <nav className={styles.nav} aria-label={shared.mainNav}>
          <div className={styles.headerMagnet} ref={(node) => { headerMagnetRefs.current[1] = node; }}>
            <Link className={styles.headerButton} href={getV2Path(locale, "projects")} aria-label={shared.projects}><HeaderWord label={shared.projects} /></Link>
          </div>
          <div className={styles.headerMagnet} ref={(node) => { headerMagnetRefs.current[2] = node; }}>
            <Link className={styles.headerButton} href={getV2Path(locale, "about")} aria-label={shared.about}><HeaderWord label={shared.about} /></Link>
          </div>
          <V2LanguageSwitcher locale={locale} page="home" />
        </nav>

        <div className={`${styles.headerMagnet} ${styles.contactMagnet}`} ref={(node) => { headerMagnetRefs.current[3] = node; }}>
          <a
            className={`${styles.headerButton} ${styles.contact}`}
            href={gmailComposeUrl(locale)}
            target="_blank"
            rel="noreferrer"
            aria-label={shared.contactLabel}
          >
            <HeaderWord label={shared.contact} />
            <span className={styles.headerArrow} aria-hidden="true">↗</span>
          </a>
        </div>
        <V2MobileMenu locale={locale} page="home" />
      </header>

      <div className={styles.topDiffuser} aria-hidden="true" />

      <div className={styles.pageCursor} aria-hidden="true">
        <span className={styles.pageCursorShape} />
        <span className={styles.pageCursorCore} />
        <i /><i /><i /><i /><i /><i />
      </div>

      <main id="contenido">
        <HeroLab standalone entryReady={pageReady} locale={locale} />

        <section
          className={styles.story}
          id="recorrido"
          ref={storyRef}
          aria-labelledby="story-title"
          style={{
            "--story-progress": "0",
            "--story-backdrop-opacity": "0",
            "--story-world-y": "0px",
            "--story-visual-drift": "-12px",
          } as CSSProperties}
        >
          <div className={styles.storyStage}>
            <div className={styles.storyBackdrop} aria-hidden="true" />

            <div className={styles.storyVisualJourney} aria-hidden="true">
              <Image
                src="/media/v2/story/commerce-journey-vertical-v1.webp"
                alt=""
                fill
                priority={false}
                sizes="100vw"
              />
            </div>

            <div className={styles.storyWorld} ref={storyWorldRef}>
              {storyChapters.map((chapter, index) => (
                <article
                  className={`${styles.storyChapter} ${styles[`storyChapter${index + 1}`]} ${activeStoryIndex === index ? styles.storyChapterActive : ""}`}
                  data-story-chapter
                  key={chapter.number}
                >
                  <p>{chapter.number} · {chapter.label}</p>
                  <h2 id={index === 0 ? "story-title" : undefined}>{chapter.copy}</h2>
                </article>
              ))}
            </div>

            <div className={styles.storyAtmosphere} aria-hidden="true" />
            <div className={styles.storyEdgeFade} aria-hidden="true" />

            <div className={styles.storyRail} aria-hidden="true">
              <span className={styles.storyRailWord}>{copy.rail}</span>
              <span className={styles.storyProgressTrack}>
                <span className={styles.storyProgressFill} />
                <span className={styles.storyProgressDot} />
              </span>
              <span className={styles.storyRailNumber}>0{activeStoryIndex + 1}</span>
            </div>

          </div>
        </section>

        <section className={styles.projects} id="proyectos" aria-label={copy.selectedProjects}>
          <div className={styles.projectCollections}>
            {projectCollections.map((collection, collectionIndex) => (
              <section
                className={styles.projectFolderScene}
                key={collection.number}
                aria-labelledby={`project-collection-${collection.number}`}
                data-project-scene
                ref={(node) => { projectSceneRefs.current[collectionIndex] = node; }}
              >
                <div className={styles.projectFolderStage} data-folder-stage>
                  <header className={styles.projectFolderCopy}>
                    <p><span>{collection.number}</span>{collection.label}</p>
                    <StaggeredProjectTitle text={collection.title} id={`project-collection-${collection.number}`} />
                    <p>{collection.description}</p>
                  </header>

                  <div className={styles.projectFolderShell}>
                    <div className={styles.projectFolderBack} aria-hidden="true">
                      <span className={styles.projectFolderTab} />
                      <span className={styles.projectFolderBackLine} />
                    </div>

                    <div className={styles.projectFolderPages} aria-label={`${locale === "es" ? "Selección de" : "Selection of"} ${collection.label}`}>
                      {collection.projects.map((project, projectIndex) => {
                        const content = project.content[locale];
                        const media = project.media[0];
                        const projectStyle = {
                          "--project-accent": project.accent,
                          "--folder-card-layer": 3 - projectIndex,
                        } as CSSProperties;

                        return (
                          <article
                            className={styles.projectFolderPage}
                            data-folder-page
                            key={project.id}
                            style={projectStyle}
                            aria-label={content.title}
                          >
                            <div
                              className={styles.projectPreviewLink}
                            >
                              <ProjectFolderPreview project={project} media={media} locale={locale} />
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    <div className={styles.projectFolderFront} aria-hidden="true">
                      <span />
                    </div>
                  </div>

                </div>
              </section>
            ))}
          </div>
        </section>

        <section
          className={styles.benefitsJourney}
          id="enfoque"
          aria-labelledby="benefits-title"
          ref={benefitsRef}
          style={{
            "--benefits-progress": "0",
            "--benefits-entry-progress": "0",
            "--benefits-photo-position-y": "16%",
            "--benefits-photo-y": "2vh",
            "--benefits-photo-scale": "1.08",
            "--benefits-photo-opacity": "1",
            "--benefits-subject-opacity": "0",
            "--benefits-words-opacity": "0",
            "--benefits-word-a-x": "68vw",
            "--benefits-word-b-x": "-74vw",
            "--benefits-answer-opacity": "0",
            "--benefits-answer-y": "28px",
            "--benefits-proof-opacity": "0",
            "--benefits-proof-y": "72px",
            "--benefits-proof-scroll-y": "0vh",
          } as CSSProperties}
        >
          <div className={styles.benefitsStage}>
            <div className={styles.benefitsMedia} aria-hidden="true">
              <Image
                className={styles.benefitsMainImage}
                src="/media/v2/benefits-mountain-warm-v3.webp"
                alt=""
                fill
                sizes="100vw"
              />
              <span className={styles.benefitsMediaWash} />

            </div>

            <header className={styles.benefitsKinetic}>
              <h2 id="benefits-title">
                <KineticPhrase text={copy.kinetic[0]} />
                <KineticPhrase text={copy.kinetic[1]} />
              </h2>
            </header>

            <p className={styles.benefitsKineticAnswer}>
              <ScrubbedWords
                text={copy.answer}
                start={.04}
                end={.14}
                exitStart={.31}
                exitEnd={.4}
              />
            </p>

            <div className={styles.benefitsSubjectMask} aria-hidden="true">
              <Image
                className={styles.benefitsSubjectImage}
                src="/media/v2/benefits-subject-cutout-v4.webp"
                alt=""
                fill
                sizes="100vw"
              />
            </div>

            <header className={`${styles.benefitsKinetic} ${styles.benefitsKineticForeground}`} aria-hidden="true">
              <h2>
                <KineticPhrase text={copy.kinetic[0]} />
                <KineticPhrase text={copy.kinetic[1]} />
              </h2>
            </header>

            <section className={styles.benefitsProof} aria-label={copy.strengths} data-benefits-proof>
              <p>
                <ScrubbedWords text={copy.proofEyebrow} start={.405} end={.445} />
              </p>
              <h3>
                <ScrubbedWords text={copy.proofTitle} start={.425} end={.49} />
              </h3>
              <ol className={styles.benefitsList}>
                {strengths.map((strength, index) => (
                  <li key={strength.number} data-benefit-item>
                    <span>✓</span>
                    <div>
                      <h4>
                        <ScrubbedWords
                          text={strength.title}
                          start={strengthRevealRanges[index].titleStart}
                          end={strengthRevealRanges[index].titleEnd}
                        />
                      </h4>
                      <p>
                        <ScrubbedWords
                          text={strength.text}
                          start={strengthRevealRanges[index].textStart}
                          end={strengthRevealRanges[index].textEnd}
                        />
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className={styles.benefitsRail} aria-hidden="true">
              <span>{copy.approach}</span>
              <i><b /></i>
            </div>
          </div>
        </section>

        <section className={styles.closingCta} ref={closingCtaRef} aria-labelledby="closing-cta-title">
          <div className={styles.closingCtaShell}>
            <header className={styles.closingCtaIntro}>
              <p className={styles.closingCtaEyebrow}>
                <span>04</span>
                <span>{copy.ctaEyebrow}</span>
              </p>
              <h2 id="closing-cta-title">
                {copy.ctaTitle}
                <span>{copy.ctaTitleAccent}</span>
              </h2>
              <p className={styles.closingCtaLead}>
                {copy.ctaLead}
              </p>
            </header>

            <div className={styles.closingCtaContact}>
              <div className={styles.closingCtaDefault} aria-hidden="true">
                <span className={styles.closingCtaArrow}>↗</span>
                <span>{copy.talk}</span>
              </div>

              <div className={styles.closingCtaReveal}>
                <a
                  className={styles.closingCtaEmail}
                  href={`mailto:${contactEmail}?subject=${encodeURIComponent(shared.contactSubject)}`}
                >
                  {contactEmail}
                </a>
                <button className={styles.closingCtaCopy} type="button" onClick={handleCopyEmail}>
                  <span aria-live="polite">{emailCopied ? copy.copied : copy.copy}</span>
                  <span aria-hidden="true">{emailCopied ? "✓" : "+"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.siteFooter} aria-labelledby="footer-title" ref={footerRef} data-animation-active="false">
        <div className={styles.footerGraphic} aria-hidden="true">
          <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
            <path d="M-80 760C260 740 170 250 510 282C840 313 790 690 1085 625C1370 562 1270 104 1680 156" />
            <circle cx="510" cy="282" r="11" />
            <circle cx="1085" cy="625" r="11" />
          </svg>
          <span /><span /><span />
        </div>

        <div className={styles.footerTopline}>
          <p><span>05</span> {copy.footerEyebrow}</p>
          <BrandMark />
        </div>

        <div className={styles.footerStatement}>
          <p>{copy.footerThanks}</p>
          <h2 id="footer-title">
            <span>{copy.footerTitle[0]}</span>
            <span>{copy.footerTitle[1]}</span>
          </h2>
        </div>

        <nav className={styles.footerNav} aria-label={copy.footerNav}>
          <a href="#contenido">
            <span>01</span>
            <strong>{shared.home}</strong>
            <i aria-hidden="true">↑</i>
          </a>
          <Link href={getV2Path(locale, "projects")}>
            <span>02</span>
            <strong>{shared.projects}</strong>
            <i aria-hidden="true">↗</i>
          </Link>
          <Link href={getV2Path(locale, "about")}>
            <span>03</span>
            <strong>{shared.about}</strong>
            <i aria-hidden="true">↗</i>
          </Link>
        </nav>

        <p className={styles.footerName} aria-label="Alejandro Fink">
          <span>Alejandro</span>
          <span>Fink</span>
        </p>

        <div className={styles.footerBottomline}>
          <p>{copy.designed}</p>
          <p>{copy.location}</p>
          <div className={styles.footerUtilities}>
            <Link href={v2PrivacyRoutes[locale]}>{shared.privacy}</Link>
            <a href="#contenido">{shared.backTop} <span aria-hidden="true">↑</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
