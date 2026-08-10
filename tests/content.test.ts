import { describe, expect, it } from "vitest";
import { projects, validateProjects } from "../content/projects";
import { switchLocalePath } from "../lib/i18n";
import { CONTACT_MIN_COMPLETION_MS, validateContactPayload, validateContactSubmission } from "../lib/contact";

describe("project content model", () => {
  it("contains six valid bilingual projects", () => {
    expect(projects).toHaveLength(6);
    expect(validateProjects(projects)).toEqual([]);
  });

  it("keeps factual public states visible", () => {
    expect(projects.map((project) => project.content.es.statusLabel)).toEqual([
      "Negocio propio · En producción",
      "Solución web · Operativa",
      "MVP de validación · Sin lanzamiento comercial",
      "Propuesta estratégica · Prototipo funcional",
      "Proyecto en desarrollo · Lanzamiento próximo",
      "Portfolio aprobado · Activación pendiente",
    ]);
  });
});

describe("locale route equivalence", () => {
  it("preserves project detail pages", () => {
    expect(switchLocalePath("/es/proyectos/torvena", "en")).toBe("/en/work/torvena");
    expect(switchLocalePath("/en/work/cuidalo", "es")).toBe("/es/proyectos/cuidalo");
  });

  it("maps localized static sections", () => {
    expect(switchLocalePath("/es/sobre-mi", "en")).toBe("/en/about");
    expect(switchLocalePath("/en/privacy", "es")).toBe("/es/privacidad");
  });
});

describe("contact contract", () => {
  const validSubmission = {
    name: "Ada",
    email: "ada@example.com",
    need: "product",
    stage: "starting",
    message: "I need a useful product validation flow.",
    locale: "en",
    submissionId: "d9428888-122b-4c1d-8a1a-ea7b8f1f3abc",
    startedAt: 1_000,
    botField: "",
  } as const;

  it("rejects invalid data", () => {
    expect(validateContactPayload({ name: "A", email: "bad", need: "magic", message: "short", locale: "es" }).valid).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    expect(validateContactPayload({ name: "Ada", email: "ada@example.com", need: "product", stage: "starting", message: "I need a useful product validation flow.", locale: "en" }).valid).toBe(true);
  });

  it("accepts an optional web reference and rejects unsafe protocols", () => {
    const base = { name: "Ada", email: "ada@example.com", need: "evolution", stage: "existing-site", message: "I need to improve an existing product flow.", locale: "en" };
    expect(validateContactPayload({ ...base, website: "https://example.com/reference" }).valid).toBe(true);
    expect(validateContactPayload({ ...base, website: "javascript:alert(1)" }).valid).toBe(false);
  });

  it("accepts a complete submission after the minimum completion time", () => {
    expect(validateContactSubmission(validSubmission, 1_000 + CONTACT_MIN_COMPLETION_MS).valid).toBe(true);
  });

  it("detects the honeypot and rejects submissions completed too quickly", () => {
    expect(validateContactSubmission({ ...validSubmission, botField: "spam" }, 20_000)).toMatchObject({ valid: false, code: "BOT_DETECTED" });
    expect(validateContactSubmission(validSubmission, 1_000 + CONTACT_MIN_COMPLETION_MS - 1)).toMatchObject({ valid: false, code: "FORM_TOO_FAST" });
  });

  it("rejects malformed identifiers and expired forms", () => {
    expect(validateContactSubmission({ ...validSubmission, submissionId: "not-a-uuid" }, 20_000)).toMatchObject({ valid: false, code: "SUBMISSION_ID_INVALID" });
    expect(validateContactSubmission(validSubmission, 1_000 + 2 * 60 * 60 * 1_000 + 1)).toMatchObject({ valid: false, code: "FORM_EXPIRED" });
  });
});
