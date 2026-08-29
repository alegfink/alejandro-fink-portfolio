"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ANALYTICS_INTERNAL_COOKIE, ANALYTICS_INTERNAL_KEY } from "@/lib/analytics";
import { GOOGLE_ANALYTICS_PANEL_URL } from "@/lib/analytics-admin";
import type { AnalyticsDashboardSummary } from "@/lib/google-analytics-data";
import styles from "@/components/admin/analytics-dashboard.module.css";

type DashboardResponse = { accountEmail: string; summary: AnalyticsDashboardSummary };
type DashboardState =
  | { kind: "loading" }
  | { kind: "ready"; data: DashboardResponse }
  | { kind: "signed-out"; message?: string }
  | { kind: "setup"; missing: string[] }
  | { kind: "error"; code: string };

const errorCopy: Record<string, string> = {
  analytics_access_denied: "La cuenta está conectada, pero todavía no tiene acceso de lectura a esta propiedad de Analytics.",
  analytics_unavailable: "Google Analytics no respondió. Podés volver a intentar sin perder la sesión.",
  cancelado: "La conexión con Google fue cancelada. No se modificó nada.",
  oauth: "Google no pudo completar la autorización. Volvé a intentarlo.",
  property_not_found: "No encontramos la propiedad configurada. Hay que revisar su identificador en Google Analytics.",
  sesion_invalida: "La autorización venció antes de terminar. Iniciá la conexión otra vez.",
  sin_permiso: "Esta vista está reservada para la cuenta de Google autorizada.",
};

function formatInteger(value: number) {
  return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "percent", maximumFractionDigits: 1 }).format(value);
}

function formatDuration(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return minutes > 0 ? `${minutes}m ${String(remainder).padStart(2, "0")}s` : `${remainder}s`;
}

function formatUpdatedAt(iso: string) {
  return new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }).format(new Date(iso));
}

function normalizeLabel(value: string) {
  const labels: Record<string, string> = {
    desktop: "Escritorio",
    mobile: "Mobile",
    tablet: "Tablet",
    "(not set)": "Sin identificar",
    "(sin datos)": "Sin identificar",
  };
  return labels[value] ?? value;
}

function InternalTrafficMarker() {
  useEffect(() => {
    window.localStorage.setItem(ANALYTICS_INTERNAL_KEY, "true");
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${ANALYTICS_INTERNAL_COOKIE}=true; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
  }, []);
  return null;
}

function BrandHeader({ onRefresh, refreshing }: { onRefresh?: () => void; refreshing?: boolean }) {
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href="/" aria-label="Volver al portfolio">
        <Image src="/media/v2/alejandro-fink-logo.svg" alt="Alejandro Fink" width={230} height={48} priority />
      </Link>
      <div className={styles.headerActions}>
        {onRefresh ? <button className={styles.secondaryButton} type="button" onClick={onRefresh} disabled={refreshing}>{refreshing ? "Actualizando…" : "Actualizar"}</button> : null}
        <a className={styles.primaryButton} href={GOOGLE_ANALYTICS_PANEL_URL} target="_blank" rel="noreferrer">Abrir GA4 completo <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

function AccessState({ state, onRetry }: { state: Exclude<DashboardState, { kind: "ready" }>; onRetry: () => void }) {
  const isLoading = state.kind === "loading";
  const title = isLoading
    ? "Preparando tus métricas"
    : state.kind === "setup"
      ? "La vista está lista; falta unirla con Google"
      : state.kind === "signed-out"
        ? "Entrá con tu cuenta de Google"
        : "No pudimos traer el resumen";
  const text = isLoading
    ? "Comprobando la sesión y consultando Google Analytics…"
    : state.kind === "setup"
      ? "El panel propio ya está construido. Para leer los datos reales falta habilitar la API y guardar las credenciales privadas de Google."
      : state.kind === "signed-out"
        ? state.message ?? "La cuenta autorizada confirma que sos vos y habilita únicamente lectura de Analytics. No necesitás crear otro usuario."
        : errorCopy[state.code] ?? "Ocurrió un problema temporal. Podés reintentar o abrir el panel completo de Google Analytics.";

  return (
    <main className={styles.accessPage}>
      <div className={styles.noise} aria-hidden="true" />
      <BrandHeader />
      <section className={styles.accessCard} aria-live="polite">
        <p className={styles.eyebrow}>PANEL PRIVADO · GOOGLE ANALYTICS</p>
        <h1>{title}</h1>
        <p className={styles.accessText}>{text}</p>
        {state.kind === "setup" ? (
          <div className={styles.setupNote}>
            <span>{state.missing.length}</span>
            <p><strong>datos de conexión pendientes</strong><br />Se guardarán como secretos del proyecto, nunca dentro de la página pública.</p>
          </div>
        ) : null}
        <div className={styles.accessActions}>
          {state.kind === "signed-out" ? (
            // A normal top-level navigation is intentional: prefetching an OAuth start route would create an unused login attempt.
            // eslint-disable-next-line @next/next/no-html-link-for-pages
            <a className={styles.primaryButton} href="/api/admin/google/start">Continuar con Google <span aria-hidden="true">→</span></a>
          ) : null}
          {state.kind === "error" ? <button className={styles.primaryButton} type="button" onClick={onRetry}>Volver a intentar</button> : null}
          <a className={styles.secondaryButton} href={GOOGLE_ANALYTICS_PANEL_URL} target="_blank" rel="noreferrer">Ir al panel completo <span aria-hidden="true">↗</span></a>
          <Link className={styles.textLink} href="/">Volver al portfolio</Link>
        </div>
      </section>
      <p className={styles.accessFoot}>Una identidad · dos formas de mirar los datos</p>
    </main>
  );
}

function MetricCard({ index, label, value, note }: { index: string; label: string; value: string; note: string }) {
  return (
    <article className={styles.metricCard}>
      <p className={styles.metricMeta}><span>{index}</span>{label}</p>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  );
}

function ProgressList({ items }: { items: Array<{ label: string; meta: string; value: number }> }) {
  const maximum = Math.max(...items.map((item) => item.value), 1);
  if (items.length === 0) return <p className={styles.emptyState}>Todavía no hay suficiente información para ordenar este bloque.</p>;
  return (
    <ol className={styles.progressList}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          <div><span>{item.label}</span><small>{item.meta}</small></div>
          <div className={styles.bar} aria-hidden="true"><span style={{ width: `${Math.max(3, (item.value / maximum) * 100)}%` }} /></div>
        </li>
      ))}
    </ol>
  );
}

