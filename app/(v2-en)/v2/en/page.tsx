import type { Metadata } from "next";
import { PortfolioV2Home } from "@/components/v2/portfolio-home";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "Alejandro Fink — E-commerce & Digital Operations",
  description: "Alejandro Fink's portfolio: e-commerce, product, UX and digital operations connected to turn business needs into functional solutions.",
  alternates: { canonical: "/v2/en", languages: { "es-AR": "/v2", en: "/v2/en" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2EnglishPage() {
  return <PortfolioV2Home locale="en" />;
}
