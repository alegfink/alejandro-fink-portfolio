"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEventMap, type AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps<Name extends AnalyticsEventName> = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    eventName?: Name;
    eventPayload?: AnalyticsEventMap[Name];
  };

export function TrackedLink<Name extends AnalyticsEventName>({ eventName, eventPayload, onClick, ...props }: TrackedLinkProps<Name>) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        if (eventName && eventPayload) trackEvent(eventName, eventPayload);
        onClick?.(event);
      }}
    />
  );
}
