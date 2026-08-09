export type AnalyticsEventMap = {
  language_change: { from: "es" | "en"; to: "es" | "en"; path: string };
  project_open: { projectId: string; locale: "es" | "en"; placement: "home" | "index" | "case" };
  contact_cta: { locale: "es" | "en"; placement: "header" | "hero" | "case" | "footer" };
  contact_submit_attempt: { locale: "es" | "en" };
  contact_submit_success: { locale: "es" | "en" };
  contact_submit_error: { locale: "es" | "en"; reason: "validation" | "provider" | "network" };
  external_link: { locale: "es" | "en"; destination: string; context: "project" };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsAdapter = {
  track<Name extends AnalyticsEventName>(name: Name, payload: AnalyticsEventMap[Name]): void;
};

const disabledAdapter: AnalyticsAdapter = {
  track() {
    // Deliberately inert: no provider, cookies or personal data are enabled by default.
  },
};

export function getAnalyticsAdapter(): AnalyticsAdapter {
  return disabledAdapter;
}

export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  payload: AnalyticsEventMap[Name],
): void {
  getAnalyticsAdapter().track(name, payload);
}
