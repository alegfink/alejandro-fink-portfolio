import type { Metadata } from "next";
import { PortfolioV2About } from "@/components/v2/portfolio-about";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/en/about",
  alternatePath: "/acerca-de",
  title: "About — Alejandro Fink",
  description: "Alejandro Fink's journey across systems, data, product, e-commerce and digital operations.",
  noIndex: false,
});

export default function EnglishAboutPage() {
  return <PortfolioV2About locale="en" />;
}
