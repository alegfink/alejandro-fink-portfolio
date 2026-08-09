# Benchmark de portfolios profesionales — agosto de 2026

Fecha de verificación: **2026-08-09**.

## Objetivo y supuesto de trabajo

La investigación busca elevar la percepción profesional del portfolio sin migrar el proyecto a un constructor, copiar una plantilla ni sumar una dependencia visual. Las referencias se evalúan por el valor de sus patrones de composición para un portfolio bilingüe de diseño y desarrollo web, no como reemplazo del stack Next.js existente.

## Señales del mercado

Los lanzamientos recientes mejor resueltos convergen en cinco decisiones:

1. Tipografía sans de gran escala, con serif reservada a pocos acentos editoriales.
2. Grillas estrictas y asimétricas, con mucho menos uso de collages inclinados o tarjetas flotantes.
3. Trabajo visible antes que discurso: previews grandes, metadata breve y un camino directo al caso.
4. Paletas neutras de alto contraste con un único color de acción.
5. Motion corto en hover o aparición, sin volverlo requisito para comprender o navegar.

## Comparativa corta

La puntuación sigue la rúbrica del skill de investigación: valor, encaje técnico, facilidad de implementación, gratuidad, mantenimiento, privacidad y portabilidad. Como no se incorpora el código ni los assets de estas plantillas, “gratis” describe el acceso a la referencia; cualquier reutilización directa quedaría sujeta a la licencia enlazada.

| Referencia | Modalidad y licencia | Valor aplicable | Riesgo principal | Esfuerzo de adaptación | Puntaje |
|---|---|---|---|---|---:|
| [Kern — Framer Marketplace](https://www.framer.com/community/marketplace/templates/kern/) | Gratis, Limited Commercial License | Sistema Swiss-editorial, casos a gran escala, un acento preciso y estructura completa de proyecto | Sus componentes, CMS y efectos pertenecen a Framer; migrar agregaría dependencia y costo de salida | Medio | 91/100 |
| [Satz — Framer Marketplace](https://www.framer.com/community/marketplace/templates/satz/) | Gratis, Limited Commercial License | Grilla disciplinada, jerarquía tipográfica, separación clara entre hero y trabajo seleccionado | La composición centrada y los bloques de métricas pueden sentirse genéricos si no hay evidencia real | Bajo | 88/100 |
| [Presse — Framer Marketplace](https://www.framer.com/community/marketplace/templates/presse/) | Gratis, Limited Commercial License | Introducción breve, navegación liviana y proyectos como primera prueba visual | Incluye disponibilidad, testimonios y stats que este portfolio no debe inventar | Bajo | 86/100 |
| [Portfr — Framer Marketplace](https://www.framer.com/community/marketplace/templates/portfr/) | Gratis, Limited Commercial License | Reducción extrema, índice visible y lectura rápida de proyectos | Demasiado austero para explicar decisiones y límites; depende mucho de efectos de scroll | Medio | 82/100 |
| [Slayed — Webflow Marketplace](https://webflow.com/templates/html/slayed-website-template) | Gratis para uso personal y comercial bajo Free Template License | Hero tipográfico fuerte, rail de información y navegación clara | Es una plantilla de agencia genérica; contiene pricing, testimonios y métricas ficticias. Webflow indica además que una plantilla no se aplica a un proyecto existente y que exportar requiere un plan Workspace pago | Alto | 74/100 |

La [licencia de comunidad de Framer](https://www.framer.com/legal/community-terms/) permite usar y modificar contenido gratuito en proyectos comerciales, pero prohíbe redistribuirlo como asset independiente. La [licencia oficial de templates de Webflow](https://webflow.com/templates/template-licenses) permite uso comercial de templates gratuitos y prohíbe redistribuir la plantilla o sus componentes. En esta implementación no se descargó ni reutilizó contenido de terceros: solo se abstrajeron patrones generales de diseño.

## Decisión

Se adopta una combinación propia, construida sobre el sistema Editorial Product definido en el brief:

- de **Kern/Satz**: grilla estricta, sans dominante, reglas de metadata y un solo acento;
- de **Presse**: introducción compacta y trabajo visible con rapidez;
- de **Portfr**: índices de proyecto y navegación sin ruido;
- de **Slayed**: escala tipográfica y separación clara entre mensaje y prueba visual.

No se adopta ninguna plantilla como base técnica. Next.js, el contenido local tipado y las rutas bilingües se mantienen intactos. La prueba de éxito es visual y funcional: Home y casos deben sostener jerarquía, lectura y acceso a proyectos en desktop y mobile, con teclado y `prefers-reduced-motion`, sin sumar claims ni datos no confirmados.

