# Internacionalización y modelo de contenido

## Objetivo

Diseñar español e inglés como dos experiencias equivalentes, no como una versión principal y una traducción tardía.

## Estrategia de rutas

- Español: `/es/`.
- Inglés: `/en/`.
- La raíz `/` dirige según idioma del navegador en la primera visita.
- Navegadores con preferencia `es-*` reciben español.
- El resto recibe inglés como fallback internacional.
- La elección manual se recuerda y siempre prevalece sobre la detección.

No redirigir repetidamente a una persona que ya eligió idioma.

## Selector de idioma

- Visible en desktop y mobile.
- Texto `ES / EN`, no solo un ícono de globo.
- Conserva la página equivalente cuando existe.
- Si un contenido no tiene equivalente, dirige al índice del idioma y lo comunica sin error.
- Operable con teclado y anunciado correctamente a lectores de pantalla.

## SEO internacional

Cada página debe tener:

- URL propia y estable;
- canonical a sí misma;
- alternates `es`, `en` y `x-default` cuando corresponda;
- title y description escritos de forma natural;
- Open Graph por idioma;
- enlaces internos dentro del mismo locale.

No usar parámetros `?lang=` como arquitectura principal.

## Proceso editorial

1. Definir la idea, evidencia y objetivo de la sección sin idioma de marketing.
2. Escribir la versión natural del idioma con mayor contexto disponible.
3. Adaptar la segunda versión por intención, no por frase.
4. Revisar tono, longitud, CTA y términos comerciales en cada idioma.
5. Validar que ninguna versión haga un claim más fuerte que la otra.

Para proyectos argentinos puede redactarse primero en español. Para la propuesta global, ambas versiones deben revisarse como mensajes originales.

## Diferencias lingüísticas esperables

- `Contame tu proyecto` no necesita traducirse literalmente; `Tell me about your project` es natural.
- `Sitio para empresas` puede ser `business website`, no `company site` de forma automática.
- `Desarrollo asistido por IA` puede ser `AI-assisted development`; evitar `AI-powered` si sugiere que el producto depende de IA.
- `Caso de estudio` puede mostrarse como `Project` o `Case study` según profundidad.

## Modelo de proyecto

Cada proyecto debe existir como una entidad única con campos localizados y campos compartidos.

### Campos compartidos

- `id` estable.
- `slug` por locale.
- URL pública.
- año o rango confirmado.
- estado canónico.
- tipo de caso: completo o compacto.
- orden.
- imágenes y videos.
- tecnologías confirmadas.
- permisos y publicación.

### Campos localizados

- título visible si corresponde.
- resumen.
- problema.
- objetivo.
- solución.
- decisiones.
- funcionalidades.
- rol.
- resultados o aprendizajes.
- labels y CTAs.
- metadata SEO y texto alternativo.

## Estados canónicos

Vocabulario recomendado:

- `production`: producto o negocio en producción.
- `operational`: solución usada en una operación real, pendiente de precisar alcance.
- `mvp`: primera versión funcional con límites declarados.
- `prototype`: experiencia funcional no presentada como producto final.
- `concept`: exploración de producto, marca o experiencia.

Los labels visibles se adaptan al idioma, pero el significado no cambia.

## Organización de contenido futura

No crear doce archivos manuales desconectados si la implementación puede compartir un esquema. La decisión final depende del stack, pero el contenido debe permitir:

```text
content/
├── pages/
│   ├── home.es.*
│   ├── home.en.*
│   ├── about.es.*
│   └── about.en.*
└── projects/
    ├── torvena.es.*
    ├── torvena.en.*
    └── ...
```

La extensión y ubicación exactas se deciden con el stack. Antes de eso, los borradores viven en documentación y no se duplican como datos de producción.

## QA bilingüe

- paridad de secciones y evidencia;
- ausencia de strings mezclados;
- layouts probados con diferencias de longitud;
- fechas, números y formatos localizados;
- alt text natural;
- links cruzados correctos;
- formularios y mensajes de error localizados;
- emails de confirmación localizados;
- metadata y datos estructurados por locale.

