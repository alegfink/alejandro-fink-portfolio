# Plan de medición y analítica

Fecha de baseline: 2026-08-10  
Responsable: Alejandro Fink  
Propiedad: `Alejandro Fink — Portfolio`  
Measurement ID: `G-E0WZCBNV1W`

## Objetivo de negocio

La medición debe permitir responder cuatro preguntas, en ese orden:

1. ¿Qué fuentes, campañas, dispositivos, países e idiomas atraen público relevante?
2. ¿Qué páginas, proyectos, secciones y argumentos generan interés real?
3. ¿En qué punto el interés se transforma en intención de contacto y en una consulta recibida?
4. ¿Qué calidad comercial tienen esas consultas y qué aprendizajes pueden reutilizarse en proyectos de clientes?

No se busca recolectar datos por acumulación. Cada dato debe sostener una decisión de adquisición, contenido, experiencia, rendimiento o ventas.

## Arquitectura elegida

### Capa 1 — Google Analytics 4

GA4 mide adquisición, navegación, interacción, conversión y rendimiento sólo después de consentimiento explícito. Se eligió porque no suma una suscripción, es transferible a futuros clientes y permite relacionar fuente, campaña, landing y dispositivo con eventos del funnel.

- Google Signals: desactivado.
- User-ID y datos proporcionados por usuarios: desactivados.
- Personalización publicitaria y almacenamiento publicitario: denegados.
- Page views automáticos: desactivados; las rutas App Router se miden manualmente para evitar duplicados.
- Retención de eventos y usuarios: 14 meses, sin reiniciar el período por nueva actividad.
- Identificadores y contenido personal: prohibidos en nombres de evento, parámetros y URLs.

### Capa 2 — atribución first-party del lead

Si la persona aceptó analítica, el sitio conserva durante la sesión la primera landing, UTM y referente externo. Esos campos viajan al receptor únicamente cuando la persona confirma el envío del diagnóstico. Sheets agrega ocho columnas de atribución y el email de aviso incluye el mismo contexto.

Si la persona no acepta analítica, la consulta puede enviarse igual y la atribución queda vacía. Las respuestas del diagnóstico nunca se envían a GA4.

### Capa 3 — rendimiento real

La librería oficial `web-vitals` informa CLS, FCP, INP, LCP y TTFB con valoración `good`, `needs-improvement` o `poor`. Esto complementa las pruebas manuales: Lighthouse es una medición de laboratorio; estos eventos describen lo que experimentan dispositivos reales con consentimiento.

## Datos y eventos

| Etapa | Evento | Pregunta que responde | Parámetros principales |
|---|---|---|---|
| Adquisición | `page_view` | ¿Qué landing y página recibió la visita? | `page_group`, `site_language`, URL saneada |
| Descubrimiento | `section_view` | ¿Qué bloques llegaron a verse? | `section_id`, `page_group` |
| Descubrimiento | `scroll_depth` | ¿Hasta dónde avanzó la lectura? | 25, 50, 75 o 90 %, `page_group` |
| Interés | `project_story_view` | ¿Qué proyecto se descubrió en Home? | `project_id`, posición |
| Interés | `project_open` | ¿Qué caso decidió abrir? | `project_id`, ubicación |
| Interés | `case_study_view` | ¿Qué evidencia completa o compacta se visitó? | `project_id`, tipo de caso |
| Evidencia | `external_link` | ¿Se visitó el producto publicado? | dominio de destino, contexto |
| Intención | `contact_cta` | ¿Qué mensaje o ubicación generó contacto? | `placement` |
| Intención | `contact_email_click` | ¿Se prefirió Gmail o mailto? | método, ubicación |
| Funnel | `contact_form_start` | ¿Cuántas personas comienzan? | idioma |
| Funnel | `contact_form_step` | ¿Dónde avanzan o retroceden? | paso, número, dirección |
| Funnel | `contact_form_review` | ¿Cuántas llegan a revisión? | segundos transcurridos |
| Funnel | `contact_form_abandon` | ¿Dónde se interrumpe el recorrido? | último paso, tiempo |
| Conversión | `contact_submit_attempt` | ¿Cuántas intentan confirmar? | tiempo total |
| Conversión | `contact_submit_success` | ¿Cuántas consultas fueron aceptadas? | tiempo total |
| Conversión | `generate_lead` | Conversión estándar de GA4 al recibir una consulta | idioma |
| Diagnóstico | `contact_submit_error` | ¿Falló validación, red o receptor? | motivo |
| Lectura | `page_engagement` | ¿Cuánto tiempo activo y profundidad hubo? | segundos, máximo scroll |
| Rendimiento | `web_vital` | ¿Qué experiencia real tuvo el dispositivo? | métrica, valor, rating, navegación |
| Preferencia | `language_change` | ¿Se cambió de versión idiomática? | origen, destino, ruta |

Los nombres, emails, empresas, URLs escritas, mensajes y respuestas del diagnóstico no son parámetros de Analytics.

## Dimensiones y métricas personalizadas de GA4

Crear como dimensiones de alcance evento:

- `page_group`
- `site_language`
- `project_id`
- `placement`
- `section_id`
- `step_id`
- `direction`
- `case_type`
- `error_reason`
- `destination_domain`
- `metric`
- `rating`
- `navigation_type`

Crear como métricas personalizadas:

- `percent`
- `engaged_seconds`
- `max_scroll_percent`
- `step_number`
- `elapsed_seconds`
- `metric_value`

