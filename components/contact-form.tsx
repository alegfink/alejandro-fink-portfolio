"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { contactIntakeCopy, contactOptions } from "@/content/contact-intake";
import { trackEvent } from "@/lib/analytics";
import { validateContactPayload, type ContactInquiry, type ContactValidationErrors } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";

const stepIds = ["goal", "stage", "challenges", "audience", "brand", "needs", "readiness", "contact", "context", "review"] as const;
type StepId = (typeof stepIds)[number];
type FormState = Omit<ContactInquiry, "locale">;

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  goal: "" as ContactInquiry["goal"],
  goalOther: "",
  stage: "" as ContactInquiry["stage"],
  challenges: [],
  challengeOther: "",
  audience: "",
  desiredAction: "" as ContactInquiry["desiredAction"],
  desiredActionOther: "",
  brandTraits: [],
  brandOther: "",
  needs: [],
  needOther: "",
  investment: "" as ContactInquiry["investment"],
  timeline: "" as ContactInquiry["timeline"],
  decisionStage: "" as ContactInquiry["decisionStage"],
  message: "",
};

type ChoiceProps = {
  name: string;
  options: readonly { value: string; label: string; hint?: string }[];
  selected: string | readonly string[];
  multiple?: boolean;
  max?: number;
  onChange: (value: string) => void;
};

function ChoiceList({ name, options, selected, multiple = false, max, onChange }: ChoiceProps) {
  const selectedValues = Array.isArray(selected) ? selected : [selected];
  return (
    <div className="wizard-choices">
      {options.map((option, index) => {
        const checked = selectedValues.includes(option.value);
        const disabled = Boolean(multiple && max && !checked && selectedValues.length >= max);
        return (
          <label className={`wizard-choice${checked ? " is-selected" : ""}${disabled ? " is-disabled" : ""}`} key={option.value}>
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option.value}
              checked={checked}
              disabled={disabled}
              onChange={() => onChange(option.value)}
            />
            <span className="wizard-choice__key" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
            <span className="wizard-choice__copy">
              <strong>{option.label}</strong>
              {option.hint ? <small>{option.hint}</small> : null}
            </span>
            <span className="wizard-choice__mark" aria-hidden="true">{multiple ? (checked ? "✓" : "+") : checked ? "●" : "○"}</span>
          </label>
        );
      })}
    </div>
  );
}

function createSubmissionId() {
  return crypto.randomUUID();
}

function isValidWebsite(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return (url.protocol === "http:" || url.protocol === "https:") && value.trim().length <= 500;
  } catch {
    return false;
  }
}

function joinLabels(options: readonly { value: string; label: string }[], values: readonly string[]) {
  return values.map((value) => options.find((option) => option.value === value)?.label ?? value).join(" · ");
}

