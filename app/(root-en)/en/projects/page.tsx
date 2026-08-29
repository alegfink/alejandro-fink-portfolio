import type { Metadata } from "next";
import { PortfolioV2Projects } from "@/components/v2/portfolio-projects";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/en/projects",
  alternatePath: "/proyectos",
  title: "Work — Alejandro Fink",
  description: "Alejandro Fink's project archive: challenge, services, role and visual resources for each digital experience.",
  noIndex: false,
});

export default function EnglishProjectsPage() {
  return <PortfolioV2Projects locale="en" />;
}
