import type { Metadata } from "next";
import { PortfolioV2Privacy } from "@/components/v2/portfolio-privacy";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "es",
  path: "/privacidad",
  alternatePath: "/en/privacy",
  title: "Privacidad — Alejandro Fink",
  description: "Política de privacidad y preferencias de medición del portfolio de Alejandro Fink.",
  noIndex: false,
});

export default function PrivacyPage() {
  return <PortfolioV2Privacy locale="es" />;
}
