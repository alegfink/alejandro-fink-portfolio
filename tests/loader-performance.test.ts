import { describe, expect, it } from "vitest";
import {
  PORTFOLIO_LOADER_SAFETY_TIMEOUT_MS,
  createPortfolioLoaderMetric,
  getPortfolioLoaderExitReason,
  isPortfolioLoaderMetric,
} from "@/lib/loader-performance";

describe("portfolio loader performance", () => {
  it("exits normally once the structure and critical hero are ready", () => {
    expect(getPortfolioLoaderExitReason({
      elapsedMs: 900,
      minimumMs: 700,
      structureReady: true,
      heroReady: true,
    })).toBe("ready");
  });

  it("does not let a pending resource block the page beyond seven seconds", () => {
    expect(getPortfolioLoaderExitReason({
      elapsedMs: PORTFOLIO_LOADER_SAFETY_TIMEOUT_MS,
      minimumMs: 700,
      structureReady: false,
      heroReady: false,
    })).toBe("timeout");
  });

  it("keeps waiting before the minimum or while the hero is pending", () => {
    expect(getPortfolioLoaderExitReason({
      elapsedMs: 500,
      minimumMs: 700,
      structureReady: true,
      heroReady: true,
    })).toBeNull();
    expect(getPortfolioLoaderExitReason({
      elapsedMs: 2_000,
      minimumMs: 700,
      structureReady: true,
      heroReady: false,
    })).toBeNull();
  });

  it("marks slow and timeout metrics without accepting malformed payloads", () => {
    const metric = createPortfolioLoaderMetric(7_014.4, "timeout", "pending");
    expect(metric).toEqual({ durationMs: 7_014, outcome: "timeout", heroStatus: "pending", slow: true });
    expect(isPortfolioLoaderMetric(metric)).toBe(true);
    expect(isPortfolioLoaderMetric({ ...metric, durationMs: Number.NaN })).toBe(false);
  });
});
