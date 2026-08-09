import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "../globals.css";
import "../portfolio.css";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Alejandro Fink",
  description: "Web development and digital products for real business needs.",
};

export default function RootRedirectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
