import type { Metadata } from "next";
import { PortfolioV2Home } from "@/components/v2/portfolio-home";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "es",
  path: "/",
  alternatePath: "/en",
  title: "Alejandro Fink — E-commerce & Digital Operations",
  description: "Portfolio de Alejandro Fink: e-commerce, producto, UX y operaciones digitales conectados para convertir necesidades comerciales en soluciones funcionales.",
  noIndex: false,
});

export default function RootPage() {
  return <PortfolioV2Home locale="es" />;
}
