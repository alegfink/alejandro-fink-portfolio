import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "../globals.css";
import "../portfolio.css";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Alejandro Fink | E-commerce & Digital Operations",
  description: "Alejandro Fink’s portfolio: e-commerce, product, UX, Shopify, digital operations and implementation coordinated with AI or specialists.",
};

export default function RootRedirectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
