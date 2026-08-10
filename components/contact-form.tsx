"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { validateContactPayload, type ContactInquiry, type ContactValidationErrors } from "@/lib/contact";

const initialForm: Omit<ContactInquiry, "locale"> = { name: "", company: "", email: "", website: "", need: "business-site", stage: "starting", message: "" };

function createSubmissionId() {
  return crypto.randomUUID();
}

export function ContactForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = siteCopy[locale].contact;
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const startedAt = useRef(0);
  const submissionId = useRef<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const errorLabel = (field: keyof ContactValidationErrors) => {
    const labels = locale === "es"
      ? { name: "Ingresá al menos dos caracteres.", email: "Ingresá un email válido.", need: "Elegí una opción.", stage: "Elegí una situación.", message: "Contanos al menos 20 caracteres.", locale: "Idioma inválido.", company: "El nombre es demasiado largo.", website: "Ingresá una URL completa que empiece con http:// o https://." }
      : { name: "Enter at least two characters.", email: "Enter a valid email.", need: "Choose an option.", stage: "Choose a current situation.", message: "Share at least 20 characters.", locale: "Invalid language.", company: "The name is too long.", website: "Enter a complete URL starting with http:// or https://." };
    return labels[field];
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return;
    const botField = String(new FormData(event.currentTarget).get("contact_website_check") ?? "");
    const payload = { ...form, locale };
    const result = validateContactPayload(payload);
    if (!result.valid || !result.data) {
      setErrors(result.errors);
      setStatus("idle");
      trackEvent("contact_submit_error", { locale, reason: "validation" });
      return;
    }

    submissionId.current ??= createSubmissionId();
    setErrors({});
    setStatus("sending");
    trackEvent("contact_submit_attempt", { locale });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, submissionId: submissionId.current, startedAt: startedAt.current, botField }),
      });
      const responseBody = await response.json().catch(() => null) as { ok?: boolean } | null;
      if (!response.ok || responseBody?.ok !== true) throw new Error("provider");
      setStatus("success");
      setForm(initialForm);
      submissionId.current = null;
      startedAt.current = Date.now();
      event.currentTarget.reset();
      trackEvent("contact_submit_success", { locale });
    } catch {
      setStatus("error");
      trackEvent("contact_submit_error", { locale, reason: "provider" });
    }
  }

  const privacyHref = locale === "es" ? "/es/privacidad/" : "/en/privacy/";

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-describedby={!enabled ? "contact-disabled-note" : undefined}>
      <fieldset disabled={!enabled || status === "sending"}>
        <legend className="sr-only">{copy.title}</legend>
        <div className="form-grid">
          <label>
            <span>{copy.fields.name}</span>
            <input required minLength={2} maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name ? <small id="name-error" className="field-error">{errorLabel("name")}</small> : null}
          </label>
          <label>
            <span>{copy.fields.company}</span>
            <input maxLength={120} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} autoComplete="organization" />
          </label>
        </div>
        <div className="form-grid">
          <label>
            <span>{copy.fields.email}</span>
            <input required maxLength={160} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email ? <small id="email-error" className="field-error">{errorLabel("email")}</small> : null}
          </label>
          <label>
            <span>{copy.fields.website}</span>
            <input maxLength={500} type="url" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} autoComplete="url" placeholder={copy.placeholders.website} aria-invalid={Boolean(errors.website)} aria-describedby={errors.website ? "website-error" : undefined} />
            {errors.website ? <small id="website-error" className="field-error">{errorLabel("website")}</small> : null}
          </label>
        </div>
        <div className="form-grid">
          <label>
            <span>{copy.fields.need}</span>
            <select value={form.need} onChange={(event) => setForm({ ...form, need: event.target.value as ContactInquiry["need"] })}>
              {Object.entries(copy.needs).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            <span>{copy.fields.stage}</span>
            <select value={form.stage} onChange={(event) => setForm({ ...form, stage: event.target.value as ContactInquiry["stage"] })}>
              {Object.entries(copy.stages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <label>
          <span>{copy.fields.message}</span>
          <textarea required minLength={20} maxLength={3000} rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={copy.placeholders.message} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
          {errors.message ? <small id="message-error" className="field-error">{errorLabel("message")}</small> : null}
        </label>
        <label className="honeypot" aria-hidden="true">Leave blank<input name="contact_website_check" tabIndex={-1} autoComplete="off" /></label>
        <p className="form-privacy">{copy.privacy} <Link href={privacyHref}>{copy.privacyAction}</Link></p>
        <button className="button button--primary" type="submit">{status === "sending" ? "…" : copy.fields.submit}</button>
      </fieldset>
      {!enabled ? (
        <div className="form-disabled" id="contact-disabled-note" role="note">
          <span aria-hidden="true">{copy.disabledKicker}</span>
          <strong>{copy.disabledTitle}</strong>
          <p>{copy.disabledText}</p>
          <small>{copy.disabledAction}</small>
        </div>
      ) : null}
      <div className="form-status" aria-live="polite">
        {status === "success" ? copy.success : null}
        {status === "error" ? copy.providerError : null}
      </div>
    </form>
  );
}
