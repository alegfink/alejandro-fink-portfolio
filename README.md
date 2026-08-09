# Alejandro Fink — portfolio bilingüe

Portfolio profesional v1 construido con Next.js App Router, TypeScript y contenido local tipado. La experiencia se publica en español e inglés, usa una arquitectura static-first y aplica la dirección visual **Editorial Product** con metadata y estados de **Precision Interface**.

## Estado

- Desarrollo local: completo.
- Publicación: bloqueada hasta configurar identidad operativa, dominio y flujo real de datos.
- Contenido factual: basado exclusivamente en `docs/` y, para los medios, en fuentes autorizadas registradas en [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md).
- Analytics: contrato definido, proveedor desactivado.
- Contacto: interfaz y validación implementadas, envío desactivado.

## Requisitos

- Node.js 22.13 o superior.
- npm 10 o superior.

## Instalación y uso

```bash
npm install
cp .env.example .env.local
npm run dev
```

En Windows PowerShell, si la política de ejecución bloquea `npm.ps1`, usar `npm.cmd` en los mismos comandos.

El sitio local queda disponible en `http://localhost:3000`. La raíz detecta el idioma del navegador; una elección manual `ES / EN` se guarda en `localStorage` y en una cookie funcional, y conserva la página equivalente.

## Scripts

| Comando | Función |
|---|---|
| `npm run dev` | servidor local de desarrollo |
| `npm run lint` | reglas Next.js Core Web Vitals y TypeScript |
| `npm run typecheck` | chequeo estricto sin emitir archivos |
| `npm test` | tests del contenido, rutas equivalentes y contrato de contacto |
| `npm run build` | build optimizado y prerender estático |
| `npm run start` | servidor del build de producción |
| `npm run check` | lint, typecheck, tests y build en secuencia |

## Estructura

```text
app/
├── (root)/                 # selector/detección inicial de idioma
├── [locale]/               # layouts raíz con lang correcto
│   ├── proyectos/ | work/  # índices y casos ES/EN
│   ├── sobre-mi/ | about/
│   ├── contacto/ | contact/
│   └── privacidad/ | privacy/
├── api/contact/            # contrato de entrega, desactivado por defecto
├── globals.css             # tokens, tipografía y primitives
├── portfolio.css           # composición editorial y responsive
├── sitemap.ts
└── robots.ts
components/                 # navegación, selector, formulario y proyectos
content/                    # fuente única tipada para sitio y seis proyectos
lib/                        # i18n, URLs, metadata, analytics y contacto
public/media/projects/      # derivados autorizados y manifiesto
tests/                      # validación de modelo y contratos
views/                      # páginas compartidas entre locales
docs/                       # brief y fichas factuales canónicas
```

## Variables

Copiar `.env.example` a `.env.local`.

| Variable | Valor local | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | base para canonical, Open Graph y sitemap |
| `NEXT_PUBLIC_INDEXING_ENABLED` | `false` | `robots.txt` bloquea indexación hasta el dominio final |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `disabled` | reserva explícita; no instala ni ejecuta un proveedor |
| `CONTACT_PROVIDER` | `disabled` | solo `webhook` permite evaluar la integración |
| `CONTACT_WEBHOOK_URL` | vacío | debe ser HTTPS y pertenecer al proveedor real |
| `CONTACT_RECIPIENT_EMAIL` | vacío | email real y verificado de recepción |

### Contrato de contacto

Mientras la configuración siga incompleta:

- los campos se muestran desactivados;
- no se envían ni almacenan mensajes;
- `POST /api/contact` responde `503 CONTACT_DISABLED` antes de leer el body;
- no se muestra un éxito falso ni un email inventado.

Al configurar un proveedor real, el endpoint valida origen, estructura, longitudes, email y tipo de necesidad antes de llamar al webhook HTTPS. La política de privacidad debe actualizarse con el proveedor, finalidad, responsable, retención y derechos antes de habilitarlo.

### Contrato de analytics

`lib/analytics.ts` define un mapa estable de eventos:

- cambio de idioma;
- apertura de proyecto;
- CTA de contacto;
- intento, éxito o error de envío;
- enlace externo.

El adaptador actual es inerte. No registra eventos, campos, URLs sensibles ni datos personales. Implementar un proveedor requiere revisar consentimiento y actualizar Privacy.

## Contenido e i18n

- Una entidad canónica por proyecto con campos compartidos y contenido localizado.
- Validación en runtime y tests para cantidad, IDs, orden, slugs, traducciones, decisiones y límites.
- Rutas naturales `/es/proyectos/` y `/en/work/`.
- Selector accesible que conserva Home, índice, casos, About, Contact y Privacy equivalentes.
- Metadata única, canonical, alternates `es`, `en` y `x-default`, Open Graph, sitemap y robots.
- Las rutas cruzadas, slugs inexistentes y URLs fuera del sitemap entregan 404.

## Diseño y calidad

Los tokens están documentados al inicio de `app/globals.css`: marfil cálido, tinta casi negra, azul cobalto de acción, Instrument Sans Variable, Newsreader Variable y mono de sistema para metadata.

La implementación apunta a WCAG 2.2 AA. Incluye HTML semántico, skip link, foco visible, navegación por teclado, targets táctiles, mensajes `aria-live`, alt text por idioma y una experiencia completa con `prefers-reduced-motion`.

La referencia de rendimiento vigente usada es: LCP ≤ 2.5 s, INP ≤ 200 ms y CLS ≤ 0.1 al percentil 75 en mobile y desktop. Ver [Web Vitals](https://web.dev/articles/vitals) y [WCAG 2 Overview](https://www.w3.org/WAI/standards-guidelines/wcag/).

## Assets

Las carpetas externas se trataron como solo lectura. Solo se copiaron derivados necesarios y capturas públicas sin credenciales o datos personales. El origen, permiso y límite de cada grupo de medios está en [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md).

No se usan testimonios ilustrativos de Lourdes, métricas no verificadas, capturas administrativas ni datos de formularios.

## Gate de publicación

Bloqueadores concretos:

1. dominio principal, DNS y valor definitivo de `NEXT_PUBLIC_SITE_URL`;
2. email profesional y canal de recepción probado;
3. proveedor real del formulario, webhook, antispam y monitoreo;
4. responsable de datos y política de privacidad actualizada al flujo real;
5. proveedor de analytics y consentimiento, si se decide incorporarlo;
6. URL de LinkedIn y datos personales que finalmente se autoricen;
7. revisión editorial final ES/EN;
8. QA del entorno productivo, medición de Core Web Vitals y smoke test posterior al deploy.

No habilitar `NEXT_PUBLIC_INDEXING_ENABLED=true` hasta completar el gate y revisar canonical, sitemap y robots sobre el dominio final.
