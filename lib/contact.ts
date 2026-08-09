export type ContactLocale = "es" | "en";

export type ContactPayload = {
  name: string;
  email: string;
  need: "business-site" | "ecommerce" | "product" | "evolution" | "collaboration";
  message: string;
  locale: ContactLocale;
  company?: string;
};

export type ContactValidationErrors = Partial<Record<keyof ContactPayload, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedNeeds = new Set<ContactPayload["need"]>([
  "business-site",
  "ecommerce",
  "product",
  "evolution",
  "collaboration",
]);

export function validateContactPayload(input: unknown): {
  valid: boolean;
  errors: ContactValidationErrors;
  data?: ContactPayload;
} {
  const errors: ContactValidationErrors = {};
  if (!input || typeof input !== "object") {
    return { valid: false, errors: { message: "Invalid payload" } };
  }

  const candidate = input as Record<string, unknown>;
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";
  const message = typeof candidate.message === "string" ? candidate.message.trim() : "";
  const need = candidate.need as ContactPayload["need"];
  const locale = candidate.locale as ContactLocale;
  const company = typeof candidate.company === "string" ? candidate.company.trim() : "";

  if (name.length < 2 || name.length > 80) errors.name = "Name must contain 2–80 characters";
  if (!emailPattern.test(email) || email.length > 160) errors.email = "A valid email is required";
  if (!allowedNeeds.has(need)) errors.need = "Choose a valid project type";
  if (message.length < 20 || message.length > 3000) errors.message = "Message must contain 20–3000 characters";
  if (locale !== "es" && locale !== "en") errors.locale = "Invalid locale";
  if (company.length > 120) errors.company = "Company name is too long";

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors,
    data: { name, email, need, message, locale, ...(company ? { company } : {}) },
  };
}

export function getContactConfig() {
  const provider = process.env.CONTACT_PROVIDER ?? "disabled";
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL ?? "";
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL ?? "";
  let secureWebhook = false;
  try {
    secureWebhook = new URL(webhookUrl).protocol === "https:";
  } catch {
    secureWebhook = false;
  }
  return {
    provider,
    webhookUrl,
    recipientEmail,
    enabled: provider === "webhook" && secureWebhook && emailPattern.test(recipientEmail),
  } as const;
}
