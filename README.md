# Alejandro Fink — portfolio bilingüe

Portfolio profesional v1 construido con Next.js App Router, TypeScript y contenido local tipado. La experiencia se publica en español e inglés, usa una arquitectura static-first y aplica la dirección visual **Editorial Product** con metadata y estados de **Precision Interface**.

## Estado

- Desarrollo y publicación en Sites: activos en `https://alejandro-fink-portfolio-2026.alegfink.chatgpt.site`.
- Dominio: se mantiene el subdominio público de Sites; un dominio propio queda como mejora futura.
- Contenido factual: basado exclusivamente en `docs/` y, para los medios, en fuentes autorizadas registradas en [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md).
- Analytics: contrato definido, proveedor desactivado y adopción planificada para una etapa posterior.
- Contacto: `alegfink@gmail.com` funciona como canal público; el formulario y su validación están preparados para revisión, pero el envío dentro del sitio permanece desactivado.

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
| `NEXT_PUBLIC_INDEXING_ENABLED` | `false` | bloquea indexación en local; la publicación verificada en Sites usa `true` |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `disabled` | reserva explícita; no instala ni ejecuta un proveedor |
| `CONTACT_PROVIDER` | `disabled` | solo `webhook` permite evaluar la integración |
| `CONTACT_WEBHOOK_URL` | vacío | debe ser HTTPS y pertenecer al proveedor real |
| `CONTACT_RECIPIENT_EMAIL` | `alegfink@gmail.com` | email confirmado de recepción; no habilita el formulario por sí solo |

### Contrato de contacto

Mientras la configuración siga incompleta:

- el email público funciona mediante un enlace `mailto:`;
- los campos propuestos —nombre, email, empresa o proyecto, URL opcional, tipo de necesidad, situación actual y contexto— se muestran desactivados para revisión;
- no se envían ni almacenan mensajes;
- `POST /api/contact` responde `503 CONTACT_DISABLED` antes de leer el body;
- no se muestra un éxito falso ni un email inventado.

Al configurar un proveedor real, el endpoint valida origen, estructura, longitudes, email, URL, situación y tipo de necesidad antes de llamar al webhook HTTPS. La política de privacidad debe actualizarse con el proveedor, finalidad, responsable, retención y derechos antes de habilitarlo.

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

Las imágenes de proyectos que están fuera del primer viewport cargan de forma diferida para no competir con el contenido inicial. La medición final de Core Web Vitals requiere ejecutar Lighthouse/PageSpeed sobre la publicación y, más adelante, observar datos reales de usuarios.

Las respuestas incluyen CSP, HSTS, bloqueo de MIME sniffing, política de referer, restricción de permisos y protección frente a iframes. La CSP limita scripts, imágenes, fuentes, formularios y conexiones a los orígenes que el sitio necesita; HSTS obliga a reutilizar HTTPS después de la primera visita segura.

## Assets

Las carpetas externas se trataron como solo lectura. Solo se copiaron derivados necesarios y capturas públicas sin credenciales o datos personales. El origen, permiso y límite de cada grupo de medios está en [`public/media/projects/ATTRIBUTION.md`](public/media/projects/ATTRIBUTION.md).

No se usan testimonios ilustrativos de Lourdes, métricas no verificadas, capturas administrativas ni datos de formularios.

## Pendientes de producción

La versión pública actual no depende de estos puntos. Son bloqueadores concretos de funcionalidades o mejoras futuras:

1. para habilitar el envío dentro del formulario: elegir proveedor, crear y probar el webhook, definir antispam y monitoreo, y actualizar Privacidad con el flujo real;
2. para incorporar analytics: decidir proveedor, eventos, datos, retención y necesidad de consentimiento; después actualizar Privacidad antes de activarlo;
3. para usar dominio propio: elegirlo, configurar DNS y cambiar `NEXT_PUBLIC_SITE_URL`, canonical, sitemap y robots;
4. medir Core Web Vitals sobre producción y repetir la revisión después de cambios de contenido o medios importantes;
5. ampliar la cobertura automática con pruebas visuales y E2E para navegación, idiomas, responsive y estados del formulario;
6. reemplazar el recurso gráfico de About sólo si en el futuro se aprueba un retrato definitivo;
7. el dominio propio de Brisa do Mar sigue pendiente; mientras tanto el caso conserva su URL operativa actual.
