"use client";

import Image from "next/image";
import { NativeLink as Link } from "@/components/v2/native-link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import styles from "@/components/v2/hero-lab.module.css";
import type { Locale } from "@/lib/i18n";
import { getV2Path } from "@/lib/v2-i18n";

const concepts = [
  {
    id: "pulse",
    number: "01",
    label: "Pulso cromático",
    description: "Neón intermitente, estela orgánica y una composición cercana al primer impacto.",
  },
  {
    id: "echo",
    number: "02",
    label: "Eco tipográfico",
    description: "La palabra se desdobla y responde a la posición global del cursor.",
  },
  {
    id: "slice",
    number: "03",
    label: "Corte cinético",
    description: "Capas tipográficas opuestas, barrido vertical y un cursor de precisión.",
  },
] as const;

type Variant = "pulse" | "echo" | "slice";

const publicHeroCopy = {
  es: {
    lead: "CREO",
    experience: "EXPERIENCIAS",
    action: "QUE HACEN AVANZAR",
    result: "EL NEGOCIO",
    eyebrow: "Convierto contexto en dirección",
    areas: "Áreas de trabajo",
    meta: ["E-commerce & Digital Operations", "Producto · UX · Operaciones", "Buenos Aires, AR"],
    signals: ["Recorrido", "Selección", "Enfoque"],
    footer: "Ordeno la decisión, diseño el recorrido y acompaño una implementación que pueda sostenerse",
    presentation: "Presentación de Alejandro Fink",
    goTo: "ir a la sección correspondiente",
  },
  en: {
    lead: "I CREATE",
    experience: "EXPERIENCES",
    action: "THAT MOVE",
    result: "BUSINESS FORWARD",
    eyebrow: "I turn context into direction",
    areas: "Areas of work",
    meta: ["E-commerce & Digital Operations", "Product · UX · Operations", "Buenos Aires, AR"],
    signals: ["Journey", "Work", "Approach"],
    footer: "I organize the decision, design the journey and support implementation that can last",
    presentation: "Alejandro Fink introduction",
    goTo: "go to the corresponding section",
  },
} as const;

const heroStyle = (active: boolean): CSSProperties => ({
  visibility: active ? "visible" : "hidden",
  pointerEvents: active ? "auto" : "none",
});

function VariantCursor({ variant }: Readonly<{ variant: Variant }>) {
  const variantClass = variant === "pulse"
    ? styles.cursorPulse
    : variant === "echo"
      ? styles.cursorEcho
      : styles.cursorSlice;

  return (
    <div className={`${styles.variantCursor} ${variantClass}`} aria-hidden="true">
      <span className={styles.cursorShape} />
      <span className={styles.cursorCore} />
      {variant === "pulse" && <><i /><i /><i /><i /><i /><i /></>}
      {variant === "echo" && <span className={styles.cursorAxes} />}
      {variant === "slice" && <span className={styles.cursorBeam} />}
    </div>
  );
}

function CinematicTitle({ variant, neonActive = false, locale = "es" }: Readonly<{ variant: Variant; neonActive?: boolean; locale?: Locale }>) {
  const copy = publicHeroCopy[locale];
  const experienceClass = variant === "pulse"
    ? styles.experiencePulse
    : variant === "echo"
      ? styles.experienceEcho
      : styles.experienceSlice;

  return (
    <h1>
      <span className={styles.cinematicLeadLine}>
        <span>{copy.lead}</span>{" "}
        {variant === "pulse" ? (
          <span
            className={`${styles.experienceWord} ${experienceClass} ${neonActive ? styles.neonFlicker : ""}`}
            aria-label={copy.experience}
          >
            {[...copy.experience].map((letter, index) => (
              <span className={styles.neonLetter} aria-hidden="true" key={`${letter}-${index}`}>{letter}</span>
            ))}
          </span>
        ) : (
          <span className={`${styles.experienceWord} ${experienceClass}`} data-text={copy.experience}>{copy.experience}</span>
        )}
      </span>
      <span className={styles.cinematicActionLine}>
        <span>{copy.action}</span>
      </span>
      <span className={styles.cinematicResultLine}>
        <span>{copy.result}</span>
      </span>
    </h1>
  );
}

