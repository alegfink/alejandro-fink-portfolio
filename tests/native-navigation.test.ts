import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { NativeLink } from "@/components/v2/native-link";
import { v2Routes } from "@/lib/v2-i18n";

const portfolioNavigationFiles = [
  "hero-lab.tsx",
  "portfolio-about.tsx",
  "portfolio-home.tsx",
  "portfolio-privacy.tsx",
  "portfolio-projects.tsx",
  "v2-language-switcher.tsx",
  "v2-mobile-menu.tsx",
];

describe("portfolio native navigation", () => {
  it("uses the browser anchor primitive", () => {
    expect(NativeLink).toBe("a");
  });

  it.each(portfolioNavigationFiles)("%s does not depend on the Vinext client router", (file) => {
    const source = readFileSync(resolve(process.cwd(), "components", "v2", file), "utf8");

    expect(source).not.toContain(`from "next/link"`);
    expect(source).not.toContain(`from "next/navigation"`);
  });

  it("keeps every public language route explicit", () => {
    expect(v2Routes.es).toEqual({
      home: "/",
      projects: "/proyectos",
      about: "/acerca-de",
      privacy: "/privacidad",
    });
    expect(v2Routes.en).toEqual({
      home: "/en",
      projects: "/en/projects",
      about: "/en/about",
      privacy: "/en/privacy",
    });
  });
});
