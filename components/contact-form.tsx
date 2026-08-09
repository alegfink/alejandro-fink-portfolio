"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { siteCopy } from "@/content/site";
import { trackEvent } from "@/lib/analytics";
import { validateContactPayload, type ContactPayload, type ContactValidationErrors } from "@/lib/contact";

const initialForm: Omit<ContactPayload, "locale"> = { name: "", company: "", email: "", need: "business-site", message: "" };

export function ContactForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = siteCopy[locale].contact;
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const errorLabel = (field: keyof ContactValidationErrors) => {
    const labels = locale === "es"
      ? { name: "Ingresá al menos dos caracteres.", email: "Ingresá un email válido.", need: "Elegí una opción.", message: "Contanos al menos 20 caracteres.", locale: "Idioma inválido.", company: "El nombre es demasiado largo." }
      : { name: "Enter at least two characters.", email: "Enter a valid email.", need: "Choose an option.", message: "Share at least 20 characters.", locale: "Invalid language.", company: "The name is too long." };
    return labels[field];
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled) return;
    const payload = { ...form, locale };
    const result = validateContactPayload(payload);
    if (!result.valid) {
      setErrors(result.errors);
      setStatus("idle");
      trackEvent("contact_submit_error", { locale, reason: "validation" });
      return;
    }

    setErrors({});
    setStatus("sending");
    trackEvent("contact_submit_attempt", { locale });
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      if (!response.ok) throw new Error("provider");
      setStatus("success");
      setForm(initialForm);
      trackEvent("contact_submit_success", { locale });
    } catch {
      setStatus("error");
      trackEvent("contact_submit_error", { locale, reason: "provider" });
    }
  }

  return (
    <form className="contact-form" onSubmit={submit} noValidate aria-describedby={!enabled ? "contact-disabled-note" : undefined}>
      <fieldset disabled={!enabled || status === "sending"}>
        <legend className="sr-only">{copy.title}</legend>
        <div className="form-grid">
          <label>
            <span>{copy.fields.name}</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name ? <small id="name-error" className="field-error">{errorLabel("name")}</small> : null}
          </label>
          <label>
            <span>{copy.fields.company}</span>
            <input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} autoComplete="organization" />
          </label>
        </div>
        <div className="form-grid">
          <label>
            <span>{copy.fields.email}</span>
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email ? <small id="email-error" className="field-error">{errorLabel("email")}</small> : null}
          </label>
          <label>
            <span>{copy.fields.need}</span>
            <select value={form.need} onChange={(event) => setForm({ ...form, need: event.target.value as ContactPayload["need"] })}>
              {Object.entries(copy.needs).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <label>
          <span>{copy.fields.message}</span>
          <textarea rows={7} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
          {errors.message ? <small id="message-error" className="field-error">{errorLabel("message")}</small> : null}
        </label>
        <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        <p className="form-privacy">{copy.privacy}</p>
        <button className="button button--primary" type="submit">{status === "sending" ? "…" : copy.fields.submit}</button>
      </fieldset>
      {!enabled ? (
        <div className="form-disabled" id="contact-disabled-note" role="note">
          <span aria-hidden="true">CONFIG / OFF</span>
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
