import type { Metadata } from "next";
import { PortfolioV2Projects } from "@/components/v2/portfolio-projects";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "Proyectos — Alejandro Fink",
  description: "Archivo de proyectos de Alejandro Fink: desafío, servicios, rol y recursos visuales de cada experiencia digital.",
  alternates: { canonical: "/v2/proyectos", languages: { "es-AR": "/v2/proyectos", en: "/v2/en/projects" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2ProjectsPage() {
  return <PortfolioV2Projects locale="es" />;
}
