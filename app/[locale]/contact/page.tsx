import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactView } from "@/views/contact-view";
import { siteCopy } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { getContactConfig } from "@/lib/contact";

export function generateStaticParams() { return [{ locale: "en" }]; }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  const copy = siteCopy.en.contact;
  return buildMetadata({ locale: "en", path: "/en/contact", alternatePath: "/es/contacto", title: copy.metaTitle, description: copy.metaDescription });
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { if ((await params).locale !== "en") notFound(); return <ContactView locale="en" enabled={getContactConfig().enabled} />; }
