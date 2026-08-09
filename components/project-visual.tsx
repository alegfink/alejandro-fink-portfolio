import Image from "next/image";
import type { ProjectMedia } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

export function ProjectVisual({ media, locale, priority = false, className = "" }: { media: ProjectMedia; locale: Locale; priority?: boolean; className?: string }) {
  return (
    <figure className={`project-visual project-visual--${media.tone} ${className}`}>
      <div className="project-visual__frame">
        <Image
          src={media.src}
          alt={media.alt[locale]}
          fill
          priority={priority}
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 90vw, 1200px"
          className={media.mobileSrc ? "project-visual__desktop" : undefined}
        />
        {media.mobileSrc ? (
          <Image
            src={media.mobileSrc}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 720px) 100vw, 1px"
            className="project-visual__mobile"
          />
        ) : null}
      </div>
      <figcaption><span>{media.caption[locale]}</span><span aria-hidden="true">↗</span></figcaption>
    </figure>
  );
}
