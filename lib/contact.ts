export type ContactLocale = "es" | "en";

export type ContactInquiry = {
  name: string;
  email: string;
  goal: "sell-more" | "qualified-leads" | "clarify-offer" | "build-trust" | "streamline" | "validate" | "other";
  stage: "no-site" | "existing-underperforming" | "outdated-site" | "social-first" | "digital-product" | "defining";
  challenges: Array<"unclear-offer" | "low-leads" | "low-conversion" | "weak-brand" | "manual-ops" | "tech-limits" | "no-direction" | "other">;
  audience: string;
  desiredAction: "contact" | "whatsapp" | "buy" | "book" | "quote" | "register" | "other";
  brandTraits: Array<"trustworthy" | "professional" | "premium" | "clear" | "innovative" | "human" | "bold" | "other">;
  needs: Array<"business-site" | "ecommerce" | "funnel" | "product" | "evolution" | "automation" | "strategy" | "other">;
  investment: "none" | "under-300" | "300-1000" | "1000-3000" | "over-3000" | "prefer-not";
  timeline: "asap" | "1-3-months" | "3-6-months" | "flexible";
  decisionStage: "exploring" | "needs-definition" | "partly-defined" | "comparing" | "ready";
  message: string;
  locale: ContactLocale;
  company?: string;
  website?: string;
  goalOther?: string;
  challengeOther?: string;
  desiredActionOther?: string;
  brandOther?: string;
  needOther?: string;
};

export type ContactSubmission = ContactInquiry & {
  submissionId: string;
  startedAt: number;
  botField?: string;
};

export type ContactPayload = ContactInquiry;
export type ContactValidationErrors = Partial<Record<keyof ContactInquiry, string>>;

export const CONTACT_MIN_COMPLETION_MS = 2_500;
export const CONTACT_MAX_FORM_AGE_MS = 2 * 60 * 60 * 1_000;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const submissionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const appsScriptPathPattern = /^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;

const allowedGoals = new Set<ContactInquiry["goal"]>(["sell-more", "qualified-leads", "clarify-offer", "build-trust", "streamline", "validate", "other"]);
const allowedStages = new Set<ContactInquiry["stage"]>(["no-site", "existing-underperforming", "outdated-site", "social-first", "digital-product", "defining"]);
const allowedChallenges = new Set<ContactInquiry["challenges"][number]>(["unclear-offer", "low-leads", "low-conversion", "weak-brand", "manual-ops", "tech-limits", "no-direction", "other"]);
const allowedActions = new Set<ContactInquiry["desiredAction"]>(["contact", "whatsapp", "buy", "book", "quote", "register", "other"]);
const allowedBrandTraits = new Set<ContactInquiry["brandTraits"][number]>(["trustworthy", "professional", "premium", "clear", "innovative", "human", "bold", "other"]);
const allowedNeeds = new Set<ContactInquiry["needs"][number]>(["business-site", "ecommerce", "funnel", "product", "evolution", "automation", "strategy", "other"]);
const allowedInvestments = new Set<ContactInquiry["investment"]>(["none", "under-300", "300-1000", "1000-3000", "over-3000", "prefer-not"]);
const allowedTimelines = new Set<ContactInquiry["timeline"]>(["asap", "1-3-months", "3-6-months", "flexible"]);
const allowedDecisionStages = new Set<ContactInquiry["decisionStage"]>(["exploring", "needs-definition", "partly-defined", "comparing", "ready"]);

function stringValue(candidate: Record<string, unknown>, key: string) {
  return typeof candidate[key] === "string" ? candidate[key].trim() : "";
}

function arrayValue<T extends string>(value: unknown, allowed: Set<T>): T[] {
  if (!Array.isArray(value)) return [];
  const unique = [...new Set(value.filter((item): item is T => typeof item === "string" && allowed.has(item as T)))];
  return unique;
}

function isValidOptionalWebsite(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") && value.length <= 500;
  } catch {
    return false;
  }
}

