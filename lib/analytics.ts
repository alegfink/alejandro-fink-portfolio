export type AnalyticsConsent = "granted" | "denied" | "unknown";

export type ContactChannel = "gmail" | "mailto" | "whatsapp" | "linkedin" | "github" | "copy_email";
export type ContactPlacement = "header" | "hero" | "case" | "footer" | "index" | "about" | "projects" | "closing" | "contact" | "contact_strip" | "mobile_menu" | "privacy";

export type AnalyticsEventMap = {
  language_change: { from: "es" | "en"; to: "es" | "en"; path: string };
  project_open: { projectId: string; locale: "es" | "en"; placement: "home" | "index" | "case" };
  project_story_view: { projectId: string; locale: "es" | "en"; position: number };
  case_study_view: { projectId: string; locale: "es" | "en"; caseType: "full" | "compact" };
  section_view: { sectionId: string; locale: "es" | "en"; pageGroup: string };
  contact_cta: { locale: "es" | "en"; placement: ContactPlacement };
  contact_channel_click: { locale: "es" | "en"; channel: ContactChannel; placement: ContactPlacement };
  contact_email_click: { locale: "es" | "en"; method: "gmail" | "mailto"; placement: ContactPlacement };
  contact_form_start: { locale: "es" | "en" };
  contact_form_step: { locale: "es" | "en"; stepId: string; stepNumber: number; direction: "forward" | "back" };
  contact_form_review: { locale: "es" | "en"; elapsedSeconds: number };
  contact_form_abandon: { locale: "es" | "en"; stepNumber: number; elapsedSeconds: number };
  contact_submit_attempt: { locale: "es" | "en"; elapsedSeconds: number };
  contact_submit_success: { locale: "es" | "en"; elapsedSeconds: number };
  contact_submit_error: { locale: "es" | "en"; errorReason: "validation" | "provider" | "network" };
  generate_lead: { locale: "es" | "en" };
  external_link: { locale: "es" | "en"; destinationDomain: string; context: "project" };
  scroll_depth: { locale: "es" | "en"; percent: 25 | 50 | 75 | 90; pageGroup: string };
  page_engagement: { locale: "es" | "en"; engagedSeconds: number; maxScrollPercent: number; pageGroup: string };
  loader_performance: { locale: "es" | "en"; durationMs: number; outcome: "ready" | "timeout"; heroStatus: "loaded" | "not-required" | "error" | "pending"; slow: boolean; pageGroup: string };
  web_vital: { locale: "es" | "en"; metric: "CLS" | "FCP" | "INP" | "LCP" | "TTFB"; metricValue: number; rating: "good" | "needs-improvement" | "poor"; pageGroup: string; navigationType: string };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

type GtagCommand = "config" | "consent" | "event" | "js" | "set";
type Gtag = (command: GtagCommand, target: string | Date, parameters?: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: Gtag;
  }
}

export const ANALYTICS_CONSENT_KEY = "af-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "af:analytics-consent";
export const ANALYTICS_INTERNAL_KEY = "af-analytics-internal-v1";
export const ANALYTICS_INTERNAL_COOKIE = "af-analytics-internal-v1";
const GOOGLE_TAG_ID = "af-google-analytics";
const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "disabled";
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const debugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
const measurementIdPattern = /^G-[A-Z0-9]{8,14}$/;
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
let consentDefaultsInitialized = false;
let analyticsInitialized = false;

export function isAnalyticsConfigured() {
  return provider === "google-analytics" && measurementIdPattern.test(measurementId);
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return "unknown";
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : "unknown";
}

function analyticsConsentParameters(status: Exclude<AnalyticsConsent, "unknown">) {
  return {
    analytics_storage: status,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  };
}

function ensureDataLayer() {
  window.dataLayer ??= [];
  window.gtag ??= ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  }) as Gtag;
  return window.gtag;
}

function ensureConsentDefaults() {
  const gtag = ensureDataLayer();
  if (!consentDefaultsInitialized) {
    gtag("consent", "default", analyticsConsentParameters("denied"));
    consentDefaultsInitialized = true;
  }
  return gtag;
}

export function isInternalTrafficExcluded() {
  if (typeof window === "undefined") return false;
  const excludedLocally = window.localStorage.getItem(ANALYTICS_INTERNAL_KEY) === "true";
  const excludedByCookie = document.cookie
    .split(";")
    .some((cookie) => cookie.trim() === `${ANALYTICS_INTERNAL_COOKIE}=true`);
  return excludedLocally || excludedByCookie;
}

