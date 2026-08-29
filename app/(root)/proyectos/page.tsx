import type { Metadata } from "next";
import { PortfolioV2Projects } from "@/components/v2/portfolio-projects";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "es",
  path: "/proyectos",
  alternatePath: "/en/projects",
  title: "Proyectos — Alejandro Fink",
  description: "Archivo de proyectos de Alejandro Fink: desafío, servicios, rol y recursos visuales de cada experiencia digital.",
  noIndex: false,
});

export default function ProjectsPage() {
  return <PortfolioV2Projects locale="es" />;
}
