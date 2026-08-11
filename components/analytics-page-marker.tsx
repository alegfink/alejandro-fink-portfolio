"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function CaseStudyAnalytics({ projectId, locale, caseType }: { projectId: string; locale: "es" | "en"; caseType: "full" | "compact" }) {
  useEffect(() => {
    trackEvent("case_study_view", { projectId, locale, caseType });
  }, [caseType, locale, projectId]);
  return null;
}
