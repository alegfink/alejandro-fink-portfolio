import { describe, expect, it } from "vitest";
import { domainFromUrl, pageGroupFromPath, sanitizeInternalPath, sanitizePageLocation, sanitizeReferrer } from "../lib/analytics";

describe("analytics privacy boundary", () => {
  it("keeps only the path and governed campaign parameters", () => {
    expect(sanitizePageLocation("https://portfolio.example/es/proyectos/torvena?utm_source=linkedin&utm_campaign=lanzamiento&email=ada%40example.com#private"))
      .toBe("https://portfolio.example/es/proyectos/torvena?utm_source=linkedin&utm_campaign=lanzamiento");
  });

  it("drops campaign values that resemble personal contact data", () => {
    expect(sanitizePageLocation("https://portfolio.example/es?utm_source=ada%40example.com&utm_content=5491112345678&utm_medium=organic-social"))
      .toBe("https://portfolio.example/es?utm_medium=organic-social");
  });

  it("reduces external referrers to their origin and internal ones to a clean path", () => {
    expect(sanitizeReferrer("https://www.google.com/search?q=private", "https://portfolio.example")).toBe("https://www.google.com");
    expect(sanitizeReferrer("https://portfolio.example/es/contacto?email=ada", "https://portfolio.example")).toBe("https://portfolio.example/es/contacto");
  });

  it("normalizes internal paths and destination domains", () => {
    expect(sanitizeInternalPath("/en/work/torvena?draft=1")).toBe("/en/work/torvena");
    expect(domainFromUrl("https://www.example.com/path")).toBe("example.com");
  });
});

describe("analytics route grouping", () => {
  it.each([
    ["/", "home"],
    ["/en", "home"],
    ["/proyectos", "work_index"],
    ["/en/projects", "work_index"],
    ["/es/proyectos/torvena", "case_study"],
    ["/acerca-de", "about"],
    ["/en/about", "about"],
    ["/privacidad", "privacy"],
    ["/admin/metricas", "admin"],
    ["/v1", "archive"],
  ])("groups %s as %s", (path, expected) => {
    expect(pageGroupFromPath(path)).toBe(expected);
  });
});
