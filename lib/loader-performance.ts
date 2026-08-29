export const PORTFOLIO_LOADER_METRIC_EVENT = "af:portfolio-loader-metric";
export const PORTFOLIO_LOADER_SAFETY_TIMEOUT_MS = 7_000;
export const PORTFOLIO_LOADER_SLOW_THRESHOLD_MS = 4_000;

export type PortfolioLoaderExitReason = "ready" | "timeout";
export type PortfolioLoaderHeroStatus = "loaded" | "not-required" | "error" | "pending";

export type PortfolioLoaderMetric = Readonly<{
  durationMs: number;
  outcome: PortfolioLoaderExitReason;
  heroStatus: PortfolioLoaderHeroStatus;
  slow: boolean;
}>;

export function getPortfolioLoaderExitReason({
  elapsedMs,
  minimumMs,
  structureReady,
  heroReady,
}: Readonly<{
  elapsedMs: number;
  minimumMs: number;
  structureReady: boolean;
  heroReady: boolean;
}>): PortfolioLoaderExitReason | null {
  if (elapsedMs >= PORTFOLIO_LOADER_SAFETY_TIMEOUT_MS) return "timeout";
  if (elapsedMs >= minimumMs && structureReady && heroReady) return "ready";
  return null;
}

export function createPortfolioLoaderMetric(
  durationMs: number,
  outcome: PortfolioLoaderExitReason,
  heroStatus: PortfolioLoaderHeroStatus,
): PortfolioLoaderMetric {
  const safeDuration = Math.max(0, Math.round(durationMs));
  return {
    durationMs: safeDuration,
    outcome,
    heroStatus,
    slow: safeDuration >= PORTFOLIO_LOADER_SLOW_THRESHOLD_MS,
  };
}

export function isPortfolioLoaderMetric(value: unknown): value is PortfolioLoaderMetric {
  if (!value || typeof value !== "object") return false;
  const metric = value as Partial<PortfolioLoaderMetric>;
  return typeof metric.durationMs === "number"
    && Number.isFinite(metric.durationMs)
    && (metric.outcome === "ready" || metric.outcome === "timeout")
    && ["loaded", "not-required", "error", "pending"].includes(metric.heroStatus ?? "")
    && typeof metric.slow === "boolean";
}