Usar `generate_lead` como evento clave principal de GA4 y `contact_submit_success` como confirmación técnica auditable del receptor. `contact_email_click` puede observarse como microconversión, pero no debe mezclarse con consultas confirmadas.

## Tableros y lectura operativa

### Semanal — salud y oportunidades

- usuarios, sesiones y consultas confirmadas;
- tasa `generate_lead / contact_form_start`, contrastada con `contact_submit_success`;
- errores por tipo y pasos con mayor abandono;
- fuentes, campañas y landings que originaron consultas;
- páginas o proyectos más asociados con CTA y apertura de formulario;
- Core Web Vitals `poor`, especialmente en mobile.

### Mensual — decisiones de negocio

- participación y tendencia por source / medium / campaign;
- conversión por landing, idioma, país y categoría de dispositivo;
- recorrido proyecto → contacto → consulta;
- consultas por objetivo, necesidad, inversión, plazo y etapa de decisión desde Sheets;
- contraste manual entre volumen de GA4 y calidad comercial de Sheets;
- contenido que merece promoción, reescritura o una versión más profunda;
- fricción del diagnóstico y posibles preguntas que no aportan a la calificación.

No se debe unir GA4 con Sheets mediante email, nombre ni un identificador personal. La lectura comercial se hace por campaña, fecha, landing y agregados, no por perfil individual.

## Convención UTM

Todas las etiquetas se escriben en minúsculas, sin espacios y con guiones.

| Campo | Uso | Ejemplos |
|---|---|---|
| `utm_source` | plataforma o socio concreto | `linkedin`, `instagram`, `google`, `newsletter`, `socio-x` |
| `utm_medium` | tipo de canal | `organic-social`, `paid-social`, `cpc`, `email`, `referral` |
| `utm_campaign` | iniciativa estable | `portfolio-lanzamiento-2026`, `caso-torvena` |
| `utm_content` | pieza o ubicación | `bio`, `reel-01`, `post-carrusel`, `firma-email` |
| `utm_term` | palabra clave paga | sólo campañas de búsqueda |

Ejemplo:

```text
https://www.alejandrofink.com/es?utm_source=linkedin&utm_medium=organic-social&utm_campaign=portfolio-lanzamiento-2026&utm_content=post-carrusel
```

Nunca incluir nombres, emails, teléfonos, IDs de CRM ni texto libre en UTM.

## Tráfico interno y control de calidad

Para excluir un navegador propio, abrir una vez una URL del sitio con `?af_analytics=exclude`. El parámetro se elimina inmediatamente y la exclusión queda local en ese navegador. Para revertirlo, usar `?af_analytics=include`.

Las validaciones de una publicación deben incluir:

1. rechazo de consentimiento: no cargar `gtag.js`, no crear `_ga` y permitir enviar el formulario;
2. aceptación: registrar una única vista por ruta y conservar UTM saneadas;
3. cambio ES/EN y navegación SPA: una vista correcta por URL;
4. embudo completo: inicio, pasos, revisión, intento y éxito;
5. error simulado de red y receptor: evento correcto, sin éxito falso;
6. envío real con UTM: fila y email con atribución, sin exponer el secreto;
7. mobile, teclado y reduced motion: banner y preferencias utilizables;
8. tiempo real y DebugView: nombres y parámetros sin PII.

## Alternativas investigadas

| Opción | Costo inicial | Ventaja | Límite para este caso | Decisión |
|---|---:|---|---|---|
| GA4 | sin suscripción | adquisición, campañas y estándar de mercado | exige consentimiento y gobierno cuidadoso | elegida |
| Cloudflare Web Analytics | gratis | privacidad y Core Web Vitals sencillos | menor profundidad de funnel y campañas | reserva de salud técnica |
| PostHog | free tier | funnels y replay muy completos | más recolección y complejidad de privacidad de la necesaria | no incorporar ahora |
| Umami self-hosted | software libre | simple y privacy-first | requiere servidor y Postgres operados por nosotros | no incorporar ahora |
| Matomo On-Premise | software libre | control total | infraestructura y mantenimiento desproporcionados | no incorporar ahora |

Fuentes oficiales consultadas: [eventos GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/recommended-events), [Consent Mode](https://support.google.com/analytics/answer/12334711?hl=en), [límites y retención](https://support.google.com/analytics/answer/12229528?hl=en-EN), [política contra PII](https://support.google.com/analytics/answer/6366371?hl=en), [SPA y page views](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/), [PostHog pricing](https://posthog.com/pricing), [Umami](https://docs.umami.is/docs/about), [Matomo On-Premise](https://matomo.org/guide/installation-maintenance/matomo-on-premise-self-hosted/) y [`web-vitals`](https://github.com/GoogleChrome/web-vitals).

## Blueprint reutilizable para clientes

Este portfolio funciona como implementación base, no como una plantilla ciega. Para otro negocio hay que repetir cinco decisiones:

1. objetivos y conversiones reales del negocio;
2. taxonomía de eventos específica y mínima;
3. consentimiento, privacidad y conservación acordes al país y al tratamiento;
4. atribución y nomenclatura UTM gobernadas;
5. tablero conectado a decisiones comerciales y una rutina de revisión.

No se prometen resultados ni cumplimiento legal automático. La analítica aporta evidencia; el diseño del servicio debe adaptarse a cada operación.
