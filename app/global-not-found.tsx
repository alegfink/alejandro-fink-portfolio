import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "@fontsource-variable/newsreader";
import "./globals.css";
import "./portfolio.css";
import { GlobalNotFoundView } from "@/components/global-not-found-view";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = { metadataBase: getSiteUrl(), title: "404 — Alejandro Fink", description: "Page not found · Página no encontrada" };

export default function GlobalNotFound() {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <GlobalNotFoundView />
      </body>
    </html>
  );
}
