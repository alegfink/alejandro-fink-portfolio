# Alejandro Fink — portfolio bilingüe

Portfolio profesional de Alejandro Fink construido con Next.js App Router, React, TypeScript y Vinext para OpenAI Sites/Cloudflare. La experiencia canónica combina e-commerce, producto, UX, desarrollo y operación digital sin separar la dirección artística de la utilidad comercial.

## Estado

- Sitio público: `https://www.alejandrofink.com/`.
- Origen canónico: `www.alejandrofink.com`.
- Idiomas: español en la raíz e inglés bajo `/en`.
- Experiencia vigente: V2 editorial; V1 permanece como archivo en `/v1` y no compite como ruta principal.
- Indexación: cerrada por defecto y habilitable únicamente en el hostname oficial mediante `NEXT_PUBLIC_INDEXING_ENABLED=true`.
- Analytics: GA4 sólo después de consentimiento explícito; publicidad, Google Signals y User-ID desactivados.
- Contacto: email estándar en desktop y WhatsApp directo en el menú móvil, con LinkedIn, GitHub y copiar email como alternativas.

## Rutas canónicas

| Español | Inglés |
| --- | --- |
| `/` | `/en` |
| `/proyectos` | `/en/projects` |
| `/acerca-de` | `/en/about` |
| `/privacidad` | `/en/privacy` |

Las rutas históricas equivalentes redirigen hacia esta superficie. `/v1` se conserva como archivo manual y no forma parte del sitemap.

## Requisitos

- Node.js 22.13 o superior.
- npm 10 o superior.

## Instalación y uso

```bash
npm install
cp .env.example .env.local
npm run dev
```

En Windows PowerShell, si la política de ejecución bloquea `npm.ps1`, usar `npm.cmd` con los mismos argumentos.

## Scripts

| Comando | Función |
| --- | --- |
| `npm run dev` | servidor Vinext de desarrollo |
| `npm run build` | build optimizado de producción |
| `npm run start` | servidor del build local |
| `npm run lint` | ESLint para fuente; excluye builds y evidencia generada |
| `npm run typecheck` | TypeScript estricto sin emitir archivos |
| `npm test` | suite Vitest de contenido y contratos |
| `npm run test:e2e` | matriz Playwright configurada |
| `npm run test:e2e:a11y` | Axe y skip link sobre rutas representativas |
| `npm run check` | lint, typecheck, tests y build |

Para probar una instancia ya iniciada:

```powershell
$env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3001"
npm run test:e2e -- --project=chromium-desktop
```

## Arquitectura vigente

```text
app/
├── (root)/                 # rutas canónicas ES
├── (root-en)/              # rutas canónicas EN
├── (v2)/ y (v2-en)/        # aliases archivados que redirigen
├── (archive)/              # V1 preservada
├── [locale]/               # superficie legacy/redirects
├── api/                    # contacto y administración de analytics
├── globals.css
├── robots.ts
└── sitemap.ts
components/v2/              # experiencia editorial vigente
content/projects.ts         # fuente tipada de los seis casos
lib/                        # metadata, i18n, analytics, loader y URLs
public/media/               # medios locales y atribuciones
tests/                      # Vitest
tests/e2e/                  # Playwright + Axe
docs/delivery/              # auditorías y planes de release
artifacts/qa/               # evidencia generada, no fuente productiva
```

## Loader y navegación

El gesto de entrada de marca se ejecuta una sola vez por pestaña/sesión. La clave vive en `sessionStorage`; navegaciones posteriores conservan el contenido inmediato y no repiten la transición bloqueante. Un bootstrap pequeño evita el flash previo a hidratación y los layouts raíz declaran esa mutación controlada.

La navegación usa anchors nativos mientras Vinext mantenga la incompatibilidad documentada con el router cliente. Los redirects canónicos están centralizados en `next.config.ts`.

## Metadata e indexación

`lib/metadata.ts` centraliza títulos, descripciones, canonical, Open Graph, Twitter Card y alternates `es`, `en` y `x-default`. La política segura exige simultáneamente:

1. `NEXT_PUBLIC_INDEXING_ENABLED=true`;
2. `NEXT_PUBLIC_SITE_URL` con hostname `alejandrofink.com` o `www.alejandrofink.com`.

Por lo tanto local y Preview permanecen en `noindex` aunque se copie accidentalmente el flag. El sitemap contiene sólo las ocho rutas canónicas y usa español como `x-default`.

## Variables principales

| Variable | Valor local recomendado | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | canonical y metadata absoluta |
| `NEXT_PUBLIC_INDEXING_ENABLED` | `false` | indexación, sólo activable en dominio oficial |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `disabled` | usar `google-analytics` únicamente en producción verificada |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | vacío | ID público `G-…` |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | `false` | depuración temporal controlada |
| `CONTACT_PROVIDER` | `disabled` | integración heredada, no requerida por los CTAs actuales |

Consultar `.env.example` para el contrato completo.

## Contenido y claims

- Torvena permanece primero y es la evidencia operativa principal: negocio propio, catálogo, pedidos, soporte, proveedores y logística.
- Los demás proyectos declaran su madurez real: producción, activación pendiente, experiencia operativa, MVP o prototipo.
- No se publican conversiones, facturación, ROAS, testimonios ni resultados no documentados.
- El footer conserva “Diseñado y desarrollado por Alejandro Fink” y su equivalente inglés.
- Las fuentes y límites de uso de medios están en `public/media/projects/ATTRIBUTION.md`.

## Accesibilidad, motion y responsive

La experiencia incluye landmarks, skip links, foco visible, targets táctiles, nombres accesibles, videos con poster y una variante completa para `prefers-reduced-motion`. El menú móvil contiene focus trap, cierre con Escape y retorno de foco. Las animaciones características se preservan; no son necesarias para acceder al contenido.

La matriz automatizada cubre Chromium, WebKit desktop, Pixel 7 emulado, iPhone 13 emulado y reduced motion. WebKit/iPhone son emulaciones y no sustituyen una pasada manual en hardware Apple real.

## Seguridad y rendimiento

Las respuestas agregan CSP, HSTS, protección de MIME, referrer policy, permisos restringidos y bloqueo de iframes externos. `npm audit --omit=dev` debe permanecer en cero antes de release.

Lighthouse se ejecuta tres veces por perfil y se reporta por mediana. La medición definitiva debe repetirse sobre Preview porque el servidor Vinext local entrega assets sin la compresión HTTP/2/Brotli del hosting final. No se debe deducir un score de producción a partir de una sola corrida local.

## Gate de publicación

`npm run check` y la matriz local no autorizan por sí mismos una publicación. El flujo es:

1. candidato local verificado;
2. Preview en `noindex`, con autorización separada;
3. smoke y re-QA sobre Preview;
4. deploy productivo autorizado;
5. activación del flag de indexación sólo en el dominio oficial;
6. verificación de robots, sitemap, canonical, hreflang y Web Vitals reales.

La auditoría y el estado de preparación para Awwwards se mantienen en `docs/delivery/awwwards-readiness-audit.md`.
