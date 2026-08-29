import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Métricas privadas — Alejandro Fink",
  description: "Panel privado de rendimiento del portfolio de Alejandro Fink.",
  robots: { index: false, follow: false, noarchive: true },
};

export default function AnalyticsAdminPage() {
  return <AnalyticsDashboard />;
}
