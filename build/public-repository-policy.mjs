import { execFileSync, spawnSync } from "node:child_process";

const allowedEnvironmentFiles = new Set([".env.example"]);
const blockedRootDirectories = [
  ".agents/",
  ".codex-remote-attachments/",
  "00_SISTEMA/",
  "01_PERFIL_Y_POSICIONAMIENTO/",
  "02_EVIDENCIA_Y_PROYECTOS/",
  "03_SERVICIOS_Y_OFERTAS/",
  "04_ESTRATEGIA_DE_CARRERA/",
  "05_CRITERIOS_DE_OPORTUNIDAD/",
  "06_ACTIVOS_PROFESIONALES/",
  "07_SKILLS/",
  "08_PIPELINES/",
  "09_METRICAS_Y_APRENDIZAJE/",
  "10_DESARROLLO_DE_HABILIDADES/",
  "99_ARCHIVO/",
  "aportes-ale/",
  "assets/",
  "artifacts/brand/",
  "output/",
  "outputs/",
  "scripts/",
  "tmp/",
  "work33_sheet/",
];

const deletedFiles = new Set(
  execFileSync("git", ["ls-files", "--deleted", "-z"], { encoding: "utf8" })
    .split("\0")
    .filter(Boolean)
    .map((file) => file.replaceAll("\\", "/")),
);
const trackedFiles = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean)
  .map((file) => file.replaceAll("\\", "/"))
  .filter((file) => !deletedFiles.has(file));

const pathViolations = trackedFiles.filter((file) => {
  const basename = file.split("/").at(-1) ?? file;
  const isEnvironmentFile = basename === ".env" || basename.startsWith(".env.");
  return (isEnvironmentFile && !allowedEnvironmentFiles.has(file))
    || blockedRootDirectories.some((directory) => file.startsWith(directory))
    || file === "AGENTS.md"
    || /^CV_.*\.pdf$/i.test(file);
});

const sensitiveContentPattern = [
  "docs\\.google\\.com/spreadsheets/d/",
  "analytics\\.google\\.com/analytics/web/#/a[0-9]+p[0-9]+",
  "G-[A-Z0-9]{8,14}",
  "GOOGLE_ANALYTICS_PROPERTY_ID" + "=[0-9]+",
  "ANALYTICS_ALLOWED_EMAIL" + "=[^[:space:]]+",
  "-----BEGIN [A-Z ]*PRIVATE KEY-----",
  "AKIA[0-9A-Z]{16}",
  "github_pat_[A-Za-z0-9_]{20,}",
  "gh[pousr]_[A-Za-z0-9_]{20,}",
  "sk-proj-[A-Za-z0-9_-]{20,}",
].join("|");
const contentScan = spawnSync(
  "git",
  ["grep", "-I", "-l", "-E", sensitiveContentPattern, "--", "."],
  { encoding: "utf8" },
);
if (contentScan.status !== 0 && contentScan.status !== 1) {
  throw new Error(contentScan.stderr || "Unable to scan public repository content.");
}
const contentViolations = contentScan.stdout
  .split(/\r?\n/)
  .filter(Boolean)
  .map((file) => `${file} (sensitive public content)`);
const violations = [...pathViolations, ...contentViolations];

if (violations.length > 0) {
  console.error("Public repository boundary violation:");
  for (const file of violations) console.error(`- ${file}`);
  process.exit(1);
}

console.log("Public repository boundary verified.");
