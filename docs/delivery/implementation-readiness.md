# Readiness para implementación

**Evaluación:** `GO para desarrollo local` · `NO-GO para publicación`  
**Fecha:** 8 de agosto de 2026.

El portfolio ya tiene suficiente definición estratégica, factual, editorial y visual para comenzar a construir sin improvisar decisiones estructurales. Los pendientes restantes se resuelven durante el desarrollo o antes del lanzamiento, según se indica abajo.

## Gate de desarrollo

### Estrategia

- [x] Brief canónico consolidado.
- [x] Propuesta de valor ES/EN definida como base editorial.
- [x] Audiencia prioritaria y objetivo de conversión definidos.
- [x] Oferta v1 agrupada en cuatro familias.
- [x] Orden, profundidad y estado de los seis proyectos confirmados.

### Arquitectura y contenido

- [x] Sitemap, navegación y rutas bilingües definidos.
- [x] Especificación de Home, índice, caso, About, Contact y Privacy.
- [x] Relato factual suficiente para los seis proyectos.
- [x] Casos destacados y casos compactos diferenciados.
- [x] Modelo de contenido e i18n definido.
- [x] URLs, canonical y alternates planificados.
- [ ] Copy final completo. Se termina y revisa dentro de la implementación a partir de las fuentes canónicas.

### Diseño

- [x] Dirección `Editorial Product` elegida como sistema principal.
- [x] Principios de composición, tipografía, color, screenshots y motion definidos.
- [ ] Tokens finales y componentes. Se materializan en código y se validan visualmente.
- [ ] Home y una plantilla de caso validadas en desktop y mobile. Es el primer hito de implementación.

### Técnica

- [x] Base técnica elegida: Next.js con App Router y TypeScript, enfoque static-first y contenido local estructurado.
- [x] Rutas ES/EN y reglas de detección/persistencia definidas.
- [x] Requisitos de imágenes, video, SEO, accesibilidad, rendimiento y QA definidos.
- [x] Contrato de analytics definido a nivel conceptual; el proveedor puede incorporarse después.
- [x] Comportamiento seguro del contacto definido: no simular entregas ni recolectar datos hasta configurar un proveedor real.
- [ ] Hosting, formulario, analytics y consentimiento definitivos. Bloquean publicación, no desarrollo local.

### Evidencia y operación

- [x] Clasificación, rol, stack, límites y permisos documentados para los seis proyectos.
- [x] Fuentes locales y públicas identificadas para producir medios.
- [ ] Screenshots y derivados finales. Se producen durante la implementación.
- [ ] Dominio, DNS, email profesional y responsable de datos. Bloquean publicación.

## Qué puede resolverse durante el desarrollo

- copy final y adaptación natural ES/EN;
- selección y captura de screenshots autorizados;
- tokens exactos de color, tipografía, spacing, radios y motion;
- breakpoints y tratamiento responsive;
- abstracciones internas de componentes;
- metadata social y favicon;
- pruebas, optimización y detalles de interacción;
- elección del proveedor de hosting, formulario y analytics, sin activar ninguno hasta contar con configuración y política de privacidad.

## Bloqueadores reales de publicación

1. Dominio principal y DNS.
2. Email profesional y canal de recepción probado.
3. Proveedor real del formulario, protección anti-spam, fallback y monitoreo.
4. Flujo real de datos, responsable y política de privacidad correspondiente.
5. Analytics y consentimiento, si se incorporan scripts no esenciales.
6. URL de LinkedIn y datos personales que finalmente se decida mostrar.
7. Revisión editorial y visual final de ambas versiones.
8. QA de producción y smoke test posterior al despliegue.

## Regla de implementación

Los datos faltantes deben modelarse como configuración opcional y permanecer ocultos o explícitamente desactivados. No se inventan emails, métricas, testimonios, fechas, precios, resultados ni estados. Una URL pública de prototipo tampoco convierte un trabajo en producción.

## Definition of Ready

La Definition of Ready para Codex está cumplida: el brief de implementación permite responder qué construir, para quién, con qué contenido, según qué dirección visual, bajo qué restricciones y cómo verificarlo. La publicación conserva un gate separado.

La especificación ejecutable está en [`implementation-brief.md`](implementation-brief.md) y el encargo listo para Codex en [`codex-build-prompt.md`](codex-build-prompt.md).
