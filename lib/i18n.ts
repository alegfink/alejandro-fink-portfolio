export const locales = ["es", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const routeNames = {
  es: {
    home: "/es",
    work: "/es/proyectos",
    about: "/es/sobre-mi",
    contact: "/es/contacto",
    privacy: "/es/privacidad",
  },
  en: {
    home: "/en",
    work: "/en/work",
    about: "/en/about",
    contact: "/en/contact",
    privacy: "/en/privacy",
  },
} as const;

const sectionEquivalents: Record<string, string> = {
  proyectos: "work",
  work: "proyectos",
  "sobre-mi": "about",
  about: "sobre-mi",
  contacto: "contact",
  contact: "contacto",
  privacidad: "privacy",
  privacy: "privacidad",
};

export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  const source = parts[0];

  if (!isLocale(source)) return routeNames[target].home;

  const rest = parts.slice(1);
  if (rest[0] && sectionEquivalents[rest[0]]) {
    rest[0] = sectionEquivalents[rest[0]];
  }

  return `/${target}${rest.length ? `/${rest.join("/")}` : ""}`;
}

export function projectBase(locale: Locale): string {
  return locale === "es" ? "/es/proyectos" : "/en/work";
}