export function HeroLab({ standalone = false, entryReady = true, locale = "es" }: Readonly<{ standalone?: boolean; entryReady?: boolean; locale?: Locale }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [neonActive, setNeonActive] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const neonIdleTimerRef = useRef<number | null>(null);
  const signalMagnetRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastPointerSampleRef = useRef({ x: 0, y: 0, time: 0 });
  const activeConcept = concepts[activeIndex];
  const publicCopy = publicHeroCopy[locale];
  const signalLinks = publicCopy.signals.map((label, index) => ({
    number: String(index + 1).padStart(2, "0"),
    label,
    href: `${getV2Path(locale, "home")}#${["recorrido", "proyectos", "enfoque"][index]}`,
  }));

  useEffect(() => () => {
    if (neonIdleTimerRef.current !== null) window.clearTimeout(neonIdleTimerRef.current);
  }, []);

  useEffect(() => {
    if (!standalone) return;
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.animationActive = String(Boolean(entry?.isIntersecting));
    }, { rootMargin: "120px 0px", threshold: 0.01 });

    observer.observe(root);
    return () => observer.disconnect();
  }, [standalone]);

  const resetSignalMagnets = (duration = 260) => {
    signalMagnetRefs.current.forEach((magnet) => {
      if (!magnet) return;
      magnet.style.setProperty("--magnet-x", "0px");
      magnet.style.setProperty("--magnet-y", "0px");
      magnet.style.setProperty("--magnet-duration", `${duration}ms`);
    });
    lastPointerSampleRef.current.time = 0;
  };

  const updateSignalMagnets = (event: PointerEvent<HTMLElement>) => {
    const now = performance.now();
    const last = lastPointerSampleRef.current;
    const elapsed = last.time > 0 ? Math.max(8, now - last.time) : 16;
    const pointerDistance = last.time > 0 ? Math.hypot(event.clientX - last.x, event.clientY - last.y) : 0;
    const pointerSpeed = pointerDistance / elapsed;
    lastPointerSampleRef.current = { x: event.clientX, y: event.clientY, time: now };

    signalMagnetRefs.current.forEach((magnet) => {
      if (!magnet) return;
      const currentX = Number.parseFloat(magnet.style.getPropertyValue("--magnet-x")) || 0;
      const currentY = Number.parseFloat(magnet.style.getPropertyValue("--magnet-y")) || 0;
      const rect = magnet.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - currentX;
      const centerY = rect.top + rect.height / 2 - currentY;
      const deltaX = event.clientX - centerX;
      const deltaY = event.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);
      const radius = 210;
      const proximity = Math.max(0, 1 - distance / radius);

      if (proximity > 0) {
        const pull = Math.pow(proximity, 1.15) * .3;
        const targetX = Math.max(-22, Math.min(22, deltaX * pull));
        const targetY = Math.max(-16, Math.min(16, deltaY * pull));
        const trackingDuration = Math.round(Math.max(130, 250 - pointerSpeed * 54));
        magnet.style.setProperty("--magnet-x", `${targetX.toFixed(2)}px`);
        magnet.style.setProperty("--magnet-y", `${targetY.toFixed(2)}px`);
        magnet.style.setProperty("--magnet-duration", `${trackingDuration}ms`);
        return;
      }

      const releaseDuration = Math.round(Math.max(140, 620 - pointerSpeed * 210));
      magnet.style.setProperty("--magnet-x", "0px");
      magnet.style.setProperty("--magnet-y", "0px");
      magnet.style.setProperty("--magnet-duration", `${releaseDuration}ms`);
    });
  };

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    const root = rootRef.current;
    if (!root) return;

    if (activeIndex === 0 && event.pointerType !== "touch") {
      setNeonActive(true);
      updateSignalMagnets(event);
      if (neonIdleTimerRef.current !== null) window.clearTimeout(neonIdleTimerRef.current);
      neonIdleTimerRef.current = window.setTimeout(() => setNeonActive(false), 260);
    }

    const rect = root.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    root.style.setProperty("--pointer-x", `${x * 100}%`);
    root.style.setProperty("--pointer-y", `${y * 100}%`);
    root.style.setProperty("--shift-x", `${(x - 0.5) * 34}px`);
    root.style.setProperty("--shift-y", `${(y - 0.5) * 24}px`);
    root.style.setProperty("--shift-x-reverse", `${(0.5 - x) * 24}px`);
    root.style.setProperty("--shift-y-reverse", `${(0.5 - y) * 18}px`);
    root.style.setProperty("--word-shift-x", `${(x - 0.5) * 12}px`);
    root.style.setProperty("--word-shift-y", `${(y - 0.5) * 8}px`);
    root.style.setProperty("--word-shift-x-reverse", `${(0.5 - x) * 12}px`);
    root.style.setProperty("--word-shift-y-reverse", `${(0.5 - y) * 8}px`);

    const stage = stageRef.current;
    if (stage) {
      const stageRect = stage.getBoundingClientRect();
      root.style.setProperty("--hero-pointer-x", `${event.clientX - stageRect.left}px`);
      root.style.setProperty("--hero-pointer-y", `${event.clientY - stageRect.top}px`);
    }
  };

  const resetPointer = () => {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty("--pointer-x", "58%");
    root.style.setProperty("--pointer-y", "48%");
    root.style.setProperty("--shift-x", "0px");
    root.style.setProperty("--shift-y", "0px");
    root.style.setProperty("--shift-x-reverse", "0px");
    root.style.setProperty("--shift-y-reverse", "0px");
    root.style.setProperty("--word-shift-x", "0px");
    root.style.setProperty("--word-shift-y", "0px");
    root.style.setProperty("--word-shift-x-reverse", "0px");
    root.style.setProperty("--word-shift-y-reverse", "0px");
    root.style.setProperty("--hero-pointer-x", "58%");
    root.style.setProperty("--hero-pointer-y", "48%");
    if (neonIdleTimerRef.current !== null) window.clearTimeout(neonIdleTimerRef.current);
    neonIdleTimerRef.current = null;
    setNeonActive(false);
    resetSignalMagnets();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % concepts.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + concepts.length) % concepts.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = concepts.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveIndex(nextIndex);
    document.getElementById(`hero-tab-${concepts[nextIndex].id}`)?.focus();
  };

  return (
    <section
      ref={rootRef}
      className={`${styles.lab} ${standalone ? styles.standaloneLab : ""}`}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      lang={locale}
      data-entry-ready={standalone ? String(entryReady) : undefined}
      data-animation-active={standalone ? "true" : undefined}
      aria-label={standalone ? publicCopy.presentation : "Laboratorio de héroes del Portfolio V2"}
      style={{
        "--pointer-x": "58%",
        "--pointer-y": "48%",
        "--shift-x": "0px",
        "--shift-y": "0px",
        "--shift-x-reverse": "0px",
        "--shift-y-reverse": "0px",
        "--word-shift-x": "0px",
        "--word-shift-y": "0px",
        "--word-shift-x-reverse": "0px",
        "--word-shift-y-reverse": "0px",
        "--hero-pointer-x": "58%",
        "--hero-pointer-y": "48%",
      } as CSSProperties}
    >
      {!standalone && <header className={styles.labBar}>
        <div className={styles.labIdentity}>
          <span className={styles.labMark}>A</span>
          <div>
            <strong>Alejandro Fink · Portfolio V2</strong>
            <span>Tres direcciones cinematográficas</span>
          </div>
        </div>

        <div className={styles.conceptSummary} aria-live="polite">
          <span>{activeConcept.number} / {concepts.length.toString().padStart(2, "0")}</span>
          <strong>{activeConcept.label}</strong>
          <small>{activeConcept.description}</small>
        </div>

        <nav className={styles.tabs} role="tablist" aria-label="Variantes de Impacto cinematográfico">
          {concepts.map((concept, index) => (
            <button
              id={`hero-tab-${concept.id}`}
              key={concept.id}
              type="button"
              role="tab"
              aria-label={`${concept.number} ${concept.label}`}
              aria-selected={activeIndex === index}
              aria-controls={`hero-panel-${concept.id}`}
              tabIndex={activeIndex === index ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              <span>{concept.number}</span>
              <b>{concept.label}</b>
            </button>
          ))}
        </nav>
      </header>}

      <section ref={stageRef} className={`${styles.stage} ${standalone ? styles.standaloneStage : ""}`} aria-label={standalone ? "Hero principal" : "Vista previa de la variante seleccionada"}>
        <article
          id="hero-panel-pulse"
          role={standalone ? undefined : "tabpanel"}
          aria-labelledby={standalone ? undefined : "hero-tab-pulse"}
          aria-hidden={standalone ? undefined : activeIndex !== 0}
          className={`${styles.hero} ${styles.cinematic} ${styles.variantPulse} ${standalone || activeIndex === 0 ? styles.active : ""}`}
          style={heroStyle(standalone || activeIndex === 0)}
        >
          <div className={styles.cinematicNoise} aria-hidden="true" />
          <div className={styles.cinematicGlow} aria-hidden="true" />
          <VariantCursor variant="pulse" />
          <div className={styles.cinematicPortrait} aria-hidden="true">
            <Image
              src="/media/v2/cinematic-portrait.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              data-loader-critical-hero={standalone ? "true" : undefined}
            />
          </div>
          <div className={styles.cinematicMeta}>
            <span>{standalone ? publicCopy.meta[0] : "Alejandro Fink"}</span>
            <span>{standalone ? publicCopy.meta[1] : "Producto · UX · Operaciones"}</span>
            <span>{publicCopy.meta[2]}</span>
          </div>
          <div className={styles.cinematicCopy}>
            <p>{publicCopy.eyebrow}</p>
            <CinematicTitle variant="pulse" neonActive={neonActive} locale={locale} />
          </div>
          <div className={`${styles.cinematicSignals} ${neonActive ? styles.signalsAwake : ""}`} aria-label={publicCopy.areas}>
            {signalLinks.map((signal, index) => (
              <div
                className={styles.signalMagnet}
                key={signal.label}
                ref={(node) => { signalMagnetRefs.current[index] = node; }}
              >
                <div className={styles.signalWakeShell}>
                  <Link
                    className={styles.signalLink}
                    href={signal.href}
                    aria-label={`${signal.label}: ${publicCopy.goTo}`}
                  >
                    <span className={styles.signalIndex} aria-hidden="true">{signal.number}</span>
                    <span className={styles.signalWordViewport} aria-hidden="true">
                      <span className={`${styles.signalWord} ${styles.signalWordCurrent}`}>{signal.label}</span>
                      <span className={`${styles.signalWord} ${styles.signalWordClone}`}>{signal.label}</span>
                    </span>
                    <span className={styles.signalArrow} aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.cinematicFooter}>
            <p>{publicCopy.footer}</p>
          </div>
        </article>

        {!standalone && <>
        <article
          id="hero-panel-echo"
          role="tabpanel"
          aria-labelledby="hero-tab-echo"
          aria-hidden={activeIndex !== 1}
          className={`${styles.hero} ${styles.cinematic} ${styles.variantEcho} ${activeIndex === 1 ? styles.active : ""}`}
          style={heroStyle(activeIndex === 1)}
        >
          <div className={styles.echoGrid} aria-hidden="true" />
          <div className={styles.echoHalo} aria-hidden="true" />
          <VariantCursor variant="echo" />
          <div className={`${styles.cinematicPortrait} ${styles.echoPortrait}`} aria-hidden="true">
            <Image src="/media/v2/cinematic-portrait.webp" alt="" fill sizes="100vw" />
          </div>
          <div className={styles.cinematicMeta}>
            <span>Alejandro Fink</span>
            <span>Negocio · Experiencia · Ejecución</span>
            <span>Portfolio / 2026</span>
          </div>
          <div className={`${styles.cinematicCopy} ${styles.echoCopy}`}>
            <p>Una decisión clara puede mover todo el sistema</p>
            <CinematicTitle variant="echo" />
          </div>
          <div className={styles.echoRail} aria-label="Capas del trabajo">
            <span><b>01</b> Entender</span>
            <span><b>02</b> Diseñar</span>
            <span><b>03</b> Implementar</span>
          </div>
          <div className={styles.cinematicFooter}>
            <p>La estrategia toma forma cuando el recorrido y la operación responden a la misma prioridad.</p>
          </div>
        </article>

        <article
          id="hero-panel-slice"
          role="tabpanel"
          aria-labelledby="hero-tab-slice"
          aria-hidden={activeIndex !== 2}
          className={`${styles.hero} ${styles.cinematic} ${styles.variantSlice} ${activeIndex === 2 ? styles.active : ""}`}
          style={heroStyle(activeIndex === 2)}
        >
          <div className={styles.sliceField} aria-hidden="true" />
          <div className={styles.sliceScan} aria-hidden="true" />
          <VariantCursor variant="slice" />
          <div className={`${styles.cinematicPortrait} ${styles.slicePortrait}`} aria-hidden="true">
            <Image src="/media/v2/cinematic-portrait.webp" alt="" fill sizes="100vw" />
          </div>
          <div className={styles.cinematicMeta}>
            <span>Alejandro Fink</span>
            <span>Experiencias digitales que funcionan</span>
            <span>Buenos Aires · Remoto</span>
          </div>
          <div className={`${styles.cinematicCopy} ${styles.sliceCopy}`}>
            <p>Del problema al próximo paso visible</p>
            <CinematicTitle variant="slice" />
          </div>
          <div className={styles.sliceIndex} aria-hidden="true">
            <span>NEGOCIO</span><span>EXPERIENCIA</span><span>OPERACIÓN</span>
          </div>
          <div className={styles.cinematicFooter}>
            <p>Ordeno la decisión, diseño el recorrido y acompaño una implementación que pueda sostenerse.</p>
          </div>
        </article>
        </>}
      </section>
    </section>
  );
}
