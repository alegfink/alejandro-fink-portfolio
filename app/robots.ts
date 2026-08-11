import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/urls";
import { indexingEnabled } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  const enabled = indexingEnabled();
  return {
    rules: enabled ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    ...(enabled ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  };
}
