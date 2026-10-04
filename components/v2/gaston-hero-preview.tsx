"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "./gaston-hero-preview.module.css";

const scenes = [
  { src: "/media/projects/gaston-coronel/hero-scene.webp", line: "Hay decisiones que cambian mucho más que un papel", position: "52% 42%" },
  { src: "/media/projects/gaston-coronel/profile-scene.webp", line: "Primero, entender qué está pasando", position: "52% 42%" },
  { src: "/media/projects/gaston-coronel/dusk-scene.webp", line: "Después, ordenar lo que sigue", position: "50% 42%" },
] as const;

export function GastonHeroPreview({ locale }: Readonly<{ locale: Locale }>) {
  const root = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const update = () => setPlaying(visible && document.visibilityState === "visible");
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      update();
    }, { threshold: .05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={root} className={styles.root} data-gaston-hero-preview data-playing={playing} role="img"
      aria-label={locale === "es" ? "Hero de Gastón Coronel: tres escenas y sus textos en una secuencia animada" : "Gastón Coronel hero: three scenes and their text in an animated sequence"}>
      <div aria-hidden="true">
        {scenes.map((scene, index) => (
          <div className={styles.scene} key={scene.src} style={{ "--scene-delay": `${(index * 6 - 19.2).toFixed(1)}s` } as CSSProperties}>
            <Image src={scene.src} alt="" fill sizes="(max-width: 760px) 92vw, 64vw" style={{ objectPosition: scene.position }} />
            <span className={styles.wash} />
            <strong className={styles.line}>{scene.line}</strong>
          </div>
        ))}
        <div className={styles.interface}>
          <div className={styles.topbar}>
            <span className={styles.signature}><i>GC</i><span>Gastón Coronel<small>ABOGADO · CABA</small></span></span>
            <span className={styles.menu}>Recorrer la página ☰</span>
            <span className={styles.pill}>Contame tu situación ↗</span>
          </div>
          <span className={styles.kicker}>Derecho inmobiliario y sucesorio</span>
          <div className={styles.bottom}><p>Acompañamiento legal para decisiones y conflictos patrimoniales de la vida cotidiana.</p><span className={styles.pill}>Empezar una consulta ↗</span></div>
          <span className={styles.progress}>← <i /><i /><i /> →</span>
        </div>
      </div>
    </div>
  );
}
