import type { Metadata } from "next";
import { PortfolioV2Privacy } from "@/components/v2/portfolio-privacy";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  locale: "en",
  path: "/en/privacy",
  alternatePath: "/privacidad",
  title: "Privacy — Alejandro Fink",
  description: "Privacy policy and measurement preferences for Alejandro Fink's portfolio.",
  noIndex: false,
});

export default function EnglishPrivacyPage() {
  return <PortfolioV2Privacy locale="en" />;
}
