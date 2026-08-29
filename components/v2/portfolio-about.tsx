"use client";

import Image from "next/image";
import { NativeLink as Link } from "@/components/v2/native-link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/components/v2/portfolio-about.module.css";
import { usePageEntrance } from "@/components/v2/use-page-entrance";
import { V2LanguageSwitcher } from "@/components/v2/v2-language-switcher";
import { V2MobileMenu } from "@/components/v2/v2-mobile-menu";
import { V2ContactStrip } from "@/components/v2/v2-contact-strip";
import { V2TrackedContactLink } from "@/components/v2/v2-tracked-contact-link";
import type { Locale } from "@/lib/i18n";
import { getV2Path, gmailComposeUrl, v2PrivacyRoutes, v2SharedCopy } from "@/lib/v2-i18n";

const chaptersByLocale = { es: [
  {
    period: "2016—2018",
    label: "Sistemas",
    title: "Aprendí a traducir",
    body: "Como analista funcional y QA trabajé entre SAP, servicios web, documentación y equipos distribuidos. Ahí entendí que definir bien el problema importa tanto como ejecutar la solución.",
    evidence: "Accenture · análisis funcional & QA",
  },
  {
    period: "2019—2022",
    label: "Datos",
    title: "Entendí el costo del desorden",
    body: "En datos maestros SAP, una decisión pequeña podía propagarse por todo un sistema. Aprendí a buscar consistencia, documentar y pensar en las consecuencias antes de avanzar.",
    evidence: "Soychu · responsable de datos maestros SAP",
  },
  {
    period: "2022—2025",
    label: "Nuevos lenguajes",
    title: "Sumé técnica y criterio comercial",
    body: "La formación full stack me dio lenguaje para comprender lógica y requerimientos. La experiencia en ventas consultivas sumó otra pregunta: no sólo si algo funciona, sino si ayuda a decidir.",
    evidence: "Henry 2022 · experiencia comercial 2025",
  },
  {
    period: "2026—hoy",
    label: "Operación real",
    title: "Puse las decisiones a prueba",
    body: "Con Torvena dejé de mirar el e-commerce por partes. Marca, producto, catálogo, Shopify, campañas, atención, proveedores y logística conviven en una misma operación y cada decisión tiene consecuencias reales.",
    evidence: "Torvena · e-commerce propio en producción",
  },
], en: [
  { period: "2016—2018", label: "Systems", title: "I learned to translate", body: "As a functional analyst and QA, I worked across SAP, web services, documentation and distributed teams. I learned that defining the problem well matters as much as executing the solution.", evidence: "Accenture · functional analysis & QA" },
  { period: "2019—2022", label: "Data", title: "I understood the cost of disorder", body: "In SAP master data, a small decision could propagate through an entire system. I learned to seek consistency, document decisions and think through consequences before moving forward.", evidence: "Soychu · SAP master data lead" },
  { period: "2022—2025", label: "New languages", title: "I added technical and commercial judgment", body: "Full-stack training gave me the language to understand logic and requirements. Consultative sales added another question: not only whether something works, but whether it helps someone decide.", evidence: "Henry 2022 · commercial experience 2025" },
  { period: "2026—today", label: "Real operations", title: "I put decisions to the test", body: "With Torvena, I stopped looking at e-commerce in separate parts. Brand, product, catalog, Shopify, campaigns, support, suppliers and logistics coexist in one operation, and every decision has real consequences.", evidence: "Torvena · owned e-commerce business in production" },
] } as const;

const storyScenes = [
  {
    image: "/media/focus-profile-color-series/03-cobalto-camel.png",
    position: "28% center",
  },
  {
    image: "/media/focus-profile-series/01-negro-perfil.png",
    position: "62% center",
  },
] as const;

