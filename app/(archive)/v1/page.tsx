import styles from "./archive.module.css";

export default function PortfolioArchivePage() {
  return (
    <main className={styles.archive}>
      <h1 className="sr-only">Portfolio V1 — archivo</h1>
      <p className={styles.label} aria-hidden="true">V1 · ARCHIVO</p>
      <iframe className={styles.frame} src="/es?archive=v1" title="Versión anterior del portfolio de Alejandro Fink" />
    </main>
  );
}
