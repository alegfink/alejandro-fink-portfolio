import type { Metadata } from "next";
import "@fontsource-variable/instrument-sans";
import "../globals.css";
import { getSiteUrl } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Portfolio V1 — Archivo de Alejandro Fink",
  description: "Archivo privado de la versión anterior del portfolio de Alejandro Fink.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function ArchiveLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
