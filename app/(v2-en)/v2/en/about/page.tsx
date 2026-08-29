import type { Metadata } from "next";
import { PortfolioV2About } from "@/components/v2/portfolio-about";
import { indexingEnabled } from "@/lib/metadata";

const shouldIndex = indexingEnabled();

export const metadata: Metadata = {
  title: "About — Alejandro Fink",
  description: "Alejandro Fink's journey across systems, data, product, e-commerce and digital operations.",
  alternates: { canonical: "/v2/en/about", languages: { "es-AR": "/v2/acerca-de", en: "/v2/en/about" } },
  robots: { index: shouldIndex, follow: shouldIndex },
};

export default function PortfolioV2EnglishAboutPage() {
  return <PortfolioV2About locale="en" />;
}
