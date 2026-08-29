import type { ContactInquiry } from "@/lib/contact";

export const CONTACT_DRAFT_STORAGE_KEY = "alejandro-fink.contact-draft.v1";
export const CONTACT_DRAFT_TTL_MS = 2 * 60 * 60 * 1_000;

const CONTACT_DRAFT_VERSION = 1;
const allowedGoals = ["sell-more", "qualified-leads", "clarify-offer", "build-trust", "streamline", "validate", "other"] as const;
const allowedStages = ["no-site", "existing-underperforming", "outdated-site", "social-first", "digital-product", "defining"] as const;
const allowedChallenges = ["unclear-offer", "low-leads", "low-conversion", "weak-brand", "manual-ops", "tech-limits", "no-direction", "other"] as const;
const allowedActions = ["contact", "whatsapp", "buy", "book", "quote", "register", "other"] as const;
const allowedBrandTraits = ["trustworthy", "professional", "premium", "clear", "innovative", "human", "bold", "other"] as const;
const allowedNeeds = ["business-site", "ecommerce", "funnel", "product", "evolution", "automation", "strategy", "other"] as const;
const allowedInvestments = ["none", "under-300", "300-1000", "1000-3000", "over-3000", "prefer-not"] as const;
const allowedTimelines = ["asap", "1-3-months", "3-6-months", "flexible"] as const;
const allowedDecisionStages = ["exploring", "needs-definition", "partly-defined", "comparing", "ready"] as const;
const draftFieldNames = ["goal", "stage", "challenges", "desiredAction", "brandTraits", "needs", "investment", "timeline", "decisionStage"] as const;

export type ContactDraftFields = Partial<Pick<
  ContactInquiry,
  (typeof draftFieldNames)[number]
>>;

export type ContactDraftReadResult =
  | { status: "empty" }
  | { status: "valid"; fields: ContactDraftFields; resumeStep: number }
  | { status: "invalid"; reason: "corrupt" | "expired" | "version" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === "string" && allowed.includes(value as T);
}

function normalizedSelection<T extends string>(value: unknown, allowed: readonly T[]): T[] | undefined {
  if (!Array.isArray(value) || value.length < 1 || value.length > 3) return undefined;
  if (!value.every((item): item is T => isOneOf(item, allowed))) return undefined;
  const unique = [...new Set(value)];
  return unique.length === value.length ? unique : undefined;
}

function sanitizedFields(candidate: unknown): ContactDraftFields | null {
  if (!isRecord(candidate)) return null;
  if (Object.keys(candidate).some((key) => !draftFieldNames.includes(key as (typeof draftFieldNames)[number]))) return null;

  const fields: ContactDraftFields = {};
  if (candidate.goal !== undefined) {
    if (!isOneOf(candidate.goal, allowedGoals)) return null;
    fields.goal = candidate.goal;
  }
  if (candidate.stage !== undefined) {
    if (!isOneOf(candidate.stage, allowedStages)) return null;
    fields.stage = candidate.stage;
  }
  if (candidate.challenges !== undefined) {
    const challenges = normalizedSelection(candidate.challenges, allowedChallenges);
    if (!challenges) return null;
    fields.challenges = challenges;
  }
  if (candidate.desiredAction !== undefined) {
    if (!isOneOf(candidate.desiredAction, allowedActions)) return null;
    fields.desiredAction = candidate.desiredAction;
  }
  if (candidate.brandTraits !== undefined) {
    const brandTraits = normalizedSelection(candidate.brandTraits, allowedBrandTraits);
    if (!brandTraits) return null;
    fields.brandTraits = brandTraits;
  }
  if (candidate.needs !== undefined) {
    const needs = normalizedSelection(candidate.needs, allowedNeeds);
    if (!needs) return null;
    fields.needs = needs;
  }
  if (candidate.investment !== undefined) {
    if (!isOneOf(candidate.investment, allowedInvestments)) return null;
    fields.investment = candidate.investment;
  }
  if (candidate.timeline !== undefined) {
    if (!isOneOf(candidate.timeline, allowedTimelines)) return null;
    fields.timeline = candidate.timeline;
  }
  if (candidate.decisionStage !== undefined) {
    if (!isOneOf(candidate.decisionStage, allowedDecisionStages)) return null;
    fields.decisionStage = candidate.decisionStage;
  }

  return Object.keys(fields).length > 0 ? fields : null;
}

function resumeStepFor(fields: ContactDraftFields) {
  if (!fields.goal || fields.goal === "other") return 0;
  if (!fields.stage) return 1;
  if (!fields.challenges?.length || fields.challenges.includes("other")) return 2;
  return 3;
}

export function serializeContactDraft(candidate: ContactDraftFields, now = Date.now()): string | null {
  const fields = sanitizedFields(candidate);
  if (!fields) return null;
  return JSON.stringify({ version: CONTACT_DRAFT_VERSION, savedAt: now, fields });
}

export function readContactDraft(raw: string | null, now = Date.now()): ContactDraftReadResult {
  if (raw === null) return { status: "empty" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "invalid", reason: "corrupt" };
  }

  if (!isRecord(parsed)) return { status: "invalid", reason: "corrupt" };
  if (parsed.version !== CONTACT_DRAFT_VERSION) return { status: "invalid", reason: "version" };
  if (typeof parsed.savedAt !== "number" || !Number.isFinite(parsed.savedAt) || parsed.savedAt > now + 60_000) {
    return { status: "invalid", reason: "corrupt" };
  }
  if (now - parsed.savedAt > CONTACT_DRAFT_TTL_MS) return { status: "invalid", reason: "expired" };

  const fields = sanitizedFields(parsed.fields);
  if (!fields) return { status: "invalid", reason: "corrupt" };
  return { status: "valid", fields, resumeStep: resumeStepFor(fields) };
}
