"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackContactChannel, type ContactChannel, type ContactPlacement } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n";

type V2TrackedContactLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  channel: ContactChannel;
  children: ReactNode;
  href: string;
  locale: Locale;
  placement: ContactPlacement;
};

export function V2TrackedContactLink({ channel, locale, placement, onClick, ...props }: V2TrackedContactLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackContactChannel(locale, channel, placement);
        onClick?.(event);
      }}
    />
  );
}
