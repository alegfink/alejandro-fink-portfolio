import type { Metadata } from "next";
import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "404 — Alejandro Fink",
  description: "Página no encontrada · Page not found",
};

export default function LocaleNotFound() {
  return <NotFoundView />;
}