function setInternalTrafficCookie(excluded: boolean) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = excluded
    ? `${ANALYTICS_INTERNAL_COOKIE}=true; Max-Age=31536000; Path=/; SameSite=Lax${secure}`
    : `${ANALYTICS_INTERNAL_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
}

export function applyInternalTrafficControl() {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  const command = url.searchParams.get("af_analytics");
  if (command === "exclude") {
    window.localStorage.setItem(ANALYTICS_INTERNAL_KEY, "true");
    setInternalTrafficCookie(true);
  }
  if (command === "include") {
    window.localStorage.removeItem(ANALYTICS_INTERNAL_KEY);
    setInternalTrafficCookie(false);
  }
  if (command === "exclude" || command === "include") {
    url.searchParams.delete("af_analytics");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }
  return isInternalTrafficExcluded();
}

function deleteAnalyticsCookies() {
  const hostParts = window.location.hostname.split(".");
  const domains = [window.location.hostname, `.${window.location.hostname}`];
  if (hostParts.length > 2) domains.push(`.${hostParts.slice(-2).join(".")}`);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
    }
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}

export function setAnalyticsConsent(status: Exclude<AnalyticsConsent, "unknown">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, status);
  const gtag = ensureConsentDefaults();
  gtag("consent", "update", analyticsConsentParameters(status));
  if (status === "denied") deleteAnalyticsCookies();
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: status }));
}

export function initializeAnalytics() {
  if (typeof window === "undefined" || !isAnalyticsConfigured() || isInternalTrafficExcluded()) return false;
  const gtag = ensureConsentDefaults();
  if (getAnalyticsConsent() !== "granted") return false;
  if (!analyticsInitialized) {
    gtag("consent", "update", analyticsConsentParameters("granted"));
    gtag("js", new Date());
    gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: "SameSite=Lax;Secure",
      debug_mode: debugMode,
    });
    if (!document.getElementById(GOOGLE_TAG_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_TAG_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }
    analyticsInitialized = true;
  }
  return true;
}

function safeCampaignValue(value: string) {
  const normalized = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 100);
  if (!normalized || normalized.includes("@") || /\d{8,}/.test(normalized.replace(/\D/g, ""))) return "";
  return normalized;
}

export function sanitizeInternalPath(value: string) {
  try {
    const url = new URL(value, "https://portfolio.invalid");
    return url.pathname.startsWith("/") ? url.pathname.slice(0, 240) : "/";
  } catch {
    return "/";
  }
}

export function pageGroupFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "v2") parts.shift();
  if (parts[0] === "es" || parts[0] === "en") parts.shift();
  const [section] = parts;
  if (!section) return "home";
  if (section === "proyectos" || section === "projects" || section === "work") return parts.length > 1 ? "case_study" : "work_index";
  if (section === "contacto" || section === "contact") return "contact";
  if (section === "acerca-de" || section === "sobre-mi" || section === "about") return "about";
  if (section === "privacidad" || section === "privacy") return "privacy";
  if (section === "admin") return "admin";
  if (section === "v1") return "archive";
  return "other";
}

export function sanitizePageLocation(value: string) {
  try {
    const url = new URL(value);
    const sanitized = new URL(url.origin + sanitizeInternalPath(url.pathname));
    for (const key of campaignKeys) {
      const campaignValue = safeCampaignValue(url.searchParams.get(key) ?? "");
      if (campaignValue) sanitized.searchParams.set(key, campaignValue);
    }
    return sanitized.toString();
  } catch {
    return "";
  }
}

export function sanitizeReferrer(value: string, currentOrigin?: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return url.origin === currentOrigin ? `${url.origin}${sanitizeInternalPath(url.pathname)}` : url.origin;
  } catch {
    return "";
  }
}

export function domainFromUrl(value: string) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "").slice(0, 120);
  } catch {
    return "unknown";
  }
}

function toSnakeCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function safeEventValue(value: unknown): string | number | boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") return value.replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 240);
  return undefined;
}

function eventParameters(payload: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(payload).flatMap(([key, value]) => {
    const safe = safeEventValue(value);
    const parameter = key === "locale" ? "site_language" : toSnakeCase(key);
    return safe === undefined ? [] : [[parameter, safe]];
  }));
}

export function trackEvent<Name extends AnalyticsEventName>(name: Name, payload: AnalyticsEventMap[Name]): boolean {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "granted" || !initializeAnalytics()) return false;
  window.gtag?.("event", name, { ...eventParameters(payload), transport_type: "beacon" });
  return true;
}

export function trackContactChannel(locale: "es" | "en", channel: ContactChannel, placement: ContactPlacement) {
  const tracked = trackEvent("contact_channel_click", { locale, channel, placement });
  trackEvent("contact_cta", { locale, placement });
  if (channel === "gmail" || channel === "mailto") {
    trackEvent("contact_email_click", { locale, method: channel, placement });
  }
  return tracked;
}

export function trackPageView(pathname: string, pageGroup: string, locale: "es" | "en") {
  if (typeof window === "undefined" || getAnalyticsConsent() !== "granted" || !initializeAnalytics()) return false;
  window.gtag?.("set", "user_properties", { site_language: locale });
  window.gtag?.("event", "page_view", {
    page_title: document.title.slice(0, 200),
    page_location: sanitizePageLocation(window.location.href),
    page_referrer: sanitizeReferrer(document.referrer, window.location.origin),
    page_path: sanitizeInternalPath(pathname),
    page_group: pageGroup,
    site_language: locale,
    debug_mode: debugMode,
  });
  return true;
}
