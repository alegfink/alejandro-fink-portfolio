import { getAnalyticsConsent, sanitizeInternalPath } from "@/lib/analytics";
import type { ContactAttribution } from "@/lib/contact";

const ATTRIBUTION_KEY = "af-attribution-v1";
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
let memoryAttribution: ContactAttribution | undefined;

function safeValue(value: string | null, max = 100) {
  const normalized = (value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
  if (!normalized || normalized.includes("@") || /\d{8,}/.test(normalized.replace(/\D/g, ""))) return undefined;
  return normalized;
}

function referrerDomain() {
  if (!document.referrer) return undefined;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin === window.location.origin) return undefined;
    return referrer.hostname.toLowerCase().replace(/^www\./, "").slice(0, 120);
  } catch {
    return undefined;
  }
}

function isAttribution(value: unknown): value is ContactAttribution {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.landingPath === "string" && typeof candidate.capturedAt === "string";
}

export function captureAttribution(persist = getAnalyticsConsent() === "granted") {
  if (typeof window === "undefined") return undefined;
  if (!memoryAttribution && persist) {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(ATTRIBUTION_KEY) ?? "null");
      if (isAttribution(stored)) memoryAttribution = stored;
    } catch {
      window.sessionStorage.removeItem(ATTRIBUTION_KEY);
    }
  }
  if (!memoryAttribution) {
    const search = new URLSearchParams(window.location.search);
    memoryAttribution = {
      landingPath: sanitizeInternalPath(window.location.pathname),
      capturedAt: new Date().toISOString(),
      ...(safeValue(search.get(campaignKeys[0])) ? { source: safeValue(search.get(campaignKeys[0])) } : {}),
      ...(safeValue(search.get(campaignKeys[1])) ? { medium: safeValue(search.get(campaignKeys[1])) } : {}),
      ...(safeValue(search.get(campaignKeys[2])) ? { campaign: safeValue(search.get(campaignKeys[2])) } : {}),
      ...(safeValue(search.get(campaignKeys[3])) ? { term: safeValue(search.get(campaignKeys[3])) } : {}),
      ...(safeValue(search.get(campaignKeys[4])) ? { content: safeValue(search.get(campaignKeys[4])) } : {}),
      ...(referrerDomain() ? { referrerDomain: referrerDomain() } : {}),
    };
  }
  if (persist && getAnalyticsConsent() === "granted") {
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(memoryAttribution));
  }
  return memoryAttribution;
}

export function getLeadAttribution() {
  if (getAnalyticsConsent() !== "granted") return undefined;
  return captureAttribution(true);
}
