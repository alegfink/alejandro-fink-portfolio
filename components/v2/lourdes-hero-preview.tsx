import Image from "next/image";
import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import styles from "@/components/v2/lourdes-hero-preview.module.css";

const heroSlides = [
  { src: "/media/projects/lourdes-mirada/work-04.jpg", position: "center 58%" },
  { src: "/media/projects/lourdes-mirada/work-06.jpg", position: "center 45%" },
  { src: "/media/projects/lourdes-mirada/work-09.jpg", position: "center 66%" },
  { src: "/media/projects/lourdes-mirada/work-12.jpg", position: "center 55%" },
] as const;

const copy = {
  es: {
    label: "Fotografía · contenido · dirección visual",
    title: "Historias que se sienten",
    accent: "como recuerdos.",
    lead: "Imágenes honestas para personas y marcas que quieren mostrar lo que son, no solamente lo que hacen.",
    work: "Trabajo",
    about: "Sobre mí",
    contact: "Contacto",
    stories: "Ver historias",
    location: "Buenos Aires · Argentina",
    discover: "Descubrí mi mirada",
    available: "Disponible para proyectos",
    aria: "Hero de Lourdes Mirada con una selección de fotografías que rota automáticamente",
  },
  en: {
    label: "Photography · content · visual direction",
    title: "Stories that feel",
    accent: "like memories.",
    lead: "Honest images for people and brands that want to show who they are, not only what they do.",
    work: "Work",
    about: "About",
    contact: "Contact",
    stories: "View stories",
    location: "Buenos Aires · Argentina",
    discover: "Discover my perspective",
    available: "Available for projects",
    aria: "Lourdes Mirada hero with an automatically rotating selection of photographs",
  },
} as const;

export function LourdesHeroPreview({ locale }: Readonly<{ locale: Locale }>) {
  const text = copy[locale];

  return (
    <div className={styles.root} role="img" aria-label={text.aria} data-lourdes-hero-preview>
      <div className={styles.slides} aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <Image
            key={slide.src}
            className={styles.slide}
            src={slide.src}
            alt=""
            fill
            sizes="(max-width: 760px) 92vw, 64vw"
            style={{
              "--lourdes-slide-delay": `${index * 7}s`,
              objectPosition: slide.position,
            } as CSSProperties}
          />
        ))}
        <span className={styles.shade} />
        <span className={styles.grain} />
      </div>

      <div className={styles.interface} aria-hidden="true">
        <div className={styles.topbar}>
          <span className={styles.brand}>lourdes<span>.</span></span>
          <span className={styles.nav}>{text.work}&nbsp;&nbsp;&nbsp; {text.about}&nbsp;&nbsp;&nbsp; {text.contact}</span>
        </div>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>{text.label}</span>
          <strong>{text.title}</strong>
          <em>{text.accent}</em>
          <p>{text.lead}</p>
          <div className={styles.actions}>
            <span>{text.stories}　↘</span>
            <span>Instagram　↗</span>
          </div>
        </div>

        <div className={styles.footer}>
          <span>{text.location}</span>
          <span>{text.discover}　↙</span>
          <span>{text.available}</span>
        </div>
      </div>
    </div>
  );
}