function otherIsValid(selected: boolean, value: string) {
  return !selected || (value.length >= 2 && value.length <= 180);
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
  const name = stringValue(candidate, "name");
  const email = stringValue(candidate, "email").toLowerCase();
  const company = stringValue(candidate, "company");
  const website = stringValue(candidate, "website");
  const goal = candidate.goal as ContactInquiry["goal"];
  const goalOther = stringValue(candidate, "goalOther");
  const stage = candidate.stage as ContactInquiry["stage"];
  const challenges = arrayValue(candidate.challenges, allowedChallenges);
  const challengeOther = stringValue(candidate, "challengeOther");
  const audience = stringValue(candidate, "audience");
  const desiredAction = candidate.desiredAction as ContactInquiry["desiredAction"];
  const desiredActionOther = stringValue(candidate, "desiredActionOther");
  const brandTraits = arrayValue(candidate.brandTraits, allowedBrandTraits);
  const brandOther = stringValue(candidate, "brandOther");
  const needs = arrayValue(candidate.needs, allowedNeeds);
  const needOther = stringValue(candidate, "needOther");
  const investment = candidate.investment as ContactInquiry["investment"];
  const timeline = candidate.timeline as ContactInquiry["timeline"];
  const decisionStage = candidate.decisionStage as ContactInquiry["decisionStage"];
  const message = stringValue(candidate, "message");
  const locale = candidate.locale as ContactLocale;

  if (name.length < 2 || name.length > 80) errors.name = "Name must contain 2–80 characters";
  if (!emailPattern.test(email) || email.length > 160) errors.email = "A valid email is required";
  if (company.length > 120) errors.company = "Company name is too long";
  if (!isValidOptionalWebsite(website)) errors.website = "Website must be a valid HTTP(S) URL";
  if (!allowedGoals.has(goal)) errors.goal = "Choose a valid goal";
  if (!otherIsValid(goal === "other", goalOther)) errors.goalOther = "Describe the other goal";
  if (!allowedStages.has(stage)) errors.stage = "Choose a valid starting point";
  if (challenges.length < 1 || challenges.length > 3 || !Array.isArray(candidate.challenges) || challenges.length !== new Set(candidate.challenges).size) errors.challenges = "Choose 1–3 valid challenges";
  if (!otherIsValid(challenges.includes("other"), challengeOther)) errors.challengeOther = "Describe the other challenge";
  if (audience.length < 10 || audience.length > 400) errors.audience = "Audience must contain 10–400 characters";
  if (!allowedActions.has(desiredAction)) errors.desiredAction = "Choose a valid action";
  if (!otherIsValid(desiredAction === "other", desiredActionOther)) errors.desiredActionOther = "Describe the other action";
  if (brandTraits.length < 1 || brandTraits.length > 3 || !Array.isArray(candidate.brandTraits) || brandTraits.length !== new Set(candidate.brandTraits).size) errors.brandTraits = "Choose 1–3 valid brand traits";
  if (!otherIsValid(brandTraits.includes("other"), brandOther)) errors.brandOther = "Describe the other brand trait";
  if (needs.length < 1 || needs.length > 3 || !Array.isArray(candidate.needs) || needs.length !== new Set(candidate.needs).size) errors.needs = "Choose 1–3 valid needs";
  if (!otherIsValid(needs.includes("other"), needOther)) errors.needOther = "Describe the other need";
  if (!allowedInvestments.has(investment)) errors.investment = "Choose a valid investment range";
  if (!allowedTimelines.has(timeline)) errors.timeline = "Choose a valid timeline";
  if (!allowedDecisionStages.has(decisionStage)) errors.decisionStage = "Choose a valid decision stage";
  if (message.length < 20 || message.length > 3000) errors.message = "Message must contain 20–3000 characters";
  if (locale !== "es" && locale !== "en") errors.locale = "Invalid locale";

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors,
    data: {
      name,
      email,
      goal,
      stage,
      challenges,
      audience,
      desiredAction,
      brandTraits,
      needs,
      investment,
      timeline,
      decisionStage,
      message,
      locale,
      ...(company ? { company } : {}),
      ...(website ? { website } : {}),
      ...(goalOther ? { goalOther } : {}),
      ...(challengeOther ? { challengeOther } : {}),
      ...(desiredActionOther ? { desiredActionOther } : {}),
      ...(brandOther ? { brandOther } : {}),
      ...(needOther ? { needOther } : {}),
    },
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
  if (typeof candidate.botField === "string" && candidate.botField.trim()) return { valid: false, code: "BOT_DETECTED" };
  if (typeof candidate.submissionId !== "string" || !submissionIdPattern.test(candidate.submissionId)) return { valid: false, code: "SUBMISSION_ID_INVALID" };
  if (typeof candidate.startedAt !== "number" || !Number.isFinite(candidate.startedAt)) return { valid: false, code: "FORM_EXPIRED" };

  const elapsed = now - candidate.startedAt;
  if (elapsed < CONTACT_MIN_COMPLETION_MS) return { valid: false, code: "FORM_TOO_FAST" };
  if (elapsed > CONTACT_MAX_FORM_AGE_MS) return { valid: false, code: "FORM_EXPIRED" };

  const inquiry = validateContactPayload(candidate);
  if (!inquiry.valid || !inquiry.data) return { valid: false, code: "VALIDATION_ERROR", errors: inquiry.errors };

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
