# Alejandro Fink — E-commerce & Digital Operations Portfolio

[Live portfolio](https://www.alejandrofink.com/) · [LinkedIn](https://www.linkedin.com/in/alejandro-fink/) · [Email](mailto:alegfink@gmail.com)

![Portfolio preview](public/og.png)

Bilingual portfolio and selected-work system for Alejandro Fink, an e-commerce and digital operations generalist based in Buenos Aires. It presents production work, MVPs and prototypes with explicit evidence boundaries while keeping technology as execution and validation context.

## What this repository demonstrates

- A typed Spanish/English content model shared across routes and project pages.
- Product-oriented case studies that connect business context, UX decisions, operations and implementation.
- Responsive editorial UI built with React, TypeScript and a Next.js-compatible App Router.
- Consent-first analytics with sanitized attribution and no form content sent to analytics.
- A contact flow that remains disabled unless its server-side delivery configuration is complete.
- Automated linting, type checking, content/contract tests and production build validation.

## Selected work

| Project | Status | Focus | Public link |
|---|---|---|---|
| Torvena | Owned e-commerce in production | Product selection, suppliers, Shopify, catalog, purchase experience, content, support, orders and fulfillment | [torvena.com.ar](https://torvena.com.ar/) |
| Brisa do Mar | Operational business solution | Multilingual discovery, pricing model and contextual WhatsApp enquiries | [View site](https://brisa-do-mar-arraial.alegfink.chatgpt.site/) |
| CUIDALO | Validation MVP, not a launched store | Offer architecture, cart intent and measurement | [View MVP](https://cuidalo-argentina.alegfink.chatgpt.site/) |

The portfolio also documents functional prototypes and projects in development. Each case states its real maturity and avoids presenting prototypes as commercial operations.

## Stack and architecture

Technology is documented here as implementation and validation evidence, not as Alejandro’s primary professional identity.

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

## AI-assisted implementation

AI supported research, prototyping, implementation and iteration. Alejandro defined scope and functional criteria, reviewed changes, tested outcomes and validated the published result, using specialist depth where needed. The repository is evidence of the resulting system, not a claim of autonomous software engineering or unaided authorship.

## Repository scope and rights

This public repository is a sanitized portfolio snapshot. Private operational documentation, credentials, lead data and client intake material are intentionally excluded. Project media is governed by the attribution record in [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md). No general reuse license is granted unless stated separately.

---

### Español

Portfolio bilingüe de e-commerce, producto, UX, operaciones digitales y soluciones funcionales. Los casos distinguen explícitamente entre producción, MVP, prototipo y trabajo en desarrollo. Las tecnologías y los checks se conservan como evidencia de implementación y validación.

[Portfolio en español](https://www.alejandrofink.com/es)
