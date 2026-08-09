"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    const stored = window.localStorage.getItem("af-language");
    const locale = stored === "es" || stored === "en" ? stored : navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    router.replace(`/${locale}`);
  }, [router]);

  return (
    <main className="language-gate">
      <div className="language-gate__mark">AF</div>
      <p>Elegí un idioma · Choose a language</p>
      <div><Link prefetch={false} href="/es">Español</Link><Link prefetch={false} href="/en">English</Link></div>
    </main>
  );
}
