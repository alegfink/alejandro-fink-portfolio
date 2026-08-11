# Alejandro Fink — Web Solutions Portfolio

[Live portfolio](https://alejandro-fink-portfolio-2026.alegfink.chatgpt.site/) · [LinkedIn](https://www.linkedin.com/in/alejandro-fink/) · [Email](mailto:alegfink@gmail.com)

![Portfolio preview](public/og.png)

Bilingual portfolio and selected-work system for a Buenos Aires–based web solutions developer. It presents production work, MVPs and prototypes with explicit evidence boundaries instead of treating every project as equally validated.

## What this repository demonstrates

- A typed Spanish/English content model shared across routes and project pages.
- Product-oriented case studies that connect business context, UX decisions and implementation.
- Responsive editorial UI built with React, TypeScript and a Next.js-compatible App Router.
- Consent-first analytics with sanitized attribution and no form content sent to analytics.
- A contact flow that remains disabled unless its server-side delivery configuration is complete.
- Automated linting, type checking, content/contract tests and production build validation.

## Selected work

| Project | Status | Focus | Public link |
|---|---|---|---|
| Torvena | Owned e-commerce in production | Shopify Hydrogen, storefront UX, catalog, analytics and operations | [torvena.com.ar](https://torvena.com.ar/) |
| Brisa do Mar | Operational business website | Multilingual discovery, pricing model and contextual WhatsApp inquiries | [View site](https://brisa-do-mar-arraial.alegfink.chatgpt.site/) |
| CUIDALO | Validation MVP, not a launched store | Offer architecture, cart intent and measurement | [View MVP](https://cuidalo-argentina.alegfink.chatgpt.site/) |

The portfolio also documents functional prototypes and projects in development. Each case states its real maturity and avoids presenting prototypes as commercial operations.

## Stack and architecture

- React 19, TypeScript and Next.js App Router conventions.
- Vinext and Vite for the production build used by OpenAI Sites.
- Local typed content for six project cases.
- Shared views for equivalent Spanish and English routes.
- GA4 adapter with explicit consent and privacy-oriented event contracts.
- Vitest, ESLint and TypeScript checks.

```text
app/          routes, metadata, sitemap and contact endpoint
components/   navigation, analytics, contact and project UI
content/      bilingual site copy and project facts
lib/          i18n, URLs, attribution, analytics and contact contracts
public/       authorized media and attribution records
tests/        content, analytics and contact-contract validation
views/        shared page compositions for both languages
worker/       production request entrypoint
```

## Run locally

Requirements: Node.js 22.13+ and npm 10+.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

PowerShell equivalent:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Full verification:

```bash
npm run check
```

Production contact delivery and analytics remain inert unless valid environment configuration is supplied. Secrets are never committed.

## AI-assisted development

This project was built through an AI-assisted workflow. AI supported research, prototyping, implementation and iteration; Alejandro retained responsibility for scope, decisions, diff review, testing, publication and ongoing operation. The repository is evidence of the resulting system, not a claim that every line was written without assistance.

## Repository scope and rights

This public repository is a sanitized portfolio snapshot. Private operational documentation, credentials, lead data and client intake material are intentionally excluded. Project media is governed by the attribution record in [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md). No general reuse license is granted unless stated separately.

---

### Español

Portfolio bilingüe de soluciones web orientadas a negocio, producto y experiencia de usuario. Los casos distinguen explícitamente entre producción, MVP, prototipo y trabajo en desarrollo. Para conocer el recorrido completo, visitá el [portfolio en español](https://alejandro-fink-portfolio-2026.alegfink.chatgpt.site/es).
