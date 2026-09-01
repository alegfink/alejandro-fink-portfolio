import { describe, expect, it, vi } from "vitest";
import {
  PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT,
  PORTFOLIO_LOADER_SESSION_KEY,
  hasSeenPortfolioLoader,
  markPortfolioLoaderSeen,
} from "@/lib/loader-session";

describe("portfolio loader session policy", () => {
  it("shows the branded loader until the current tab has seen it once", () => {
    const storage = new Map<string, string>();
    const sessionStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    };

    expect(hasSeenPortfolioLoader(sessionStorage)).toBe(false);
    expect(markPortfolioLoaderSeen(sessionStorage)).toBe(true);
    expect(hasSeenPortfolioLoader(sessionStorage)).toBe(true);
    expect(storage.get(PORTFOLIO_LOADER_SESSION_KEY)).toBe("1");
  });

  it("fails open and keeps the first-entry loader when storage is unavailable", () => {
    const blockedStorage = {
      getItem: vi.fn(() => { throw new Error("blocked"); }),
      setItem: vi.fn(() => { throw new Error("blocked"); }),
    };

    expect(hasSeenPortfolioLoader(blockedStorage)).toBe(false);
    expect(markPortfolioLoaderSeen(blockedStorage)).toBe(false);
  });

  it("ships an inline bootstrap that only reads the session flag", () => {
    expect(PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT).toContain(PORTFOLIO_LOADER_SESSION_KEY);
    expect(PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT).toContain("portfolioLoaderSeen");
    expect(PORTFOLIO_LOADER_BOOTSTRAP_SCRIPT).not.toContain("localStorage");
  });
});
