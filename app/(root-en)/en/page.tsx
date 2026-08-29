import type { Metadata } from "next";
import { PortfolioV2Home } from "@/components/v2/portfolio-home";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/en",
  alternatePath: "/",
  title: "Alejandro Fink — E-commerce & Digital Operations",
  description: "Alejandro Fink's portfolio: e-commerce, product, UX and digital operations connected to turn business needs into functional solutions.",
  noIndex: false,
});

export default function EnglishHomePage() {
  return <PortfolioV2Home locale="en" />;
}
