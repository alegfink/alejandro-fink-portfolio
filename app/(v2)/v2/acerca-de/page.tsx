import type { Metadata } from "next";
import { PortfolioV2About } from "@/components/v2/portfolio-about";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "Acerca de — Alejandro Fink",
  description: "El recorrido de Alejandro Fink entre sistemas, datos, producto, e-commerce y operaciones digitales.",
  alternates: { canonical: "/v2/acerca-de", languages: { "es-AR": "/v2/acerca-de", en: "/v2/en/about" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2AboutPage() {
  return <PortfolioV2About locale="es" />;
}
