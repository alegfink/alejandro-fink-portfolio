import type { Locale } from "@/lib/i18n";
import { routeNames } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { TrackedLink } from "@/components/tracked-link";

export function AboutView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content">
      <section className="page-hero page-hero--about shell"><p className="eyebrow">{copy.about.eyebrow}</p><h1>{copy.about.title}</h1><p className="page-hero__lead">{copy.about.lead}</p></section>
      <section className="about-story shell section" data-analytics-section="about-story">
        <div className="about-graphic" role="img" aria-label={copy.about.graphic.label}>
          <div className="about-graphic__meta"><span>{copy.about.graphic.kicker}</span><span>01—03</span></div>
          <div className="about-graphic__field" aria-hidden="true">
            <i /><i /><i />
            <div className="about-graphic__words">
              {copy.about.graphic.words.map((word, index) => <strong key={word}><span>0{index + 1}</span>{word}</strong>)}
            </div>
            <div className="about-graphic__core">AF</div>
          </div>
          <div className="about-graphic__outcome"><span>↳</span><strong>{copy.about.graphic.outcome}</strong></div>
        </div>
        <div className="about-story__copy">{copy.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>
      <section className="section section--ink" data-analytics-section="about-principles"><div className="shell about-principles"><div><p className="eyebrow">{copy.about.principlesTitle}</p><h2>{locale === "es" ? "Cuatro criterios para elegir mejor." : "Four principles for better choices."}</h2></div><ol>{copy.about.principles.map((principle, index) => <li key={principle}><span>0{index + 1}</span><strong>{principle}</strong></li>)}</ol></div></section>
      <section className="section shell about-collaboration" data-analytics-section="about-contact"><p className="eyebrow">{copy.about.collaborationTitle}</p><h2>{copy.about.collaborationText}</h2><TrackedLink className="button button--primary" href={routeNames[locale].contact} eventName="contact_cta" eventPayload={{ locale, placement: "about" }}>{copy.common.contact}</TrackedLink></section>
    </main>
  );
}
