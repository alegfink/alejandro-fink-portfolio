import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { ContactForm } from "@/components/contact-form";

export function ContactView({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content">
      <section className="page-hero shell"><p className="eyebrow">{copy.contact.eyebrow}</p><h1>{copy.contact.title}</h1><p>{copy.contact.intro}</p></section>
      <section className="contact-layout shell section">
        <aside><p className="eyebrow">{copy.contact.fitTitle}</p><ul className="check-list">{copy.contact.fit.map((item) => <li key={item}>{item}</li>)}</ul><div className="contact-note"><span>STATUS</span><strong>{enabled ? "READY" : "CONFIG REQUIRED"}</strong></div></aside>
        <ContactForm locale={locale} enabled={enabled} />
      </section>
    </main>
  );
}
