import type { Locale } from "@/lib/i18n";

export type V2Page = "home" | "projects" | "about" | "privacy";

export const v2Routes: Record<Locale, Record<V2Page, string>> = {
  es: {
    home: "/",
    projects: "/proyectos",
    about: "/acerca-de",
    privacy: "/privacidad",
  },
  en: {
    home: "/en",
    projects: "/en/projects",
    about: "/en/about",
    privacy: "/en/privacy",
  },
};

export function getV2Path(locale: Locale, page: V2Page): string {
  return v2Routes[locale][page];
}

export const v2PrivacyRoutes: Record<Locale, string> = {
  es: v2Routes.es.privacy,
  en: v2Routes.en.privacy,
};

export const v2SharedCopy = {
  es: {
    skipHome: "Saltar al contenido",
    skipProjects: "Saltar a los proyectos",
    skipAbout: "Saltar a mi historia",
    mainNav: "Navegación principal",
    home: "Inicio",
    projects: "Proyectos",
    about: "Acerca de",
    contact: "Disponible para colaborar · Hablemos",
    contactLabel: "Escribirle un email a Alejandro",
    contactSubject: "Consulta desde el portfolio",
    privacy: "Privacidad",
    backTop: "Volver arriba",
    backJourney: "Volver al recorrido principal",
    languageLabel: "Selector de idioma",
    languageChange: "Ver el portfolio en inglés",
    loading: "Cargando recorrido",
    loadingStatus: "Cargando portfolio",
    readyStatus: "Portfolio listo",
  },
  en: {
    skipHome: "Skip to content",
    skipProjects: "Skip to the projects",
    skipAbout: "Skip to my story",
    mainNav: "Main navigation",
    home: "Home",
    projects: "Work",
    about: "About",
    contact: "Available to collaborate · Let's talk",
    contactLabel: "Email Alejandro",
    contactSubject: "Inquiry from the portfolio",
    privacy: "Privacy",
    backTop: "Back to top",
    backJourney: "Back to the main journey",
    languageLabel: "Language selector",
    languageChange: "View the portfolio in Spanish",
    loading: "Loading journey",
    loadingStatus: "Loading portfolio",
    readyStatus: "Portfolio ready",
  },
} as const;

export function gmailComposeUrl(locale: Locale): string {
  const copy = v2SharedCopy[locale];
  const body = locale === "es" ? "Hola Alejandro,\n\n" : "Hi Alejandro,\n\n";
  return `https://mail.google.com/mail/?view=cm&fs=1&to=alegfink%40gmail.com&su=${encodeURIComponent(copy.contactSubject)}&body=${encodeURIComponent(body)}`;
}

export function emailContactUrl(locale: Locale): string {
  const copy = v2SharedCopy[locale];
  const body = locale === "es" ? "Hola Alejandro,\n\n" : "Hi Alejandro,\n\n";
  return `mailto:alegfink@gmail.com?subject=${encodeURIComponent(copy.contactSubject)}&body=${encodeURIComponent(body)}`;
}

export const v2ContactProfiles = {
  linkedin: "https://www.linkedin.com/in/alejandro-fink/",
  github: "https://github.com/alegfink",
} as const;

export function whatsappContactUrl(locale: Locale): string {
  const message = locale === "es"
    ? "Hola Alejandro, vi tu portfolio y me gustaría conversar sobre un proyecto."
    : "Hi Alejandro, I saw your portfolio and I’d like to talk about a project.";
  return `https://wa.me/5491162494740?text=${encodeURIComponent(message)}`;
}
