import type { Metadata } from "next";
import { RootRedirect } from "@/components/root-redirect";

export const metadata: Metadata = {
  title: "Alejandro Fink — Portfolio",
  description: "Elegí un idioma · Choose a language",
  robots: { index: false, follow: true },
};

export default function RootPage() {
  return <RootRedirect />;
}
