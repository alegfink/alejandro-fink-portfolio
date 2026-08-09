# Prompt maestro para Codex

```text
Construí la v1 completa del portfolio profesional bilingüe de Alejandro Fink dentro de este workspace.

Antes de editar, leé en este orden:
1. docs/delivery/implementation-brief.md
2. docs/project-brief.md
3. docs/decision-log.md
4. docs/strategy/positioning.md
5. docs/strategy/project-portfolio.md
6. docs/architecture/sitemap-and-page-specs.md
7. docs/architecture/i18n-and-content-model.md
8. docs/design/creative-directions.md
9. docs/technical/non-functional-requirements.md
10. las seis fichas de docs/projects/

Tomá esos documentos como fuente de verdad y resolvé la implementación de punta a punta. Usá Next.js con App Router y TypeScript, contenido local tipado, rutas /es/ y /en/, una arquitectura static-first y un sistema visual Editorial Product con detalles de Precision Interface. El sitio debe incluir Home, índice, los seis proyectos, About, Contact, Privacy y 404 en ambos idiomas.

Podés inspeccionar los sitios y las carpetas fuente mencionadas en el brief para seleccionar assets autorizados, pero tratá las carpetas externas como solo lectura y copiá únicamente los derivados necesarios al workspace. No inventes datos, métricas, testimonios, clientes, resultados, tecnologías ni estados. Si una ficha no confirma un dato, omitilo o presentalo como límite.

Implementá el formulario y analytics mediante contratos pequeños y configurables. Mientras no haya proveedor y email reales, no recolectes datos, no simules envíos exitosos y no inventes un fallback. No agregues CMS, base de datos, autenticación, agenda, pagos, dark mode ni animaciones complejas. No publiques ni crees cuentas externas.

Trabajá con autonomía sobre cambios locales seguros: inspeccioná el workspace, armá un plan breve, implementá, ejecutá lint, typecheck, pruebas relevantes y build, y corregí los problemas encontrados. Hacé una revisión visual responsive de Home, un caso completo y un caso compacto, incluyendo navegación con teclado y reduced motion.

La tarea termina cuando se cumplen los criterios de aceptación de docs/delivery/implementation-brief.md. Al finalizar, informá qué quedó construido, qué verificaciones pasaron y cuáles son los bloqueadores concretos para publicar.
```

## Uso

Abrir una nueva tarea de Codex con este workspace y pegar únicamente el bloque anterior. El detalle vive en los documentos enlazados para mantener el encargo breve, consistente y fácil de actualizar.
