import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";

export function PrivacyView({ locale }: { locale: Locale }) {
  const copy = siteCopy[locale].privacy;
  return (
    <main id="main-content">
      <section className="page-hero shell"><p className="eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.updated}</p></section>
      <section className="legal-copy shell section">{copy.sections.map((section, index) => <article key={section.title}><span>0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></article>)}</section>
    </main>
  );
}