const currentWorkByLocale = { es: [
  {
    number: "01",
    eyebrow: "Negocio propio",
    title: "Torvena, laboratorio real",
    copy: "Un e-commerce donde la estrategia, la experiencia y la operación dejan de ser conceptos separados.",
  },
  {
    number: "02",
    eyebrow: "Proyectos digitales",
    title: "De la idea al producto",
    copy: "Sitios, MVPs y prototipos con estados explícitos, decisiones visibles y espacio para seguir midiendo.",
  },
  {
    number: "03",
    eyebrow: "Método de trabajo",
    title: "IA con criterio humano",
    copy: "Descompongo objetivos, distribuyo tareas, integro aportes y valido el resultado bajo mi responsabilidad.",
  },
], en: [
  { number: "01", eyebrow: "Owned business", title: "Torvena, a real laboratory", copy: "An e-commerce business where strategy, experience and operations stop being separate concepts." },
  { number: "02", eyebrow: "Digital projects", title: "From idea to product", copy: "Websites, MVPs and prototypes with explicit states, visible decisions and room for continued measurement." },
  { number: "03", eyebrow: "Working method", title: "AI with human judgment", copy: "I break down objectives, distribute tasks, integrate contributions and validate the outcome under my responsibility." },
] } as const;

const aboutPageCopy = {
  es: {
    meta: ["Acerca de · Alejandro Fink", "Buenos Aires · Argentina"], hero: ["Mi recorrido", "no fue lineal", "mi mirada tampoco"],
    intro: "Pasé por sistemas, datos, ventas, producto y operación. Hoy uso ese recorrido para conectar lo que suele trabajarse por separado.",
    storyEyebrow: "El hilo que une todo", storyTitle: <>No cambié de mundo<br />fui sumando capas</>, storyLead: "Cada etapa agregó una forma distinta de mirar el mismo problema: cómo hacer que una decisión avance sin perder contexto.", layer: "CAPA",
    presentEyebrow: "El presente", presentTitle: <>Lo que estoy<br />construyendo ahora</>, presentLead: "No es una lista cerrada. Es una práctica que combina negocio propio, proyectos para otros y un sistema de trabajo en evolución.",
    principleEyebrow: "Una forma honesta de trabajar", principleAside: <>Sin títulos inflados<br />sin resultados inventados</>, principleTitle: "No necesito saberlo todo",
    principleLead: "Necesito entender qué hay que resolver, cómo comprobarlo y cuándo sumar profundidad técnica.",
    principleBody: ["Trabajo con IA y especialistas para investigar, implementar y diagnosticar. Mi responsabilidad está en definir el resultado esperado, integrar las partes y validar que la solución funcione en el mundo real.", "No parto de una lista de tecnologías. Parto del problema, la audiencia, las restricciones y la próxima decisión que el negocio necesita habilitar."],
    ctaEyebrow: "Ahora conocés el recorrido", ctaTitle: "Veamos qué necesita avanzar", talk: "Hablemos", availability: "Disponible para proyectos y colaboraciones",
  },
  en: {
    meta: ["About · Alejandro Fink", "Buenos Aires · Argentina"], hero: ["My journey", "was not linear", "neither is my perspective"],
    intro: "I moved through systems, data, sales, product and operations. Today I use that journey to connect what is usually handled separately.",
    storyEyebrow: "The thread connecting it all", storyTitle: <>I did not change worlds<br />I kept adding layers</>, storyLead: "Each stage added a different way of looking at the same problem: how to move a decision forward without losing context.", layer: "LAYER",
    presentEyebrow: "The present", presentTitle: <>What I am<br />building now</>, presentLead: "It is not a closed list. It is a practice combining an owned business, projects for others and an evolving way of working.",
    principleEyebrow: "An honest way of working", principleAside: <>No inflated titles<br />no invented results</>, principleTitle: "I do not need to know everything",
    principleLead: "I need to understand what must be solved, how to verify it and when deeper technical expertise is needed.",
    principleBody: ["I work with AI and specialists to research, implement and diagnose. My responsibility is to define the expected outcome, integrate the parts and validate that the solution works in the real world.", "I do not start with a list of technologies. I start with the problem, the audience, the constraints and the next decision the business needs to enable."],
    ctaEyebrow: "Now you know the journey", ctaTitle: "Let's see what needs to move forward", talk: "Let's talk", availability: "Available for projects and collaborations",
  },
} as const;

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

