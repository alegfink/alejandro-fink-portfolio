import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, getSiteUrl } from "@/lib/urls";

describe("site URLs", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the configured site origin when it is valid", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com");
    expect(getSiteUrl().origin).toBe("https://preview.example.com");
    expect(absoluteUrl("/og.png")).toBe("https://preview.example.com/og.png");
  });

  it("falls back to the public domain in production builds", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(absoluteUrl("/og.png")).toBe("https://www.alejandrofink.com/og.png");
  });

  it("ignores a local development origin during production builds", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3001");
    expect(absoluteUrl("/og.png")).toBe("https://www.alejandrofink.com/og.png");
  });

  it("does not leak localhost metadata when a production URL is invalid", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "not a url");
    expect(getSiteUrl().origin).toBe("https://www.alejandrofink.com");
  });

  it("keeps the localhost fallback outside production", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });
});
