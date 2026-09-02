import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "artifacts/**",
    "coverage/**",
    "dist/**",
    "node_modules/**",
    "scripts/**",
    "tmp/**",
    "work33_sheet/**",
    "next-env.d.ts",
  ]),
]);
