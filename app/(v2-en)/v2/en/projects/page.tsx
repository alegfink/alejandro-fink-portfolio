import type { Metadata } from "next";
import { PortfolioV2Projects } from "@/components/v2/portfolio-projects";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "Work — Alejandro Fink",
  description: "Alejandro Fink's project archive: challenge, services, role and visual resources for each digital experience.",
  alternates: { canonical: "/v2/en/projects", languages: { "es-AR": "/v2/proyectos", en: "/v2/en/projects" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2EnglishProjectsPage() {
  return <PortfolioV2Projects locale="en" />;
}
