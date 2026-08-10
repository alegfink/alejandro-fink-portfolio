export type ContactLocale = "es" | "en";

export type ContactInquiry = {
  name: string;
  email: string;
  need: "business-site" | "ecommerce" | "product" | "evolution" | "collaboration";
  stage: "starting" | "existing-site" | "operating" | "exploring";
  message: string;
  locale: ContactLocale;
  company?: string;
  website?: string;
};

export type ContactSubmission = ContactInquiry & {
  submissionId: string;
  startedAt: number;
  botField?: string;
};

// Kept as an alias for components and integrations that describe the inquiry itself.
export type ContactPayload = ContactInquiry;
export type ContactValidationErrors = Partial<Record<keyof ContactInquiry, string>>;

export const CONTACT_MIN_COMPLETION_MS = 2_500;
export const CONTACT_MAX_FORM_AGE_MS = 2 * 60 * 60 * 1_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submissionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const appsScriptPathPattern = /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;
const allowedNeeds = new Set<ContactInquiry["need"]>([
  "business-site",
  "ecommerce",
  "product",
  "evolution",
  "collaboration",
]);
const allowedStages = new Set<ContactInquiry["stage"]>([
  "starting",
  "existing-site",
  "operating",
  "exploring",
]);

function isValidOptionalWebsite(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && value.length <= 500;
  } catch {
    return false;
  }
}

export function validateContactPayload(input: unknown): {
  valid: boolean;
  errors: ContactValidationErrors;
  data?: ContactInquiry;
} {
  const errors: ContactValidationErrors = {};
  if (!input || typeof input !== "object") {
    return { valid: false, errors: { message: "Invalid payload" } };
  }

  const candidate = input as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";
  const message = typeof candidate.message === "string" ? candidate.message.trim() : "";
  const need = candidate.need as ContactInquiry["need"];
  const stage = candidate.stage as ContactInquiry["stage"];
  const locale = candidate.locale as ContactLocale;
  const company = typeof candidate.company === "string" ? candidate.company.trim() : "";
  const website = typeof candidate.website === "string" ? candidate.website.trim() : "";

  if (name.length < 2 || name.length > 80) errors.name = "Name must contain 2–80 characters";
  if (!emailPattern.test(email) || email.length > 160) errors.email = "A valid email is required";
  if (!allowedNeeds.has(need)) errors.need = "Choose a valid project type";
  if (!allowedStages.has(stage)) errors.stage = "Choose a valid project stage";
  if (message.length < 20 || message.length > 3000) errors.message = "Message must contain 20–3000 characters";
  if (locale !== "es" && locale !== "en") errors.locale = "Invalid locale";
  if (company.length > 120) errors.company = "Company name is too long";
  if (!isValidOptionalWebsite(website)) errors.website = "Website must be a valid HTTP(S) URL";

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors,
    data: { name, email, need, stage, message, locale, ...(company ? { company } : {}), ...(website ? { website } : {}) },
  };
}

export function validateContactSubmission(input: unknown, now = Date.now()):
  | { valid: true; data: ContactSubmission }
  | { valid: false; code: "VALIDATION_ERROR"; errors: ContactValidationErrors }
  | { valid: false; code: "BOT_DETECTED" }
  | { valid: false; code: "SUBMISSION_ID_INVALID" | "FORM_TOO_FAST" | "FORM_EXPIRED" } {
  if (!input || typeof input !== "object") {
    return { valid: false, code: "VALIDATION_ERROR", errors: { message: "Invalid payload" } };
  }

  const candidate = input as Record<string, unknown>;
  if (typeof candidate.botField === "string" && candidate.botField.trim()) {
    return { valid: false, code: "BOT_DETECTED" };
  }
  if (typeof candidate.submissionId !== "string" || !submissionIdPattern.test(candidate.submissionId)) {
    return { valid: false, code: "SUBMISSION_ID_INVALID" };
  }
  if (typeof candidate.startedAt !== "number" || !Number.isFinite(candidate.startedAt)) {
    return { valid: false, code: "FORM_EXPIRED" };
  }

  const elapsed = now - candidate.startedAt;
  if (elapsed < CONTACT_MIN_COMPLETION_MS) return { valid: false, code: "FORM_TOO_FAST" };
  if (elapsed > CONTACT_MAX_FORM_AGE_MS) return { valid: false, code: "FORM_EXPIRED" };

  const inquiry = validateContactPayload(candidate);
  if (!inquiry.valid || !inquiry.data) {
    return { valid: false, code: "VALIDATION_ERROR", errors: inquiry.errors };
  }

  return {
    valid: true,
    data: {
      ...inquiry.data,
      submissionId: candidate.submissionId,
      startedAt: candidate.startedAt,
      ...(typeof candidate.botField === "string" ? { botField: candidate.botField } : {}),
    },
  };
}

function isGoogleAppsScriptWebhook(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "script.google.com" && appsScriptPathPattern.test(url.pathname);
  } catch {
    return false;
  }
}

export function getContactConfig() {
  const provider = process.env.CONTACT_PROVIDER ?? "disabled";
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL ?? "";
  const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET ?? "";
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL ?? "";
  return {
    provider,
    webhookUrl,
    webhookSecret,
    recipientEmail,
    enabled:
      provider === "google-apps-script"
      && isGoogleAppsScriptWebhook(webhookUrl)
      && webhookSecret.length >= 32
      && emailPattern.test(recipientEmail),
  } as const;
}
