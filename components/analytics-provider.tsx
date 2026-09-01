"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { captureAttribution } from "@/lib/attribution";
import {
  ANALYTICS_CONSENT_EVENT,
  applyInternalTrafficControl,
  getAnalyticsConsent,
  initializeAnalytics,
  isAnalyticsConfigured,
  pageGroupFromPath,
  setAnalyticsConsent,
  trackEvent,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";
import {
  PORTFOLIO_LOADER_METRIC_EVENT,
  isPortfolioLoaderMetric,
  type PortfolioLoaderMetric,
} from "@/lib/loader-performance";

function localeFromPath(pathname: string): "es" | "en" {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "en" || (parts[0] === "v2" && parts[1] === "en") ? "en" : "es";
}

const consentCopy = {
  es: {
    eyebrow: "MEDICIÓN · TU DECISIÓN",
    title: "¿Podemos medir qué resulta útil?",
    text: "Google Analytics se activa sólo si aceptás. Mide uso y rendimiento; nunca nombres, emails, teléfonos ni mensajes.",
    accept: "Aceptar analítica",
    reject: "Solo necesarias",
    privacy: "Ver privacidad",
    preferences: "Preferencias de analítica",
  },
  en: {
    eyebrow: "MEASUREMENT · YOUR CHOICE",
    title: "May we measure what proves useful?",
    text: "Google Analytics loads only if you accept. It measures use and performance—never names, emails, phone numbers or messages.",
    accept: "Accept analytics",
    reject: "Necessary only",
    privacy: "View privacy",
    preferences: "Analytics preferences",
  },
} as const;

export function AnalyticsPreferencesButton({ locale, className = "" }: { locale: "es" | "en"; className?: string }) {
  if (!isAnalyticsConfigured()) return null;
  return <button className={`analytics-preferences ${className}`.trim()} type="button" onClick={() => window.dispatchEvent(new Event("af:analytics-open"))}>{consentCopy[locale].preferences}</button>;
}

export function AnalyticsProvider() {
  const pathname = usePathname() || "/es";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const locale = localeFromPath(pathname);
  const copy = consentCopy[locale];
  const configured = isAnalyticsConfigured();
  const [consent, setConsentState] = useState<AnalyticsConsent>("unknown");
  const [open, setOpen] = useState(false);
  const lastPage = useRef("");
  const pendingLoaderMetric = useRef<PortfolioLoaderMetric | null>(null);
  const engagement = useRef({ startedAt: 0, maxScroll: 0, sent: false });
  const thresholdsSeen = useRef(new Set<number>());
  const pageGroup = useMemo(() => pageGroupFromPath(pathname), [pathname]);

  useEffect(() => {
    if (!configured) return;
    if (isAdmin) {
      window.localStorage.setItem("af-analytics-internal-v1", "true");
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `af-analytics-internal-v1=true; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
      window.queueMicrotask(() => {
        setConsentState("denied");
        setOpen(false);
      });
      return;
    }
    if (applyInternalTrafficControl()) {
      window.queueMicrotask(() => {
        setConsentState("denied");
        setOpen(false);
      });
      return;
    }
    initializeAnalytics();
    const stored = getAnalyticsConsent();
    window.queueMicrotask(() => {
      setConsentState(stored);
      setOpen(stored === "unknown");
    });
    captureAttribution(stored === "granted");
    const onConsent = (event: Event) => {
      const next = (event as CustomEvent<AnalyticsConsent>).detail;
      setConsentState(next);
      setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    window.addEventListener("af:analytics-open", onOpen);
    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
      window.removeEventListener("af:analytics-open", onOpen);
    };
  }, [configured, isAdmin]);

  useEffect(() => {
    if (!configured || isAdmin) return;
    const onLoaderMetric = (event: Event) => {
      const metric = (event as CustomEvent<unknown>).detail;
      if (!isPortfolioLoaderMetric(metric)) return;
      if (getAnalyticsConsent() !== "granted") {
        pendingLoaderMetric.current = metric;
        return;
      }
      trackEvent("loader_performance", { ...metric, locale, pageGroup });
    };
    window.addEventListener(PORTFOLIO_LOADER_METRIC_EVENT, onLoaderMetric);
    return () => window.removeEventListener(PORTFOLIO_LOADER_METRIC_EVENT, onLoaderMetric);
  }, [configured, isAdmin, locale, pageGroup]);

  useEffect(() => {
    engagement.current = { startedAt: Date.now(), maxScroll: 0, sent: false };
    thresholdsSeen.current = new Set();
    captureAttribution(consent === "granted");
    if (consent !== "granted") return;
    initializeAnalytics();
    if (pendingLoaderMetric.current) {
      trackEvent("loader_performance", { ...pendingLoaderMetric.current, locale, pageGroup });
      pendingLoaderMetric.current = null;
    }
    if (lastPage.current === pathname) return;
    if (trackPageView(pathname, pageGroup, locale)) lastPage.current = pathname;
  }, [consent, locale, pageGroup, pathname]);

  useEffect(() => {
    if (consent !== "granted") return;
    const onScroll = () => {
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      const percent = travel > 0 ? Math.min(100, Math.round((window.scrollY / travel) * 100)) : 100;
      engagement.current.maxScroll = Math.max(engagement.current.maxScroll, percent);
      for (const threshold of [25, 50, 75, 90] as const) {
        if (percent >= threshold && !thresholdsSeen.current.has(threshold)) {
          thresholdsSeen.current.add(threshold);
          trackEvent("scroll_depth", { locale, percent: threshold, pageGroup });
        }
      }
    };
    const sendEngagement = () => {
      if (engagement.current.sent) return;
      const engagedSeconds = Math.round((Date.now() - engagement.current.startedAt) / 1000);
      if (engagedSeconds < 5) return;
      engagement.current.sent = true;
      trackEvent("page_engagement", { locale, engagedSeconds, maxScrollPercent: engagement.current.maxScroll, pageGroup });
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") sendEngagement(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", sendEngagement);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      sendEngagement();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", sendEngagement);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [consent, locale, pageGroup, pathname]);

  useEffect(() => {
    if (consent !== "granted") return;
    const seen = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).dataset.analyticsSection;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        trackEvent("section_view", { sectionId: id, locale, pageGroup });
      }
    }, { threshold: 0.45 });
    document.querySelectorAll<HTMLElement>("[data-analytics-section]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [consent, locale, pageGroup, pathname]);

  useEffect(() => {
    if (consent !== "granted") return;
    let active = true;
    void import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const report = (metric: { name: "CLS" | "FCP" | "INP" | "LCP" | "TTFB"; value: number; rating: "good" | "needs-improvement" | "poor"; navigationType: string }) => {
        if (!active) return;
        const value = metric.name === "CLS" ? Number(metric.value.toFixed(4)) : Math.round(metric.value);
        trackEvent("web_vital", { locale, metric: metric.name, metricValue: value, rating: metric.rating, pageGroup, navigationType: metric.navigationType });
      };
      onCLS(report); onFCP(report); onINP(report); onLCP(report); onTTFB(report);
    });
    return () => { active = false; };
  }, [consent, locale, pageGroup]);

  if (!configured || !open || isAdmin) return null;
  return (
    <aside className="analytics-consent" aria-labelledby="analytics-consent-title" role="dialog" aria-modal="false">
      <p className="analytics-consent__eyebrow">{copy.eyebrow}</p>
      <h2 id="analytics-consent-title">{copy.title}</h2>
      <p>{copy.text}</p>
      <div className="analytics-consent__actions">
        <button className="button button--primary" type="button" onClick={() => setAnalyticsConsent("granted")}>{copy.accept}</button>
        <button className="button button--secondary" type="button" onClick={() => setAnalyticsConsent("denied")}>{copy.reject}</button>
        <a href={locale === "es" ? "/privacidad" : "/en/privacy"}>{copy.privacy}</a>
      </div>
    </aside>
  );
}
