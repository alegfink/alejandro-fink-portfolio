import { describe, expect, it } from "vitest";
import { projects, validateProjects } from "../content/projects";
import { siteCopy } from "../content/site";
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
      "Landing pública · En producción",
      "Portfolio aprobado · Activación pendiente",
    ]);
  });
});

describe("canonical portfolio positioning", () => {
  it("uses the approved identity in both languages", () => {
    expect(siteCopy.es.descriptor).toBe("E-commerce y operaciones digitales | Producto, Growth, UX y ejecución asistida por IA");
    expect(siteCopy.en.descriptor).toBe("E-commerce & Digital Operations | Product, Growth, UX & AI-Assisted Execution");
    expect(siteCopy.es.home.metaTitle).toBe("Alejandro Fink | E-commerce y operaciones digitales");
    expect(siteCopy.en.home.metaTitle).toBe("Alejandro Fink | E-commerce & Digital Operations");
  });

  it("keeps Torvena evidence while framing the role as operations", () => {
    const torvena = projects.find((project) => project.id === "torvena");
    expect(torvena?.content.es.role).toBe("Fundador y operador de e-commerce");
    expect(torvena?.content.en.role).toBe("Founder and e-commerce operator");
    expect(torvena?.technologies).toEqual(["Shopify Hydrogen", "TypeScript", "Storefront API", "Supabase"]);
  });

  it("does not use prohibited engineering identities in visible content", () => {
    const visibleContent = JSON.stringify({ siteCopy, projects });
    expect(visibleContent).not.toMatch(/Web Developer|Web Solutions Developer|Desarrollador web|Software Engineer|Frontend Engineer|React Engineer/i);
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
  const validInquiry = {
    name: "Ada",
    email: "ada@example.com",
    goal: "validate",
    stage: "no-site",
    challenges: ["no-direction", "unclear-offer"],
    audience: "Independent founders preparing a first product launch.",
    desiredAction: "contact",
    brandTraits: ["clear", "trustworthy"],
    needs: ["product", "strategy"],
    investment: "prefer-not",
    timeline: "1-3-months",
    decisionStage: "needs-definition",
    message: "I need a useful product validation flow.",
    locale: "en",
  } as const;

  const validSubmission = {
    ...validInquiry,
    submissionId: "d9428888-122b-4c1d-8a1a-ea7b8f1f3abc",
    startedAt: 1_000,
    botField: "",
  } as const;

  it("rejects invalid data", () => {
    expect(validateContactPayload({ ...validInquiry, name: "A", email: "bad", needs: ["magic"], message: "short", locale: "es" }).valid).toBe(false);
  });

  it("accepts a complete guided diagnostic", () => {
    expect(validateContactPayload(validInquiry).valid).toBe(true);
  });

  it("accepts a short non-empty audience and optional additional context", () => {
    expect(validateContactPayload({ ...validInquiry, audience: "A", message: "" }).valid).toBe(true);
    expect(validateContactPayload({ ...validInquiry, audience: "   ", message: "" }).valid).toBe(false);
  });

  it("accepts an optional web reference and rejects unsafe protocols", () => {
    expect(validateContactPayload({ ...validInquiry, website: "https://example.com/reference" }).valid).toBe(true);
    expect(validateContactPayload({ ...validInquiry, website: "javascript:alert(1)" }).valid).toBe(false);
  });

  it("limits prioritized selections and requires a written other answer", () => {
    expect(validateContactPayload({ ...validInquiry, challenges: ["low-leads", "low-conversion", "weak-brand", "manual-ops"] }).valid).toBe(false);
    expect(validateContactPayload({ ...validInquiry, goal: "other", goalOther: "" }).valid).toBe(false);
    expect(validateContactPayload({ ...validInquiry, goal: "other", goalOther: "Improve post-sale onboarding" }).valid).toBe(true);
  });

  it("accepts a complete submission after the minimum completion time", () => {
    expect(validateContactSubmission(validSubmission, 1_000 + CONTACT_MIN_COMPLETION_MS).valid).toBe(true);
  });

  it("accepts recent consented attribution and omits stale attribution", () => {
    const now = Date.UTC(2026, 7, 10, 15, 0, 0);
    const attribution = {
      source: "linkedin",
      medium: "organic-social",
      campaign: "portfolio-lanzamiento-2026",
      content: "post-carrusel",
      landingPath: "/en/work/torvena",
      capturedAt: new Date(now - 1_000).toISOString(),
    };
    const current = validateContactSubmission({ ...validSubmission, startedAt: now - CONTACT_MIN_COMPLETION_MS, attribution }, now);
    expect(current).toMatchObject({ valid: true, data: { attribution } });

    const stale = validateContactSubmission({
      ...validSubmission,
      startedAt: now - CONTACT_MIN_COMPLETION_MS,
      attribution: { ...attribution, capturedAt: new Date(now - 31 * 24 * 60 * 60 * 1_000).toISOString() },
    }, now);
    expect(stale).toMatchObject({ valid: true });
    if (stale.valid) expect(stale.data.attribution).toBeUndefined();
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
