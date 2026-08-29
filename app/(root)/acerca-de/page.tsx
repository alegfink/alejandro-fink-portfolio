import type { Metadata } from "next";
import { PortfolioV2About } from "@/components/v2/portfolio-about";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "es",
  path: "/acerca-de",
  alternatePath: "/en/about",
  title: "Acerca de — Alejandro Fink",
  description: "El recorrido de Alejandro Fink entre sistemas, datos, producto, e-commerce y operaciones digitales.",
  noIndex: false,
});

export default function AboutPage() {
  return <PortfolioV2About locale="es" />;
}