function ReadyDashboard({ data, onRefresh, refreshing, onLogout }: { data: DashboardResponse; onRefresh: () => void; refreshing: boolean; onLogout: () => void }) {
  const { summary } = data;
  const contactRate = summary.overview.sessions > 0 ? summary.events.contactClicks / summary.overview.sessions : 0;
  const hasData = summary.overview.sessions > 0 || summary.realtime.eventCount > 0;
  const deviceTotal = Math.max(1, summary.devices.reduce((total, device) => total + device.activeUsers, 0));
  const deviceItems = summary.devices.map((device) => ({
    label: normalizeLabel(device.category),
    meta: `${formatPercent(device.activeUsers / deviceTotal)} · ${formatInteger(device.activeUsers)} usuarios`,
    value: device.activeUsers,
  }));
  const sourceItems = summary.topSources.map((source) => ({
    label: normalizeLabel(source.channel),
    meta: `${formatInteger(source.sessions)} sesiones · ${formatInteger(source.activeUsers)} usuarios`,
    value: source.sessions,
  }));

  return (
    <main className={styles.dashboard}>
      <div className={styles.noise} aria-hidden="true" />
      <BrandHeader onRefresh={onRefresh} refreshing={refreshing} />

      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>LECTURA RÁPIDA · {summary.range.label.toUpperCase()}</p>
          <h1>LO QUE ESTÁ<br />MOVIENDO EL<br /><em>PORTFOLIO</em></h1>
        </div>
        <aside className={styles.realtime}>
          <p><span className={styles.liveDot} /> EN TIEMPO REAL</p>
          <strong>{formatInteger(summary.realtime.activeUsers)}</strong>
          <span>usuarios activos ahora</span>
          <small>{formatInteger(summary.realtime.eventCount)} eventos en los últimos 30 minutos</small>
        </aside>
      </section>

      {!hasData ? (
        <section className={styles.emptyBanner}>
          <span>00</span>
          <div><strong>La conexión funciona, pero GA4 todavía no consolidó visitas.</strong><p>Cuando el portfolio empiece a recibir tráfico, esta misma vista se completa sin tocar el diseño.</p></div>
        </section>
      ) : null}

      <section className={styles.metricsGrid} aria-label="Métricas principales">
        <MetricCard index="01" label="PERSONAS" value={formatInteger(summary.overview.activeUsers)} note={`${formatInteger(summary.overview.sessions)} sesiones en 30 días`} />
        <MetricCard index="02" label="RECORRIDO" value={formatInteger(summary.overview.pageViews)} note={`${formatInteger(summary.events.projectOpens)} aperturas de proyectos`} />
        <MetricCard index="03" label="CONTACTO" value={formatInteger(summary.events.contactClicks)} note={`${formatPercent(contactRate)} de las sesiones`} />
        <MetricCard index="04" label="CALIDAD" value={formatPercent(summary.overview.engagementRate)} note={`${formatDuration(summary.overview.averageSessionDuration)} de sesión promedio`} />
      </section>

      <section className={styles.insightsGrid}>
        <article className={`${styles.panel} ${styles.pagesPanel}`}>
          <div className={styles.panelHeading}><div><span>01</span><p>CONTENIDO</p></div><h2>Páginas que más se ven</h2></div>
          {summary.topPages.length > 0 ? (
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>Página</th><th>Vistas</th><th>Personas</th></tr></thead>
                <tbody>{summary.topPages.map((page) => <tr key={`${page.pagePath}-${page.pageTitle}`}><td><strong>{page.pageTitle || page.pagePath}</strong><small>{page.pagePath}</small></td><td>{formatInteger(page.views)}</td><td>{formatInteger(page.activeUsers)}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className={styles.emptyState}>Las primeras páginas aparecerán acá apenas GA4 consolide las visitas.</p>}
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeading}><div><span>02</span><p>ORIGEN</p></div><h2>Cómo están llegando</h2></div>
          <ProgressList items={sourceItems} />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeading}><div><span>03</span><p>DISPOSITIVOS</p></div><h2>Dónde lo recorren</h2></div>
          <ProgressList items={deviceItems} />
        </article>

        <article className={`${styles.panel} ${styles.actionsPanel}`}>
          <div className={styles.panelHeading}><div><span>04</span><p>INTENCIÓN</p></div><h2>Señales que importan</h2></div>
          <div className={styles.actionStats}>
            <div><strong>{formatInteger(summary.events.projectOpens)}</strong><span>proyectos abiertos</span></div>
            <div><strong>{formatInteger(summary.events.contactClicks)}</strong><span>acciones de contacto</span></div>
            <div><strong>{formatInteger(summary.events.formStarts)}</strong><span>formularios iniciados</span></div>
            <div><strong>{formatInteger(summary.events.leads)}</strong><span>contactos enviados</span></div>
          </div>
          {summary.topProjects.length > 0 ? <ProgressList items={summary.topProjects.map((project) => ({ label: project.projectId, meta: `${formatInteger(project.opens)} aperturas`, value: project.opens }))} /> : null}
        </article>
      </section>

      {summary.unavailableSections.length > 0 ? <p className={styles.partialNotice}>Algunos bloques todavía no están disponibles: {summary.unavailableSections.join(", ")}.</p> : null}

      <footer className={styles.footer}>
        <div><p>ACTUALIZADO {formatUpdatedAt(summary.generatedAt).toUpperCase()}</p><span>{data.accountEmail}</span></div>
        <div><button type="button" onClick={onLogout}>Cerrar sesión</button><Link href="/">Volver al portfolio</Link><a href={GOOGLE_ANALYTICS_PANEL_URL} target="_blank" rel="noreferrer">Ver todo en GA4 ↗</a></div>
      </footer>
    </main>
  );
}

export function AnalyticsDashboard() {
  const [state, setState] = useState<DashboardState>({ kind: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  const statusMessage = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    const code = new URLSearchParams(window.location.search).get("estado") ?? "";
    return errorCopy[code];
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/analytics/summary", { cache: "no-store", credentials: "same-origin" });
      const payload = await response.json() as DashboardResponse | { code?: string; missing?: string[] };
      if (response.ok && "summary" in payload) setState({ kind: "ready", data: payload });
      else if (response.status === 401) setState({ kind: "signed-out", message: statusMessage });
      else if (response.status === 503 && "missing" in payload) setState({ kind: "setup", missing: payload.missing ?? [] });
      else setState({ kind: "error", code: "code" in payload && payload.code ? payload.code : "analytics_unavailable" });
    } catch {
      setState({ kind: "error", code: "analytics_unavailable" });
    } finally {
      setRefreshing(false);
    }
  }, [statusMessage]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const logout = useCallback(async () => {
    await fetch("/api/admin/google/logout", { method: "POST", credentials: "same-origin" });
    setState({ kind: "signed-out" });
  }, []);

  return (
    <>
      <InternalTrafficMarker />
      {state.kind === "ready"
        ? <ReadyDashboard data={state.data} onRefresh={() => void load()} refreshing={refreshing} onLogout={() => void logout()} />
        : <AccessState state={state} onRetry={() => void load()} />}
    </>
  );
}
