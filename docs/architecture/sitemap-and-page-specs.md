# Sitemap y especificación de páginas

## Principio de arquitectura

La arquitectura debe responder tres preguntas en orden:

1. ¿Alejandro resuelve un problema parecido al mío?
2. ¿Hay evidencia suficiente para confiar?
3. ¿Cómo inicio una conversación?

No se crea una página por cada capacidad. La profundidad vive en los casos.

## Sitemap v1

```text
/
├── /es/
│   ├── /proyectos/
│   │   ├── /torvena/
│   │   ├── /brisa-do-mar/
│   │   ├── /cuidalo/
│   │   ├── /salto-cuantico/
│   │   ├── /luca-ds/
│   │   └── /lourdes-mirada/
│   ├── /sobre-mi/
│   ├── /contacto/
│   └── /privacidad/
└── /en/
    ├── /work/
    │   ├── /torvena/
    │   ├── /brisa-do-mar/
    │   ├── /cuidalo/
    │   ├── /salto-cuantico/
    │   ├── /luca-ds/
    │   └── /lourdes-mirada/
    ├── /about/
    ├── /contact/
    └── /privacy/
```

La raíz `/` resuelve el idioma inicial. No contiene una tercera versión del contenido.

## Navegación principal

- Proyectos / Work.
- Servicios / Services: enlace a la sección de Home.
- Sobre mí / About.
- Contacto / Contact.
- Selector ES / EN.

No incluir GitHub hasta que esté actualizado. LinkedIn puede vivir en About y Footer.

## Home

### Objetivo

Convertir tráfico frío en comprensión, confianza y una acción de contacto sin obligar a recorrer todo el sitio.

### Orden de secciones

#### 1. Header

**Comunica:** identidad, orientación y acceso a contacto e idioma.

**Reglas:** compacto, legible y sin navegación excesiva. El CTA puede aparecer como acción diferenciada, pero no debe dominar antes del mensaje.

#### 2. Hero

**Comunica:** qué construye Alejandro, para quién y con qué enfoque.

**Contenido:**

- promesa outcome-first;
- apoyo que une desarrollo, UX y negocio;
- CTA principal `Contame tu proyecto`;
- CTA secundario `Ver proyectos`;
- descriptor breve de servicios o modalidad.

**Visual:** composición con trabajo real, sistema gráfico o fragmentos de interfaz. La foto personal puede incorporarse en el futuro, pero no es estructural.

#### 3. Proyectos destacados

**Comunica:** la promesa anterior ya tiene evidencia.

**Contenido:** Torvena, Brisa do Mar y CUIDALO con:

- problema o contexto;
- solución construida;
- estado real;
- rol resumido;
- una imagen dominante;
- link al caso.

No usar solo título, lista de tecnologías y mockup.

#### 4. Qué puedo construir

**Comunica:** el visitante puede reconocerse dentro de la oferta.

**Contenido:** cuatro familias de servicios expresadas mediante situaciones y resultados, no como catálogo técnico.

#### 5. Cómo trabajo

**Comunica:** primero se entiende y acota el problema; después se construye.

Secuencia recomendada:

1. **Entender:** negocio, audiencia, restricciones y objetivo.
2. **Definir:** alcance, recorrido y primera versión útil.
3. **Diseñar y construir:** interfaz, contenido, desarrollo e integraciones.
4. **Validar y evolucionar:** QA, medición, aprendizaje e iteración cuando corresponde.

La IA se explica aquí como acelerador transversal, no como un quinto paso ni como piloto automático.

#### 6. Más trabajo

**Comunica:** versatilidad en funnel, high-ticket, marca personal y dirección visual.

**Contenido:** Salto Cuántico, Luca DS y Lourdes Mirada con estados editoriales explícitos.

#### 7. Perspectiva personal

**Comunica:** por qué Alejandro piensa de esta manera.

Narrativa breve:

- formación full stack;
- experiencia en ventas consultivas;
- aplicación de UX, producto e IA;
- experiencia actual operando Torvena.

Debe responder “por qué sos una buena persona para entender mi problema”, no narrar toda la biografía.

#### 8. CTA final y contacto

**Comunica:** qué tipo de conversación puede iniciar el visitante y qué ocurrirá después.

Contenido sugerido:

- invitación clara;
- ejemplos de necesidades apropiadas;
- CTA al formulario;
- email alternativo;
- expectativa de respuesta cuando sea confirmada.

#### 9. Footer

Nombre, descriptor, navegación, LinkedIn, email, idioma, ubicación general y enlaces legales. GitHub es condicional.

## Índice de proyectos

### Objetivo

Mostrar el rango completo y permitir comparar contextos sin convertir la Home en un archivo exhaustivo.

### Contenido

- introducción corta sobre cómo se seleccionaron los casos;
- seis proyectos ordenados;
- etiquetas de categoría y estado;
- CTA de contacto al final.

No requiere filtros interactivos en v1.

## Página de caso

### Objetivo

Demostrar pensamiento y ejecución. Una galería bonita no alcanza; una explicación sin prueba visual tampoco.

### Jerarquía

1. Resumen escaneable.
2. Contexto y problema.
3. Decisiones y solución.
4. Evidencia visual y funcional.
5. Rol, stack y límites.
6. Resultados verificables o aprendizajes.
7. Siguiente paso.

### Componentes útiles

- screenshot amplio sin mockup cuando se necesita legibilidad;
- browser frame discreto cuando aporta contexto;
- zoom o detalle anotado;
- comparación de recorridos o estados;
- vídeo corto para paneles o interacción;
- ficha lateral de rol, estado y alcance;
- callout de limitación o aprendizaje.

No convertir cada sección en una card.

## About

### Objetivo

Dar confianza a clientes, agencias y recruiters sin transformar el sitio en un CV.

### Contenido

- narrativa profesional breve;
- forma de pensar y trabajar;
- experiencia como operador de Torvena;
- modalidades de colaboración confirmadas;
- ubicación, idiomas y zona horaria;
- herramientas principales agrupadas por función, no como nube de logos;
- LinkedIn y CV solo si están actualizados.

La foto puede tener más protagonismo aquí cuando exista.

## Contact

### Objetivo

Reducir fricción y reunir el contexto mínimo para responder bien.

### Contenido

- qué proyectos encajan;
- formulario breve;
- email alternativo;
- expectativa de respuesta;
- tratamiento de datos;
- opciones para agencias o contract dentro del mismo selector de necesidad.

No exigir crear una cuenta, agendar una llamada ni completar un brief extenso.

## Página de privacidad

Necesaria si se usa formulario, analytics, cookies no esenciales o servicios de terceros. Su contenido y consentimiento deben definirse según la implementación real; no copiar una política genérica antes de conocer herramientas y flujo de datos.

## Arquitectura futura, no v1

Agregar solo con evidencia de necesidad:

- páginas de servicio con contenido propio y estrategia SEO;
- notas o insights;
- recursos descargables;
- agenda directa;
- CMS;
- versiones específicas para agencias o recruiters.