export function PortfolioV2About({ locale = "es" }: Readonly<{ locale?: Locale }>) {
  const pageReady = usePageEntrance();
  const shared = v2SharedCopy[locale];
  const copy = aboutPageCopy[locale];
  const chapters = chaptersByLocale[locale];
  const currentWork = currentWorkByLocale[locale];
  const heroRef = useRef<HTMLElement | null>(null);
  const storyRef = useRef<HTMLElement | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const activeScene = activeChapter < 2 ? 0 : 1;

  useEffect(() => {
    const hero = heroRef.current;
    const story = storyRef.current;
    const steps = Array.from(document.querySelectorAll<HTMLElement>("[data-about-step]"));
    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-about-reveal]"));
    let frame = 0;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const updateProgress = () => {
      frame = 0;
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        hero.style.setProperty("--about-hero-progress", clamp(-rect.top / travel).toFixed(4));
      }
      if (story) {
        const rect = story.getBoundingClientRect();
        const travel = Math.max(1, rect.height - window.innerHeight);
        story.style.setProperty("--about-story-progress", clamp(-rect.top / travel).toFixed(4));
      }
    };

    const scheduleProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    const stepObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const index = Number((visible?.target as HTMLElement | undefined)?.dataset.aboutStep);
      if (Number.isFinite(index)) setActiveChapter(index);
    }, { rootMargin: "-28% 0px -46%", threshold: [0, .18, .45] });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.visible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10%", threshold: .08 });

    steps.forEach((step) => stepObserver.observe(step));
    reveals.forEach((item) => revealObserver.observe(item));
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    updateProgress();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      stepObserver.disconnect();
      revealObserver.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);
    };
  }, []);

  return (
    <div className={styles.page} data-page-ready={String(pageReady)} lang={locale}>
      <a className={styles.skipLink} href="#historia">{shared.skipAbout}</a>

      <header className={styles.header}>
        <Link className={`${styles.headerButton} ${styles.brand}`} href={getV2Path(locale, "home")} aria-label={`Alejandro Fink, ${shared.backJourney}`}>
          <BrandMark />
          <HeaderWord>Alejandro Fink</HeaderWord>
        </Link>

        <nav className={styles.headerNav} aria-label={shared.mainNav}>
          <Link className={styles.headerButton} href={getV2Path(locale, "projects")} aria-label={shared.projects}>
            <HeaderWord>{shared.projects}</HeaderWord>
          </Link>
          <Link className={`${styles.headerButton} ${styles.headerButtonActive}`} href={getV2Path(locale, "about")} aria-current="page" aria-label={shared.about}>
            <HeaderWord>{shared.about}</HeaderWord>
          </Link>
          <V2LanguageSwitcher locale={locale} page="about" />
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
        <V2MobileMenu locale={locale} page="about" />
      </header>

      <div className={styles.topDiffuser} aria-hidden="true" />

      <main>
        <section
          className={styles.hero}
          data-analytics-section="about_hero"
          ref={heroRef}
          style={{ "--about-hero-progress": "0" } as CSSProperties}
          aria-labelledby="about-title"
        >
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.heroMeta}>
            <p>{copy.meta[0]}</p>
            <p>{copy.meta[1]}</p>
          </div>

          <div className={styles.heroPortrait} aria-hidden="true">
            <Image
              src="/media/focus-profile-color-series/01-crema-negro.png"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <span />
          </div>

          <h1 id="about-title" className={styles.heroTitle}>
            <span>{copy.hero[0]}</span>
            <span>{copy.hero[1]}</span>
            <span>{copy.hero[2]}</span>
          </h1>

          <div className={styles.heroIntro}>
            <span>↓</span>
            <p>{copy.intro}</p>
          </div>
        </section>

        <section
          className={styles.story}
          data-analytics-section="about_story"
          id="historia"
          ref={storyRef}
          style={{ "--about-story-progress": "0" } as CSSProperties}
          aria-labelledby="story-title"
        >
          <header className={styles.storyIntro} data-about-reveal>
            <p><span>01</span> {copy.storyEyebrow}</p>
            <h2 id="story-title">{copy.storyTitle}</h2>
            <p>{copy.storyLead}</p>
          </header>

          <div className={styles.storyLayout}>
            <div className={styles.storyMediaColumn} aria-hidden="true">
              <div className={styles.storyMediaSticky}>
                {storyScenes.map((scene, index) => (
                  <div className={`${styles.storyMedia} ${activeScene === index ? styles.storyMediaActive : ""}`} key={scene.image}>
                    <Image src={scene.image} alt="" fill sizes="100vw" style={{ objectPosition: scene.position }} />
                  </div>
                ))}
                <div className={styles.storyMediaOverlay} />
                <p><span>{copy.layer}</span><strong>0{activeChapter + 1}</strong></p>
                <div className={styles.storyProgress}><span /></div>
              </div>
            </div>

            <div className={styles.storySteps}>
              {chapters.map((chapter, index) => (
                <article
                  className={`${styles.storyStep} ${activeChapter === index ? styles.storyStepActive : ""}`}
                  data-about-step={index}
                  key={chapter.period}
                >
                  <p className={styles.storyStepMeta}><span>{chapter.period}</span><span>{chapter.label}</span></p>
                  <h3>{chapter.title}</h3>
                  <p className={styles.storyStepBody}>{chapter.body}</p>
                  <p className={styles.storyStepEvidence}>{chapter.evidence}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.present} aria-labelledby="present-title" data-analytics-section="about_present">
          <header className={styles.presentHeader} data-about-reveal>
            <p><span>02</span> {copy.presentEyebrow}</p>
            <h2 id="present-title">{copy.presentTitle}</h2>
            <p>{copy.presentLead}</p>
          </header>

          <ol className={styles.presentGrid}>
            {currentWork.map((item) => (
              <li key={item.number} data-about-reveal>
                <p><span>{item.number}</span>{item.eyebrow}</p>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <i aria-hidden="true">↘</i>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.principle} aria-labelledby="principle-title" data-analytics-section="about_principle">
          <div className={styles.principleLabel} data-about-reveal>
            <p><span>03</span> {copy.principleEyebrow}</p>
            <p>{copy.principleAside}</p>
          </div>
          <div className={styles.principleCopy} data-about-reveal>
            <h2 id="principle-title">{copy.principleTitle}</h2>
            <p>{copy.principleLead}</p>
            <div>
              <p>{copy.principleBody[0]}</p>
              <p>{copy.principleBody[1]}</p>
            </div>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="about-cta-title" data-analytics-section="about_contact">
          <div className={styles.ctaShell} data-about-reveal>
            <p><span>04</span> {copy.ctaEyebrow}</p>
            <h2 id="about-cta-title">{copy.ctaTitle}</h2>
            <V2TrackedContactLink channel="mailto" href={`mailto:alegfink@gmail.com?subject=${encodeURIComponent(shared.contactSubject)}`} locale={locale} placement="about">
              <span className={styles.ctaArrow} aria-hidden="true">↗</span>
              <span className={styles.ctaWords}>
                <strong>{copy.talk}</strong>
                <strong>alegfink@gmail.com</strong>
              </span>
              <i>{copy.availability}</i>
            </V2TrackedContactLink>
          </div>
        </section>
      </main>

      <V2ContactStrip locale={locale} />

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
          <a href="#about-title">{shared.backTop} ↑</a>
        </div>
      </footer>
    </div>
  );
}
