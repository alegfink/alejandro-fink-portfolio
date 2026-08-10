import type { Locale } from "@/lib/i18n";
import { publicContactEmail, siteCopy } from "@/content/site";
import { ContactForm } from "@/components/contact-form";

export function ContactView({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = siteCopy[locale];
  return (
    <main id="main-content">
      <section className="page-hero shell"><p className="eyebrow">{copy.contact.eyebrow}</p><h1>{copy.contact.title}</h1><p>{copy.contact.intro}</p></section>
      <section className="contact-direct shell" aria-labelledby="contact-direct-title">
        <div>
          <p className="eyebrow">{copy.contact.directEyebrow}</p>
          <h2 id="contact-direct-title">{copy.contact.directTitle}</h2>
        </div>
        <div className="contact-direct__action">
          <p>{copy.contact.directText}</p>
          <a className="button button--primary" href={`mailto:${publicContactEmail}`} aria-label={`${copy.contact.directAction}: ${publicContactEmail}`}>
            <span>{copy.contact.directAction}</span>
            <strong>{publicContactEmail}</strong>
          </a>
        </div>
      </section>
      <section className="contact-layout shell section">
        <aside><p className="eyebrow">{copy.contact.fitTitle}</p><ul className="check-list">{copy.contact.fit.map((item) => <li key={item}>{item}</li>)}</ul><div className="contact-note"><span>{copy.contact.statusLabel}</span><strong>{enabled ? copy.contact.enabledStatus : copy.contact.disabledStatus}</strong></div></aside>
        <div className="contact-form-wrap">
          <p className="eyebrow">{copy.contact.formEyebrow}</p>
          <ContactForm locale={locale} enabled={enabled} />
        </div>
      </section>
    </main>
  );
}
