import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactView } from "@/views/contact-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { getContactConfig } from "@/lib/contact";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return [{ locale: "es" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "es") return {};
  const copy = siteCopy.es.contact;
  return buildMetadata({ locale: "es", path: "/es/contacto", alternatePath: "/en/contact", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "es") notFound(); return <ContactView locale="es" enabled={getContactConfig().enabled} />; }
