"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "@/components/v2/portfolio-loader.module.css";
import { pageEntranceEvent } from "@/components/v2/use-page-entrance";
import {
  PORTFOLIO_LOADER_METRIC_EVENT,
  createPortfolioLoaderMetric,
  getPortfolioLoaderExitReason,
  type PortfolioLoaderExitReason,
  type PortfolioLoaderHeroStatus,
} from "@/lib/loader-performance";
import {
  PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT,
  hasSeenPortfolioLoader,
  markPortfolioLoaderSeen,
} from "@/lib/loader-session";
import { v2SharedCopy } from "@/lib/v2-i18n";

type LoaderPhase = "loading" | "complete" | "exiting" | "hidden";
type LoaderMode = "entry" | "session-skip";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

export function PortfolioV2Loader({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const skipLoader = pathname === "/admin" || pathname.startsWith("/admin/");
  const locale = pathname === "/en" || pathname.startsWith("/en/") || pathname.startsWith("/v2/en") ? "en" : "es";
  const copy = v2SharedCopy[locale];
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const [phase, setPhase] = useState<LoaderPhase>("loading");
  const [mode, setMode] = useState<LoaderMode>("entry");

  useEffect(() => {
    if (skipLoader) return;
    let frame = 0;

    const restoreHorizontalOrigin = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const top = window.scrollY;

        if (window.scrollX !== 0) window.scrollTo(0, top);
        if (document.documentElement.scrollLeft !== 0) document.documentElement.scrollLeft = 0;
        if (document.body.scrollLeft !== 0) document.body.scrollLeft = 0;
      });
    };

    restoreHorizontalOrigin();
    window.addEventListener("pageshow", restoreHorizontalOrigin);
    window.addEventListener("resize", restoreHorizontalOrigin);
    window.addEventListener("orientationchange", restoreHorizontalOrigin);
    window.visualViewport?.addEventListener("resize", restoreHorizontalOrigin);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", restoreHorizontalOrigin);
      window.removeEventListener("resize", restoreHorizontalOrigin);
      window.removeEventListener("orientationchange", restoreHorizontalOrigin);
      window.visualViewport?.removeEventListener("resize", restoreHorizontalOrigin);
    };
  }, [skipLoader]);

  useEffect(() => {
    if (skipLoader) return;
    let sessionStorage: Storage | null = null;
    try {
      sessionStorage = window.sessionStorage;
    } catch {
      sessionStorage = null;
    }

    if (hasSeenPortfolioLoader(sessionStorage)) {
      const revealFrame = window.requestAnimationFrame(() => {
        setMode("session-skip");
        setPhase("hidden");
        window.dispatchEvent(new Event(pageEntranceEvent));
      });
      return () => window.cancelAnimationFrame(revealFrame);
    }

    markPortfolioLoaderSeen(sessionStorage);
    const loader = loaderRef.current;
    const counter = counterRef.current;
    const progressLine = progressRef.current;
    const diagonals = Array.from(loader?.querySelectorAll<SVGPathElement>("[data-logo-diagonal]") ?? []);
    const horizontals = Array.from(loader?.querySelectorAll<SVGPathElement>("[data-logo-horizontal]") ?? []);
    const strokes = [...diagonals, ...horizontals];
    const tracers = Array.from(loader?.querySelectorAll<SVGCircleElement>("[data-logo-tracer]") ?? []);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timings = reducedMotion
      ? { minimum: 220, finish: 140, hold: 80, exit: 260 }
      : { minimum: 700, finish: 280, hold: 140, exit: 620 };
    const originalOverflow = document.body.style.overflow;
    const startedAt = performance.now();
    let structureReady = false;
    let heroReady = false;
    let heroStatus: PortfolioLoaderHeroStatus = "pending";
    let exitReason: PortfolioLoaderExitReason | null = null;
    let finishStartedAt: number | null = null;
    let finishStartedFrom = 0;
    let displayed = 0;
    let frame = 0;
    let readinessFrame = 0;
    let criticalHero: HTMLImageElement | null = null;
    const timers: number[] = [];
    const strokeLengths = new Map(strokes.map((stroke) => {
      const length = stroke.getTotalLength();
      stroke.style.strokeDasharray = `${length} ${length}`;
      stroke.style.strokeDashoffset = String(length);
      return [stroke, length] as const;
    }));
    if (loader) loader.dataset.logoReady = "true";

    document.body.style.overflow = "hidden";

    const removeHeroListeners = () => {
      criticalHero?.removeEventListener("load", handleHeroLoad);
      criticalHero?.removeEventListener("error", handleHeroError);
    };

    const settleHero = (status: PortfolioLoaderHeroStatus) => {
      heroStatus = status;
      heroReady = true;
      removeHeroListeners();
    };

    function handleHeroLoad() { settleHero("loaded"); }
    function handleHeroError() { settleHero("error"); }

    readinessFrame = window.requestAnimationFrame(() => {
      readinessFrame = window.requestAnimationFrame(() => {
        structureReady = true;
        criticalHero = document.querySelector<HTMLImageElement>("[data-loader-critical-hero]");

        if (!criticalHero) {
          settleHero("not-required");
          return;
        }
        if (criticalHero.complete) {
          settleHero(criticalHero.naturalWidth > 0 ? "loaded" : "error");
          return;
        }

        criticalHero.addEventListener("load", handleHeroLoad, { once: true });
        criticalHero.addEventListener("error", handleHeroError, { once: true });
        if (criticalHero.complete) {
          settleHero(criticalHero.naturalWidth > 0 ? "loaded" : "error");
        }
      });
    });

    const paint = (value: number) => {
      const rounded = Math.min(100, Math.floor(value));
      if (counter) counter.textContent = String(rounded).padStart(3, "0");
      if (progressLine) progressLine.style.transform = `scaleX(${value / 100})`;

      const diagonalProgress = clamp((value - 4) / 56);
      const horizontalProgress = clamp((value - 60) / 40);

      diagonals.forEach((stroke) => {
        const length = strokeLengths.get(stroke) ?? 0;
        stroke.style.strokeDashoffset = String(length * (1 - diagonalProgress));
      });
      horizontals.forEach((stroke) => {
        const length = strokeLengths.get(stroke) ?? 0;
        stroke.style.strokeDashoffset = String(length * (1 - horizontalProgress));
      });

      tracers.forEach((tracer, index) => {
        const path = diagonals[index];
        if (!path) return;
        const length = strokeLengths.get(path) ?? 0;
        const point = path.getPointAtLength(length * diagonalProgress);
        tracer.setAttribute("cx", point.x.toFixed(2));
        tracer.setAttribute("cy", point.y.toFixed(2));
        tracer.style.opacity = String(1 - clamp((value - 56) / 8));
      });

    };

    const finish = (reason: PortfolioLoaderExitReason) => {
      paint(100);
      if (loader) loader.dataset.exitReason = reason;
      setPhase("complete");
      timers.push(window.setTimeout(() => {
        setPhase("exiting");
        window.dispatchEvent(new Event(pageEntranceEvent));
        window.dispatchEvent(new CustomEvent(PORTFOLIO_LOADER_METRIC_EVENT, {
          detail: createPortfolioLoaderMetric(performance.now() - startedAt, reason, heroStatus),
        }));
        document.body.style.overflow = originalOverflow;
      }, timings.hold));
      timers.push(window.setTimeout(() => setPhase("hidden"), timings.hold + timings.exit));
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const waitingValue = 92 * (1 - Math.exp(-elapsed / 650));
      const readyReason = getPortfolioLoaderExitReason({
        elapsedMs: elapsed,
        minimumMs: timings.minimum,
        structureReady,
        heroReady,
      });

      if (readyReason && finishStartedAt === null) {
        exitReason = readyReason;
        finishStartedAt = now;
        finishStartedFrom = Math.max(displayed, waitingValue);
      }

      if (finishStartedAt !== null) {
        const finishProgress = clamp((now - finishStartedAt) / timings.finish);
        displayed = finishStartedFrom + (100 - finishStartedFrom) * easeOut(finishProgress);
        paint(displayed);
        if (finishProgress >= 1) {
          finish(exitReason ?? "timeout");
          return;
        }
      } else {
        displayed = Math.max(displayed, waitingValue);
        paint(displayed);
      }

      frame = window.requestAnimationFrame(tick);
    };

    paint(0);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(readinessFrame);
      timers.forEach((timer) => window.clearTimeout(timer));
      removeHeroListeners();
      document.body.style.overflow = originalOverflow;
    };
  }, [skipLoader]);

  useEffect(() => {
    if (skipLoader) return;
    if (phase === "loading" || phase === "complete") return;
    const frame = window.requestAnimationFrame(() => {
      const top = window.scrollY;
      if (window.scrollX !== 0) window.scrollTo(0, top);
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [phase, skipLoader]);

  if (skipLoader) return <>{children}</>;

  const contentState = phase === "loading" || phase === "complete" ? "loading" : phase;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT }} />
      {phase !== "hidden" ? (
        <div className={styles.loader} data-phase={phase} data-loader-mode={mode} data-portfolio-loader ref={loaderRef}>
          <div className={`${styles.panel} ${styles.panelLeft}`} aria-hidden="true" />
          <div className={`${styles.panel} ${styles.panelRight}`} aria-hidden="true" />
          <div className={styles.axis} aria-hidden="true"><span /><span /></div>

          <div className={styles.topMeta} aria-hidden="true">
            <p>Alejandro Fink <span>/</span> Portfolio</p>
            <p>Buenos Aires <span>/</span> 2026</p>
          </div>

          <div className={styles.markStage} aria-hidden="true">
            <svg className={styles.mark} viewBox="0 0 48 36">
              <g className={styles.markSymbol}>
                <path className={styles.markLead} data-logo-diagonal d="M5 32L20.5 4" />
                <path className={styles.markAccent} data-logo-horizontal d="M33 21H42" />
                <path className={styles.markBody} data-logo-diagonal d="M21.5 32L34.4 7" />
                <path className={styles.markBody} data-logo-horizontal d="M34.4 7C35.1 5.6 36.3 4.8 38 4.8H44" />
                <circle className={styles.markLeadTracer} data-logo-tracer cx="5" cy="32" r="3.2" />
                <circle className={styles.markBodyTracer} data-logo-tracer cx="21.5" cy="32" r="3.2" />
              </g>
            </svg>
          </div>

          <div className={styles.bottomMeta}>
            <p aria-hidden="true"><span className={styles.statusDot} /> {copy.loading}</p>
            <p className="sr-only" role="status" aria-live="polite">
              {phase === "complete" ? copy.readyStatus : copy.loadingStatus}
            </p>
            <strong ref={counterRef} aria-hidden="true">000</strong>
          </div>

          <div className={styles.progressTrack} aria-hidden="true"><span ref={progressRef} /></div>
        </div>
      ) : null}

      <div className={styles.content} data-loader-mode={mode} data-loader-state={contentState}>
        {children}
      </div>

      <noscript><style>{`.${styles.loader}{display:none!important}`}</style></noscript>
    </>
  );
}
