import type { Locale } from "@/lib/i18n";
import { v2ContactProfiles, whatsappContactUrl } from "@/lib/v2-i18n";
import { V2TrackedContactLink } from "@/components/v2/v2-tracked-contact-link";
import styles from "@/components/v2/v2-contact-strip.module.css";

const channelIds = ["whatsapp", "linkedin", "github"] as const;

const contactCopy = {
  es: {
    eyebrow: "Otros canales",
    title: "También podemos encontrarnos por acá.",
    label: "Canales alternativos de contacto",
    channels: [
      { name: "WhatsApp", detail: "Mensaje directo" },
      { name: "LinkedIn", detail: "Perfil profesional" },
      { name: "GitHub", detail: "Portfolio y repositorios" },
    ],
  },
  en: {
    eyebrow: "Other channels",
    title: "We can also connect over here.",
    label: "Alternative contact channels",
    channels: [
      { name: "WhatsApp", detail: "Direct message" },
      { name: "LinkedIn", detail: "Professional profile" },
      { name: "GitHub", detail: "Portfolio and repositories" },
    ],
  },
} as const;

export function V2ContactStrip({ locale, tone = "light" }: Readonly<{ locale: Locale; tone?: "light" | "dark" }>) {
  const copy = contactCopy[locale];
  const links = [whatsappContactUrl(locale), v2ContactProfiles.linkedin, v2ContactProfiles.github];

  return (
    <aside className={styles.strip} data-tone={tone} aria-label={copy.label}>
      <div className={styles.intro}>
        <p><span aria-hidden="true">+</span>{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
      </div>
      <nav className={styles.channels} aria-label={copy.label}>
        {copy.channels.map((channel, index) => (
          <V2TrackedContactLink
            channel={channelIds[index]}
            href={links[index]}
            locale={locale}
            placement="contact_strip"
            target="_blank"
            rel="noreferrer"
            key={channel.name}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div><strong>{channel.name}</strong><small>{channel.detail}</small></div>
            <i aria-hidden="true">↗</i>
          </V2TrackedContactLink>
        ))}
      </nav>
    </aside>
  );
}
