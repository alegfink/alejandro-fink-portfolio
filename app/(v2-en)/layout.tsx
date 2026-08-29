import type { Metadata } from "next";
import "@fontsource/anton";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "../globals.css";
import { PortfolioV2Loader } from "@/components/v2/portfolio-loader";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
};

export default function PortfolioV2EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PortfolioV2Loader>{children}</PortfolioV2Loader></body>
    </html>
  );
}
