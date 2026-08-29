import type { Metadata } from "next";
import { PortfolioV2Home } from "@/components/v2/portfolio-home";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "Alejandro Fink — E-commerce & Digital Operations",
  description: "Portfolio de Alejandro Fink: e-commerce, producto, UX y operaciones digitales conectados para convertir necesidades comerciales en soluciones funcionales.",
  alternates: { canonical: "/v2", languages: { "es-AR": "/v2", en: "/v2/en" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2Page() {
  return <PortfolioV2Home locale="es" />;
}