export function ContactForm({ locale, enabled }: { locale: Locale; enabled: boolean }) {
  const copy = contactIntakeCopy[locale];
  const options = contactOptions[locale];
  const [form, setForm] = useState<FormState>(initialForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const startedAt = useRef(0);
  const submissionId = useRef<string | null>(null);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const currentStep = stepIds[stepIndex];
  const privacyHref = locale === "es" ? "/es/privacidad/" : "/en/privacy/";

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (stepIndex > 0) stepHeading.current?.focus();
  }, [stepIndex]);

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field as keyof ContactValidationErrors]) return current;
      const next = { ...current };
      delete next[field as keyof ContactValidationErrors];
      return next;
    });
    if (status === "error") setStatus("idle");
  }

  function toggleMulti<K extends "challenges" | "brandTraits" | "needs">(field: K, value: FormState[K][number]) {
    const current = form[field] as string[];
    const next = current.includes(value) ? current.filter((item) => item !== value) : current.length < 3 ? [...current, value] : current;
    update(field, next as FormState[K]);
  }

  function errorFor(field: keyof ContactValidationErrors) {
    const labels = copy.validation;
    if (field === "name") return labels.name;
    if (field === "email") return labels.email;
    if (field === "company") return labels.company;
    if (field === "website") return labels.website;
    if (field === "audience") return labels.audience;
    if (field === "message") return labels.message;
    if (String(field).toLowerCase().includes("other")) return labels.other;
    if (field === "challenges" || field === "brandTraits" || field === "needs") return labels.chooseBetween;
    return labels.chooseOne;
  }

  function validateStep(step: StepId) {
    const nextErrors: ContactValidationErrors = {};
    if (step === "goal") {
      if (!form.goal) nextErrors.goal = "required";
      if (form.goal === "other" && (form.goalOther ?? "").trim().length < 2) nextErrors.goalOther = "required";
    }
    if (step === "stage") {
      if (!form.stage) nextErrors.stage = "required";
      if (!isValidWebsite(form.website ?? "")) nextErrors.website = "invalid";
    }
    if (step === "challenges") {
      if (form.challenges.length < 1 || form.challenges.length > 3) nextErrors.challenges = "required";
      if (form.challenges.includes("other") && (form.challengeOther ?? "").trim().length < 2) nextErrors.challengeOther = "required";
    }
    if (step === "audience") {
      if (form.audience.trim().length < 10 || form.audience.trim().length > 400) nextErrors.audience = "invalid";
      if (!form.desiredAction) nextErrors.desiredAction = "required";
      if (form.desiredAction === "other" && (form.desiredActionOther ?? "").trim().length < 2) nextErrors.desiredActionOther = "required";
    }
    if (step === "brand") {
      if (form.brandTraits.length < 1 || form.brandTraits.length > 3) nextErrors.brandTraits = "required";
      if (form.brandTraits.includes("other") && (form.brandOther ?? "").trim().length < 2) nextErrors.brandOther = "required";
    }
    if (step === "needs") {
      if (form.needs.length < 1 || form.needs.length > 3) nextErrors.needs = "required";
      if (form.needs.includes("other") && (form.needOther ?? "").trim().length < 2) nextErrors.needOther = "required";
    }
    if (step === "readiness") {
      if (!form.investment) nextErrors.investment = "required";
      if (!form.timeline) nextErrors.timeline = "required";
      if (!form.decisionStage) nextErrors.decisionStage = "required";
    }
    if (step === "contact") {
      if (form.name.trim().length < 2 || form.name.trim().length > 80) nextErrors.name = "invalid";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) || form.email.trim().length > 160) nextErrors.email = "invalid";
      if ((form.company ?? "").trim().length > 120) nextErrors.company = "invalid";
    }
    if (step === "context" && (form.message.trim().length < 20 || form.message.trim().length > 3000)) nextErrors.message = "invalid";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function moveTo(index: number) {
    if (index < 0 || index >= stepIds.length) return;
    setDirection(index < stepIndex ? "back" : "forward");
    setErrors({});
    setStepIndex(index);
  }

  function next() {
    if (!validateStep(currentStep)) return;
    moveTo(stepIndex + 1);
  }

  function previous() {
    moveTo(stepIndex - 1);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep !== "review" || !enabled) return;
    const payload = { ...form, locale };
    const result = validateContactPayload(payload);
    if (!result.valid || !result.data) {
      setErrors(result.errors);
      const first = Object.keys(result.errors)[0] as keyof ContactValidationErrors | undefined;
      const fieldStep: Partial<Record<keyof ContactInquiry, number>> = {
        goal: 0, goalOther: 0, stage: 1, website: 1, challenges: 2, challengeOther: 2,
        audience: 3, desiredAction: 3, desiredActionOther: 3, brandTraits: 4, brandOther: 4,
        needs: 5, needOther: 5, investment: 6, timeline: 6, decisionStage: 6,
        name: 7, email: 7, company: 7, message: 8,
      };
      if (first && fieldStep[first] !== undefined) moveTo(fieldStep[first]);
      trackEvent("contact_submit_error", { locale, reason: "validation" });
      return;
    }

    const botField = String(new FormData(event.currentTarget).get("contact_website_check") ?? "");
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
      trackEvent("contact_submit_success", { locale });
    } catch {
      setStatus("error");
      trackEvent("contact_submit_error", { locale, reason: "provider" });
    }
  }

  function reset() {
    setForm(initialForm);
    setErrors({});
    setStatus("idle");
    submissionId.current = null;
    startedAt.current = Date.now();
    moveTo(0);
  }

  const goalLabel = options.goals.find((option) => option.value === form.goal)?.label ?? "—";
  const stageLabel = options.stages.find((option) => option.value === form.stage)?.label ?? "—";
  const actionLabel = options.actions.find((option) => option.value === form.desiredAction)?.label ?? "—";
  const investmentLabel = options.investments.find((option) => option.value === form.investment)?.label ?? "—";
  const timelineLabel = options.timelines.find((option) => option.value === form.timeline)?.label ?? "—";
  const decisionLabel = options.decisionStages.find((option) => option.value === form.decisionStage)?.label ?? "—";

  const reviewItems = [
    { key: "goal", step: 0, value: `${goalLabel}${form.goalOther ? ` — ${form.goalOther}` : ""}` },
    { key: "stage", step: 1, value: `${stageLabel}${form.website ? ` · ${form.website}` : ""}` },
    { key: "challenges", step: 2, value: `${joinLabels(options.challenges, form.challenges)}${form.challengeOther ? ` — ${form.challengeOther}` : ""}` },
    { key: "audience", step: 3, value: `${form.audience} · ${actionLabel}${form.desiredActionOther ? ` — ${form.desiredActionOther}` : ""}` },
    { key: "brand", step: 4, value: `${joinLabels(options.brandTraits, form.brandTraits)}${form.brandOther ? ` — ${form.brandOther}` : ""}` },
    { key: "needs", step: 5, value: `${joinLabels(options.needs, form.needs)}${form.needOther ? ` — ${form.needOther}` : ""}` },
    { key: "readiness", step: 6, value: `${investmentLabel} · ${timelineLabel} · ${decisionLabel}` },
    { key: "contact", step: 7, value: `${form.name} · ${form.email}${form.company ? ` · ${form.company}` : ""}` },
    { key: "context", step: 8, value: form.message },
  ] as const;

  if (status === "success") {
    return (
      <div className="contact-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>{locale === "es" ? "Diagnóstico recibido." : "Diagnostic received."}</h2>
        <p>{copy.success}</p>
        <button className="button button--secondary" type="button" onClick={reset}>{copy.startOver}</button>
      </div>
    );
  }

  const stepCopy = copy.steps[currentStep];
  const progress = ((stepIndex + 1) / stepIds.length) * 100;

  return (
    <form className="contact-form contact-wizard" onSubmit={submit} noValidate>
      <div className="wizard-progress" aria-label={`${copy.progress} ${stepIndex + 1} ${copy.of} ${stepIds.length}`}>
        <div className="wizard-progress__meta">
          <span>{copy.progress} {String(stepIndex + 1).padStart(2, "0")}</span>
          <span>{String(stepIds.length).padStart(2, "0")}</span>
        </div>
        <div className="wizard-progress__track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      </div>

      <p className="wizard-intro">{copy.intro}</p>
      <fieldset disabled={status === "sending"}>
        <legend className="sr-only">{stepCopy.title}</legend>
        <section className={`wizard-step wizard-step--${direction}`} key={currentStep} aria-labelledby={`wizard-${currentStep}-title`}>
          <div className="wizard-step__heading">
            <p className="eyebrow">{stepCopy.eyebrow}</p>
            <h2 id={`wizard-${currentStep}-title`} ref={stepHeading} tabIndex={-1}>{stepCopy.title}</h2>
            <p>{stepCopy.helper}</p>
          </div>

          {currentStep === "goal" ? <>
            <ChoiceList name="goal" options={options.goals} selected={form.goal} onChange={(value) => update("goal", value as ContactInquiry["goal"])} />
            {form.goal === "other" ? <label className="wizard-field"><span>{copy.fields.other}</span><input autoFocus maxLength={180} value={form.goalOther} onChange={(event) => update("goalOther", event.target.value)} placeholder={copy.placeholders.other} aria-invalid={Boolean(errors.goalOther)} /></label> : null}
            {errors.goal || errors.goalOther ? <p className="field-error" role="alert">{errorFor(errors.goalOther ? "goalOther" : "goal")}</p> : null}
          </> : null}

          {currentStep === "stage" ? <>
            <ChoiceList name="stage" options={options.stages} selected={form.stage} onChange={(value) => update("stage", value as ContactInquiry["stage"])} />
            <label className="wizard-field"><span>{copy.fields.website} <small>{copy.optional}</small></span><input type="url" maxLength={500} value={form.website} onChange={(event) => update("website", event.target.value)} placeholder={copy.placeholders.website} autoComplete="url" aria-invalid={Boolean(errors.website)} /><small>{copy.fields.websiteHint}</small></label>
            {errors.stage || errors.website ? <p className="field-error" role="alert">{errorFor(errors.website ? "website" : "stage")}</p> : null}
          </> : null}

          {currentStep === "challenges" ? <>
            <div className="wizard-selection-meta"><span>{form.challenges.length}/3 {copy.selected}</span><span>{copy.maxThree}</span></div>
            <ChoiceList name="challenges" options={options.challenges} selected={form.challenges} multiple max={3} onChange={(value) => toggleMulti("challenges", value as ContactInquiry["challenges"][number])} />
            {form.challenges.includes("other") ? <label className="wizard-field"><span>{copy.fields.other}</span><input autoFocus maxLength={180} value={form.challengeOther} onChange={(event) => update("challengeOther", event.target.value)} placeholder={copy.placeholders.other} aria-invalid={Boolean(errors.challengeOther)} /></label> : null}
            {errors.challenges || errors.challengeOther ? <p className="field-error" role="alert">{errorFor(errors.challengeOther ? "challengeOther" : "challenges")}</p> : null}
          </> : null}

          {currentStep === "audience" ? <>
            <label className="wizard-field"><span>{copy.fields.audience}</span><textarea rows={3} minLength={10} maxLength={400} value={form.audience} onChange={(event) => update("audience", event.target.value)} placeholder={copy.placeholders.audience} aria-invalid={Boolean(errors.audience)} /></label>
            <div className="wizard-subquestion"><h3>{copy.fields.desiredAction}</h3><ChoiceList name="desired-action" options={options.actions} selected={form.desiredAction} onChange={(value) => update("desiredAction", value as ContactInquiry["desiredAction"])} /></div>
            {form.desiredAction === "other" ? <label className="wizard-field"><span>{copy.fields.other}</span><input maxLength={180} value={form.desiredActionOther} onChange={(event) => update("desiredActionOther", event.target.value)} placeholder={copy.placeholders.other} aria-invalid={Boolean(errors.desiredActionOther)} /></label> : null}
            {errors.audience || errors.desiredAction || errors.desiredActionOther ? <p className="field-error" role="alert">{errorFor(errors.audience ? "audience" : errors.desiredActionOther ? "desiredActionOther" : "desiredAction")}</p> : null}
          </> : null}

          {currentStep === "brand" ? <>
            <div className="wizard-selection-meta"><span>{form.brandTraits.length}/3 {copy.selected}</span><span>{copy.maxThree}</span></div>
            <ChoiceList name="brand" options={options.brandTraits} selected={form.brandTraits} multiple max={3} onChange={(value) => toggleMulti("brandTraits", value as ContactInquiry["brandTraits"][number])} />
            {form.brandTraits.includes("other") ? <label className="wizard-field"><span>{copy.fields.other}</span><input autoFocus maxLength={180} value={form.brandOther} onChange={(event) => update("brandOther", event.target.value)} placeholder={copy.placeholders.other} aria-invalid={Boolean(errors.brandOther)} /></label> : null}
            {errors.brandTraits || errors.brandOther ? <p className="field-error" role="alert">{errorFor(errors.brandOther ? "brandOther" : "brandTraits")}</p> : null}
          </> : null}

          {currentStep === "needs" ? <>
            <div className="wizard-selection-meta"><span>{form.needs.length}/3 {copy.selected}</span><span>{copy.maxThree}</span></div>
            <ChoiceList name="needs" options={options.needs} selected={form.needs} multiple max={3} onChange={(value) => toggleMulti("needs", value as ContactInquiry["needs"][number])} />
            {form.needs.includes("other") ? <label className="wizard-field"><span>{copy.fields.other}</span><input autoFocus maxLength={180} value={form.needOther} onChange={(event) => update("needOther", event.target.value)} placeholder={copy.placeholders.other} aria-invalid={Boolean(errors.needOther)} /></label> : null}
            {errors.needs || errors.needOther ? <p className="field-error" role="alert">{errorFor(errors.needOther ? "needOther" : "needs")}</p> : null}
          </> : null}

          {currentStep === "readiness" ? <>
            <div className="wizard-subquestion"><h3>{copy.fields.investment}</h3><ChoiceList name="investment" options={options.investments} selected={form.investment} onChange={(value) => update("investment", value as ContactInquiry["investment"])} /></div>
            <div className="wizard-subquestion"><h3>{copy.fields.timeline}</h3><ChoiceList name="timeline" options={options.timelines} selected={form.timeline} onChange={(value) => update("timeline", value as ContactInquiry["timeline"])} /></div>
            <div className="wizard-subquestion"><h3>{copy.fields.decisionStage}</h3><ChoiceList name="decision-stage" options={options.decisionStages} selected={form.decisionStage} onChange={(value) => update("decisionStage", value as ContactInquiry["decisionStage"])} /></div>
            {errors.investment || errors.timeline || errors.decisionStage ? <p className="field-error" role="alert">{copy.validation.chooseOne}</p> : null}
          </> : null}

          {currentStep === "contact" ? <div className="wizard-contact-fields">
            <label className="wizard-field"><span>{copy.fields.name}</span><input required minLength={2} maxLength={80} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder={copy.placeholders.name} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name ? <small className="field-error">{errorFor("name")}</small> : null}</label>
            <label className="wizard-field"><span>{copy.fields.email}</span><input required type="email" maxLength={160} value={form.email} onChange={(event) => update("email", event.target.value)} placeholder={copy.placeholders.email} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email ? <small className="field-error">{errorFor("email")}</small> : null}</label>
            <label className="wizard-field wizard-field--wide"><span>{copy.fields.company} <small>{copy.optional}</small></span><input maxLength={120} value={form.company} onChange={(event) => update("company", event.target.value)} placeholder={copy.placeholders.company} autoComplete="organization" aria-invalid={Boolean(errors.company)} />{errors.company ? <small className="field-error">{errorFor("company")}</small> : null}</label>
          </div> : null}

          {currentStep === "context" ? <>
            <label className="wizard-field"><span>{copy.fields.message}</span><textarea required minLength={20} maxLength={3000} rows={7} value={form.message} onChange={(event) => update("message", event.target.value)} placeholder={copy.placeholders.message} aria-invalid={Boolean(errors.message)} /><small>{form.message.length}/3000</small></label>
            {errors.message ? <p className="field-error" role="alert">{errorFor("message")}</p> : null}
          </> : null}

          {currentStep === "review" ? <>
            <div className="wizard-review">
              {reviewItems.map((item) => <article key={item.key}><div><span>{copy.reviewLabels[item.key]}</span><p>{item.value}</p></div><button type="button" onClick={() => moveTo(item.step)}>{copy.edit}<span className="sr-only">: {copy.reviewLabels[item.key]}</span></button></article>)}
            </div>
            <label className="honeypot" aria-hidden="true">Leave blank<input name="contact_website_check" tabIndex={-1} autoComplete="off" /></label>
            <p className="form-privacy">{copy.privacyLead} <Link href={privacyHref}>{copy.privacyAction}</Link></p>
            {!enabled ? <div className="form-disabled" id="contact-disabled-note" role="note"><span>{copy.disabled.kicker}</span><strong>{copy.disabled.title}</strong><p>{copy.disabled.text}</p><small>{copy.disabled.action}</small></div> : null}
          </> : null}

          <div className="wizard-actions">
            {stepIndex > 0 ? <button className="button button--secondary" type="button" onClick={previous}>{copy.back}</button> : <span />}
            {currentStep !== "review" ? <button className="button button--primary" type="button" onClick={next}>{currentStep === "context" ? copy.review : copy.continue}<span aria-hidden="true">↗</span></button> : <button className="button button--primary" type="submit" disabled={!enabled || status === "sending"} aria-describedby={!enabled ? "contact-disabled-note" : undefined}>{!enabled ? copy.disabled.button : status === "sending" ? copy.sending : copy.submit}<span aria-hidden="true">↗</span></button>}
          </div>
          {currentStep !== "review" ? <p className="wizard-keyboard-hint">{copy.keyboardHint}</p> : null}
        </section>
      </fieldset>
      <p className="wizard-browser-note">{copy.browserOnly}</p>
      <div className="form-status" aria-live="polite">{status === "error" ? copy.providerError : null}</div>
    </form>
  );
}
