"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEventMap, type AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps<Name extends AnalyticsEventName> = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
    eventName?: Name;
    eventPayload?: AnalyticsEventMap[Name];
  };

export function TrackedLink<Name extends AnalyticsEventName>({ eventName, eventPayload, onClick, ...props }: TrackedLinkProps<Name>) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (eventName && eventPayload) trackEvent(eventName, eventPayload);
        onClick?.(event);
      }}
    />
  );
}
