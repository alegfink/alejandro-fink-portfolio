/* eslint-disable @next/next/no-html-link-for-pages -- A global recovery screen uses full document navigation across locale roots. */

export function GlobalNotFoundView() {
  return (
    <main className="global-not-found" id="main-content">
      <div className="global-not-found__top shell">
        <a className="brand" href="/es"><span className="brand__mark" aria-hidden="true">AF</span><span className="brand__name">Alejandro Fink</span></a>
        <span>ERROR / OUTSIDE THE MAP</span>
      </div>
      <div className="global-not-found__body shell">
        <div className="global-not-found__code" aria-hidden="true">404</div>
        <div className="global-not-found__copy">
          <p className="eyebrow">Página no encontrada · Page not found</p>
          <h1>El recorrido sigue desde acá.</h1>
          <p>Elegí un idioma para volver al portfolio. Choose a language to return to the portfolio.</p>
          <div className="global-not-found__languages">
            <a className="button button--primary" href="/es"><span>Continuar en español</span><span aria-hidden="true">↗</span></a>
            <a className="button button--secondary" href="/en"><span>Continue in English</span><span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </main>
  );
}
