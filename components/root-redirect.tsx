"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation avoids the Vinext Link runtime failure in Sites production. */

import { useEffect } from "react";

export function RootRedirect() {
  useEffect(() => {
    const stored = window.localStorage.getItem("af-language");
    const locale = stored === "es" || stored === "en" ? stored : navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    window.location.replace(`/${locale}`);
  }, []);

  return (
    <main className="language-gate">
      <div className="language-gate__mark">AF</div>
      <p>Elegí un idioma · Choose a language</p>
      <div><a href="/es">Español</a><a href="/en">English</a></div>
    </main>
  );
}
