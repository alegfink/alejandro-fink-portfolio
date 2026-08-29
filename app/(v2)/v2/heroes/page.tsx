import type { Metadata } from "next";
import { HeroLab } from "@/components/v2/hero-lab";

export const metadata: Metadata = {
  title: "Portfolio V2 — Laboratorio de Heroes",
  description: "Cinco direcciones interactivas para explorar el Hero del Portfolio V2 de Alejandro Fink.",
  robots: { index: false, follow: false },
};

export default function PortfolioV2HeroLabPage() {
  return <main><HeroLab /></main>;
}
