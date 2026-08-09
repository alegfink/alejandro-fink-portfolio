import { describe, expect, it } from "vitest";
import { projects, validateProjects } from "../content/projects";
import { switchLocalePath } from "../lib/i18n";
import { validateContactPayload } from "../lib/contact";

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
  it("rejects invalid data", () => {
    expect(validateContactPayload({ name: "A", email: "bad", need: "magic", message: "short", locale: "es" }).valid).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    expect(validateContactPayload({ name: "Ada", email: "ada@example.com", need: "product", message: "I need a useful product validation flow.", locale: "en" }).valid).toBe(true);
  });
});
