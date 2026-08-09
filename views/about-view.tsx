import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { siteCopy } from "@/content/site";

export function AboutView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content">
      <section className="page-hero page-hero--about shell"><p className="eyebrow">{copy.about.eyebrow}</p><h1>{copy.about.title}</h1><p className="page-hero__lead">{copy.about.lead}</p></section>
      <section className="about-story shell section">
        <div className="about-portrait" aria-label={copy.about.photoNote}><span>AF</span><p>{copy.about.photoNote}</p></div>
        <div className="about-story__copy">{copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="section section--ink"><div className="shell about-principles"><div><p className="eyebrow">{copy.about.principlesTitle}</p><h2>{locale === "es" ? "Cuatro criterios para elegir mejor." : "Four principles for better choices."}</h2></div><ol>{copy.about.principles.map((principle, index) => <li key={principle}><span>0{index + 1}</span><strong>{principle}</strong></li>)}</ol></div></section>
      <section className="section shell about-collaboration"><p className="eyebrow">{copy.about.collaborationTitle}</p><h2>{copy.about.collaborationText}</h2><a className="button button--primary" href={routeNames[locale].contact}>{copy.common.contact}</a></section>
    </main>
  );
}
