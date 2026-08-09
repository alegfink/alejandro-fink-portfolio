# Roadmap

## Fase 0 — baseline estratégica

**Estado:** baseline completada; revisión de Alejandro pendiente.

**Entregables:**

- auditoría del brief;
- posicionamiento;
- audiencias y conversión;
- arquitectura de servicios;
- orden de proyectos;
- sitemap;
- estrategia bilingüe;
- direcciones visuales;
- checklist de assets;
- source of truth y registro de decisiones.

**Salida:** Alejandro valida o modifica las decisiones de mayor impacto.

## Fase 1 — evidencia e inventario

**Objetivo:** convertir descripciones generales en material publicable y verificable.

**Trabajo:**

- responder pendientes P0;
- clasificar estado, rol y alcance de cada proyecto;
- reunir permisos y fuentes;
- inventariar screenshots, videos, logos y datos;
- decidir qué métricas son privadas, publicables o inexistentes;
- cerrar canales de contacto y disponibilidad.

**Gate:** los tres casos destacados tienen ficha factual completa y assets mínimos.

## Fase 2 — contenido y arquitectura detallada

**Objetivo:** cerrar el relato antes de diseñar pantallas de alta fidelidad.

**Trabajo:**

- redactar Home en ES y adaptar EN;
- redactar Torvena, Brisa do Mar y CUIDALO;
- redactar casos compactos;
- redactar About y Contact;
- definir títulos, descriptions y Open Graph;
- revisar claims y permisos;
- crear wireframes de contenido.

**Gate:** todo texto crítico está aprobado o marcado como pendiente visible; no hay lorem ipsum en las pantallas que se usarán para decidir diseño.

## Fase 3 — dirección visual y sistema

**Objetivo:** transformar la dirección elegida en reglas reutilizables.

**Trabajo:**

- exploraciones de Home y un caso;
- paleta, tipografía, grilla y spacing;
- tratamiento de screenshots;
- componentes, estados y motion;
- responsive desde el inicio;
- prueba con contenido ES y EN.

**Gate:** Home desktop/mobile y una página de caso representan el sistema completo.

## Fase 4 — prototipo UX

**Objetivo:** validar jerarquía, navegación y conversión antes del código.

**Trabajo:**

- prototipo de Home, índice, caso y Contact;
- recorrido mobile;
- selector de idioma;
- formulario y estados;
- prueba rápida con personas similares al público objetivo, si es posible;
- correcciones de claridad.

**Gate:** se puede recorrer el sitio completo y cada CTA tiene destino y comportamiento definidos.

## Fase 5 — especificación técnica

**Objetivo:** elegir la solución técnica más simple que cumpla los requisitos.

**Trabajo:**

- decisión de stack y hosting;
- modelo de contenido;
- estrategia de imágenes y video;
- formulario y entrega de email;
- analytics y privacidad;
- SEO e internacionalización;
- criterios de aceptación y plan de QA;
- brief de implementación.

**Gate:** se cumple el Definition of Ready de `docs/delivery/implementation-readiness.md`.

## Fase 6 — desarrollo

**Objetivo:** construir el sistema aprobado sin rediseñarlo de manera improvisada.

**Trabajo sugerido:**

1. base, tokens y layout;
2. i18n y modelo de contenido;
3. Home;
4. índice y casos;
5. About y Contact;
6. formulario, analytics, SEO y legal;
7. motion y refinamiento.

**Gate:** feature complete en staging con contenido final.

## Fase 7 — QA y preparación de lanzamiento

**Trabajo:**

- responsive en dispositivos reales;
- teclado y lector de pantalla en flujos críticos;
- contraste, foco, formularios y reduced motion;
- performance y Core Web Vitals;
- metadata, canonical, alternates y sitemap;
- links, emails y proyectos externos;
- analytics sin datos personales;
- revisión factual ES/EN;
- prueba de fallos del formulario;
- revisión legal y permisos.

**Gate:** checklist de lanzamiento sin bloqueantes.

## Fase 8 — lanzamiento y aprendizaje

**Trabajo:**

- publicar;
- verificar indexación y analytics;
- monitorear formulario y errores;
- observar qué casos reciben interés;
- recoger feedback cualitativo;
- priorizar iteraciones por evidencia.

## Después del lanzamiento

- actualizar GitHub;
- producir y sumar fotografía definitiva;
- ampliar casos cuando aparezcan resultados verificables;
- evaluar páginas de servicio según demanda y búsquedas;
- evaluar calendario o WhatsApp según patrones reales de contacto;
- mantener proyectos, disponibilidad y metadata vigentes.

