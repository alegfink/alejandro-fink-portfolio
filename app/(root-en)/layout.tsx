import type { Metadata } from "next";
import "@fontsource/anton";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "../globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { PortfolioV2Loader } from "@/components/v2/portfolio-loader";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: "Alejandro Fink",
  authors: [{ name: "Alejandro Fink" }],
  creator: "Alejandro Fink",
  formatDetection: { email: false, address: false, telephone: false },
};

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AnalyticsProvider /><PortfolioV2Loader>{children}</PortfolioV2Loader></body></html>;
}
