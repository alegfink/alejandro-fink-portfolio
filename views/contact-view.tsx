import type { Locale } from "@/lib/i18n";
import { publicContactEmail, siteCopy } from "@/content/site";
import { ContactForm } from "@/components/contact-form";
import { TrackedLink } from "@/components/tracked-link";

export function ContactView({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = siteCopy[locale];
  const emailQuery = new URLSearchParams({
    subject: copy.contact.directSubject,
    body: copy.contact.directBody,
  });
  const gmailQuery = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: publicContactEmail,
    su: copy.contact.directSubject,
    body: copy.contact.directBody,
  });
  const gmailHref = `https://mail.google.com/mail/?${gmailQuery.toString()}`;
  const emailHref = `mailto:${publicContactEmail}?${emailQuery.toString()}`;
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
          <div className="contact-direct__channels">
            <TrackedLink className="button button--primary" href={gmailHref} target="_blank" rel="noopener noreferrer" aria-label={`${copy.contact.directAction}: ${publicContactEmail}`} eventName="contact_email_click" eventPayload={{ locale, method: "gmail", placement: "contact" }}>
              <span>{copy.contact.directAction}</span>
              <strong>GMAIL ↗</strong>
            </TrackedLink>
            <TrackedLink className="contact-direct__fallback" href={emailHref} aria-label={`${copy.contact.directFallbackAction}: ${publicContactEmail}`} eventName="contact_email_click" eventPayload={{ locale, method: "mailto", placement: "contact" }}>
              <span>{copy.contact.directFallbackAction}</span>
              <strong>{publicContactEmail}</strong>
            </TrackedLink>
          </div>
        </div>
      </section>
      <section className="contact-layout shell section" data-analytics-section="contact-diagnostic">
        <aside><p className="eyebrow">{copy.contact.fitTitle}</p><ul className="check-list">{copy.contact.fit.map((item) => <li key={item}>{item}</li>)}</ul><div className="contact-note"><span>{copy.contact.statusLabel}</span><strong>{enabled ? copy.contact.enabledStatus : copy.contact.disabledStatus}</strong></div></aside>
        <div className="contact-form-wrap">
          <p className="eyebrow">{copy.contact.formEyebrow}</p>
          <ContactForm locale={locale} enabled={enabled} />
        </div>
      </section>
    </main>
  );
}
