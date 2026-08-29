const GOOGLE_ANALYTICS_DATA_API = "https://analyticsdata.googleapis.com/v1beta";

type GaValue = { value?: string };
type GaRow = { dimensionValues?: GaValue[]; metricValues?: GaValue[] };
type GaReport = {
  dimensionHeaders?: Array<{ name?: string }>;
  metricHeaders?: Array<{ name?: string; type?: string }>;
  rows?: GaRow[];
  rowCount?: number;
};

export type AnalyticsDashboardSummary = {
  devices: Array<{ activeUsers: number; category: string }>;
  events: {
    contactClicks: number;
    externalLinks: number;
    formStarts: number;
    leads: number;
    projectOpens: number;
  };
  generatedAt: string;
  overview: {
    activeUsers: number;
    averageSessionDuration: number;
    engagedSessions: number;
    engagementRate: number;
    pageViews: number;
    sessions: number;
  };
  range: { endDate: string; label: string; startDate: string };
  realtime: { activeUsers: number; eventCount: number };
  topPages: Array<{ activeUsers: number; pagePath: string; pageTitle: string; views: number }>;
  topProjects: Array<{ opens: number; projectId: string }>;
  topSources: Array<{ activeUsers: number; channel: string; sessions: number }>;
  unavailableSections: string[];
};

export class GoogleAnalyticsDataError extends Error {
  constructor(public status: number, public detail: string) {
    super(`google_analytics_data_${status}`);
  }
}

function metric(row: GaRow | undefined, index: number) {
  const value = Number(row?.metricValues?.[index]?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function dimension(row: GaRow | undefined, index: number) {
  return row?.dimensionValues?.[index]?.value?.trim() || "(sin datos)";
}

async function requestReport(accessToken: string, propertyId: string, method: "runRealtimeReport" | "runReport", body: unknown) {
  const response = await fetch(`${GOOGLE_ANALYTICS_DATA_API}/properties/${encodeURIComponent(propertyId)}:${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 800);
    throw new GoogleAnalyticsDataError(response.status, detail);
  }
  return response.json() as Promise<GaReport>;
}

const dateRange = [{ startDate: "30daysAgo", endDate: "today" }];

async function fetchOverview(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "engagementRate" },
    ],
  });
  const row = report.rows?.[0];
  return {
    activeUsers: metric(row, 0),
    sessions: metric(row, 1),
    pageViews: metric(row, 2),
    engagedSessions: metric(row, 3),
    averageSessionDuration: metric(row, 4),
    engagementRate: metric(row, 5),
  };
}

async function fetchEvents(accessToken: string, propertyId: string) {
  const names = ["contact_cta", "contact_channel_click", "contact_form_start", "generate_lead", "project_open", "external_link"];
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: names } } },
    limit: String(names.length),
  });
  const counts = Object.fromEntries((report.rows ?? []).map((row) => [dimension(row, 0), metric(row, 0)]));
  return {
    contactClicks: (counts.contact_cta ?? 0) + (counts.contact_channel_click ?? 0),
    externalLinks: counts.external_link ?? 0,
    formStarts: counts.contact_form_start ?? 0,
    leads: counts.generate_lead ?? 0,
    projectOpens: counts.project_open ?? 0,
  };
}

async function fetchTopPages(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: "6",
  });
  return (report.rows ?? []).map((row) => ({
    pagePath: dimension(row, 0),
    pageTitle: dimension(row, 1),
    views: metric(row, 0),
    activeUsers: metric(row, 1),
  }));
}

async function fetchTopSources(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }, { name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: "6",
  });
  return (report.rows ?? []).map((row) => ({
    channel: dimension(row, 0),
    sessions: metric(row, 0),
    activeUsers: metric(row, 1),
  }));
}

async function fetchDevices(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
  });
  return (report.rows ?? []).map((row) => ({ category: dimension(row, 0), activeUsers: metric(row, 0) }));
}

async function fetchTopProjects(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runReport", {
    dateRanges: dateRange,
    dimensions: [{ name: "customEvent:project_id" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { matchType: "EXACT", value: "project_open" } } },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: "6",
  });
  return (report.rows ?? [])
    .map((row) => ({ projectId: dimension(row, 0), opens: metric(row, 0) }))
    .filter((project) => project.projectId !== "(sin datos)");
}

async function fetchRealtime(accessToken: string, propertyId: string) {
  const report = await requestReport(accessToken, propertyId, "runRealtimeReport", {
    metrics: [{ name: "activeUsers" }, { name: "eventCount" }],
  });
  return { activeUsers: metric(report.rows?.[0], 0), eventCount: metric(report.rows?.[0], 1) };
}

function settledValue<T>(result: PromiseSettledResult<T>, fallback: T, section: string, unavailable: string[]) {
  if (result.status === "fulfilled") return result.value;
  unavailable.push(section);
  return fallback;
}

export async function fetchAnalyticsDashboardSummary(accessToken: string, propertyId: string): Promise<AnalyticsDashboardSummary> {
  const overview = await fetchOverview(accessToken, propertyId);
  const [eventsResult, pagesResult, sourcesResult, devicesResult, projectsResult, realtimeResult] = await Promise.allSettled([
    fetchEvents(accessToken, propertyId),
    fetchTopPages(accessToken, propertyId),
    fetchTopSources(accessToken, propertyId),
    fetchDevices(accessToken, propertyId),
    fetchTopProjects(accessToken, propertyId),
    fetchRealtime(accessToken, propertyId),
  ] as const);
  const unavailableSections: string[] = [];

  return {
    generatedAt: new Date().toISOString(),
    range: { startDate: "30daysAgo", endDate: "today", label: "Últimos 30 días" },
    overview,
    events: settledValue(eventsResult, { contactClicks: 0, externalLinks: 0, formStarts: 0, leads: 0, projectOpens: 0 }, "eventos", unavailableSections),
    topPages: settledValue(pagesResult, [], "páginas", unavailableSections),
    topSources: settledValue(sourcesResult, [], "adquisición", unavailableSections),
    devices: settledValue(devicesResult, [], "dispositivos", unavailableSections),
    topProjects: settledValue(projectsResult, [], "proyectos", unavailableSections),
    realtime: settledValue(realtimeResult, { activeUsers: 0, eventCount: 0 }, "tiempo real", unavailableSections),
    unavailableSections,
  };
}
