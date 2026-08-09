# Requisitos no funcionales

Este documento define la calidad esperada sin elegir todavía un stack.

## Rendimiento

- El contenido principal debe aparecer rápido incluso en mobile y redes medias.
- Las imágenes de proyectos deben tener tamaños y formatos apropiados por viewport.
- Evitar video automático, fondos pesados y JavaScript que no aporte funcionalidad.
- Fuentes con estrategia de carga y subconjuntos razonables.
- Cumplir los umbrales “good” vigentes de Core Web Vitals en las plantillas principales; verificar el estándar actual al comenzar implementación.
- Medir Home, índice, un caso largo y Contact, no solo una página vacía.

## Accesibilidad

- Objetivo mínimo: conformidad AA con la versión vigente de WCAG al implementar.
- HTML semántico y jerarquía de headings coherente.
- Navegación completa con teclado.
- foco visible y orden lógico.
- contraste suficiente en todos los estados.
- labels, errores y confirmación accesibles en formularios.
- alt text natural por idioma.
- `prefers-reduced-motion` respetado.
- no depender de hover, color o animación para comunicar información.

## Responsive

- Diseñar por comportamiento del contenido, no por una lista arbitraria de dispositivos.
- Validar al menos navegación, Hero, casos, tablas o comparaciones, galerías, selector de idioma y formulario.
- Screenshots y videos no deben obligar a zoom horizontal.
- Objetivos táctiles cómodos y separados.
- No ocultar evidencia importante en mobile.

## SEO técnico

- renderizado indexable y contenido accesible sin interacción obligatoria;
- titles y descriptions únicos;
- canonical y alternates por idioma;
- sitemap y robots coherentes con el entorno;
- datos estructurados solo cuando representen información real;
- Open Graph y previews sociales;
- URLs estables y redirects definidos si cambian slugs;
- enlaces internos descriptivos;
- página 404 localizada.

## Contenido y medios

- Fuente única de contenido por locale y proyecto.
- Estado, rol y fecha no duplicados manualmente en múltiples componentes.
- Pipeline de imágenes que preserve calidad de screenshots y fotografía.
- Evitar mockups que vuelvan ilegible la interfaz.
- Autoplay desactivado para audio y testimonios en video.
- subtítulos o alternativa textual cuando el video comunica contenido.

## Formularios

- validación cliente y servidor;
- protección contra spam sin CAPTCHA intrusivo como primera opción;
- estados de envío, éxito, error y reintento;
- no perder el texto del usuario ante un error recuperable;
- no registrar el mensaje ni datos personales en analytics;
- entrega confiable y monitoreada;
- fallback por email visible;
- consentimiento y privacidad acordes al flujo real.

## Seguridad y privacidad

- no exponer credenciales ni variables privadas;
- dependencias y servicios mínimos;
- headers de seguridad compatibles con la plataforma;
- validación y sanitización del formulario;
- recolección mínima de datos;
- analytics sin información personal;
- política de privacidad basada en herramientas reales;
- separar staging de producción y evitar indexar staging.

## Analytics

- medir intención y conversión, no cada interacción disponible;
- eventos documentados y nombrados de forma estable;
- excluir datos de campos y URLs sensibles;
- documentar dominio, retención y acceso;
- validar eventos en ES y EN;
- definir consentimiento antes de elegir scripts de marketing.

## Mantenibilidad

- componentización por patrones reales, no abstracciones prematuras;
- tokens para color, tipografía, spacing, radios y motion;
- datos de proyecto separados de presentación;
- lint, type checking y pruebas proporcionales al stack;
- documentación de setup, variables y despliegue;
- no incorporar CMS, base de datos o estado global sin necesidad demostrada.

## Criterios para elegir stack

Evaluar, en este orden:

1. calidad del contenido estático y SEO;
2. soporte claro de i18n;
3. optimización de imágenes;
4. facilidad para casos ricos en medios;
5. formulario seguro;
6. rendimiento y accesibilidad;
7. mantenibilidad y despliegue;
8. necesidad real de contenido dinámico.

No elegir una tecnología para demostrar que Alejandro puede usarla.

## Entornos y calidad

- desarrollo local;
- preview o staging no indexable;
- producción;
- variables separadas;
- checks automáticos antes de deploy;
- smoke test posterior al lanzamiento;
- rollback documentado según el proveedor elegido.

