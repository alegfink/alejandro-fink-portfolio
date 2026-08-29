# Lourdes Mirada — ficha factual consolidada

**Estado del documento:** base confirmada para un caso compacto.  
**Última actualización:** 8 de agosto de 2026.

Este archivo reúne la explicación de Alejandro, la página pública y la implementación disponible en `C:\Users\Ale\Desktop\Luutienda`.

## Identidad y estado

- **Nombre editorial del caso:** Lourdes Mirada.
- **URL pública:** https://lourdes-mirada.alegfink.chatgpt.site/
- **Instagram:** https://www.instagram.com/luutienda/
- **Relación:** Lourdes es amiga de Alejandro y pareja de un amigo suyo.
- **Colaboración previa:** Lourdes produjo contenido UGC para Torvena.
- **Origen:** propuesta proactiva de Alejandro; no fue un encargo.
- **Recepción:** Alejandro le entregó la página a Lourdes y a ella le encantó.
- **Autorización:** existe permiso para mostrar la página, las imágenes, los reels y el proceso en el portfolio.
- **Estado:** sitio aprobado pero no utilizado como canal operativo, porque Lourdes actualmente prefiere limitar la demanda y trabajar con su cartera existente desde Instagram.
- **Fecha verificable:** 1 de agosto de 2026.

## Definición breve

Lourdes Mirada es un portfolio editorial para una fotógrafa y creadora de contenido que hasta ese momento ofrecía sus servicios únicamente mediante Instagram. Alejandro transformó su archivo visual, su personalidad y los conceptos que comunicaba en redes en una experiencia web propia.

## Punto de partida

Lourdes no tenía una página. Su presencia digital y comercial dependía de Instagram, donde mostraba trabajos, reels, estilo personal y servicios.

Alejandro propuso organizar ese material en un portfolio que:

- expresara una mirada autoral;
- curara el archivo sin convertirlo en una galería genérica;
- presentara fotografía y video dentro de un mismo sistema;
- ordenara los servicios;
- introdujera a Lourdes como creadora;
- condujera las consultas hacia su canal habitual.

## Servicios reales

Alejandro confirmó que las tres familias presentadas corresponden a servicios reales de Lourdes:

- **Para marcas:** campañas, producto, lifestyle y banco de imágenes.
- **Contenido y UGC:** concepto, guion, video vertical y edición para redes.
- **Historias personales:** retratos, parejas, eventos íntimos y viajes.

La página no publica precios, paquetes ni disponibilidad. Su función es presentar el trabajo y derivar el contacto a Instagram.

## Rol de Alejandro

Alejandro realizó íntegramente:

- conceptualización de la página;
- traducción de la identidad percibida en Instagram a una dirección web;
- arquitectura de información;
- selección y curaduría del material;
- conceptos editoriales de las piezas y secciones;
- posicionamiento y copy;
- identidad visual aplicada al sitio;
- UX y diseño responsive;
- desarrollo frontend asistido por IA;
- integración de portfolio y reels;
- metadata y pieza social;
- publicación del prototipo.

Lourdes aportó:

- fotografías y reels propios;
- identidad personal y referencias transmitidas mediante su trabajo y conversaciones;
- servicios reales;
- validación y aprobación del resultado.

No se identificaron otros colaboradores.

## Trabajo real y curaduría editorial

La carpeta contiene:

- 12 fotografías del archivo creativo de Lourdes;
- una fotografía de perfil;
- una selección de 6 imágenes para el portfolio principal;
- 2 imágenes utilizadas como portada de reels enlazados a Instagram;
- una pieza `og.png` para compartir el sitio.

Alejandro confirmó que las imágenes pertenecen al trabajo real de Lourdes y están autorizadas. Los títulos visibles —como “Dos miradas”, “La hora dorada” o “Postales vivas”— funcionan como conceptos editoriales del portfolio; no deben presentarse necesariamente como nombres originales de campañas o clientes.

Los reels enlazados conducen a publicaciones reales de `@luutienda` y forman parte de la evidencia de creación de contenido de Lourdes.

## Experiencia implementada

- Hero fotográfico con slideshow y posicionamiento.
- Manifiesto sobre su mirada creativa.
- Galería editorial de trabajos seleccionados.
- Enlaces hacia el archivo completo en Instagram.
- Sección de reels y contenido en movimiento.
- Tres familias de servicios.
- Presentación personal de Lourdes.
- Bloque de opiniones identificado como demostrativo.
- CTA final hacia Instagram.
- Metadata social y tarjeta Open Graph.
- Diseño responsive, foco visible y reducción de movimiento.

## Testimonios: distinción obligatoria

Las fotografías y los trabajos son reales. Los tres textos ubicados en “Lo que dicen” no son testimonios verificables.

El código y la página los rotulan expresamente como:

- “Opiniones de muestra”;
- “Texto ilustrativo”;
- textos que deberán reemplazarse por testimonios reales antes de una versión final.

Por lo tanto:

- no se utilizarán como evidencia del caso;
- no se atribuirán a clientes;
- no se presentarán como resultados;
- el portfolio de Alejandro puede mostrarlos únicamente si la captura deja visible su carácter ilustrativo, aunque lo preferible es excluir ese bloque del relato.

La explicación de Alejandro sobre “evidencia real” se aplica al material visual de Lourdes, no convierte estos copys de muestra en testimonios reales.

## Funcionalidad real

La implementación es un portfolio estático.

Implementado:

- navegación interna;
- slideshow visual;
- galería;
- enlaces externos a Instagram y reels;
- CTAs de contacto por Instagram;
- responsive;
- metadata y recursos sociales.

No implementado:

- formulario;
- agenda o reserva de sesiones;
- pagos;
- base de datos;
- CMS;
- analytics;
- panel de gestión;
- gestión de disponibilidad;
- reproducción de reels dentro del sitio.

## Arquitectura técnica verificada

### Aplicación

- React 19.2.
- estructura compatible con Next.js 16.
- Vinext 0.0.50 y Vite 8.
- TypeScript 5.9.
- CSS propio.

### Hosting

- proyecto configurado para OpenAI Sites;
- runtime compatible con Cloudflare;
- sin D1 ni R2 vinculados.

### Estado técnico

- landing de una sola página;
- metadata Open Graph y Twitter;
- diseño responsive;
- focus visible;
- soporte de reduced motion;
- carga diferida de parte de la galería;
- dependencias de Drizzle incluidas por el starter, sin uso real.

El archivo de pruebas continúa validando el starter inicial y no el portfolio actual. Debe actualizarse antes de presentar pruebas automatizadas como parte de la calidad técnica.

## Decisiones demostrables

### 1. Traducir una identidad existente sin inventar otra persona

La dirección surge de observar el lenguaje visual, los temas y la sensibilidad que Lourdes ya expresaba en Instagram.

### 2. Curar el archivo como narrativa

Las imágenes no aparecen en una cuadrícula uniforme. Se organizan mediante categorías, títulos y ritmos editoriales que ayudan a percibir variedad y mirada autoral.

### 3. Integrar fotografía y video

El portfolio conecta piezas estáticas, reels, UGC y servicios sin separar artificialmente las distintas formas de creación de Lourdes.

### 4. Mantener Instagram como canal comercial

La página aporta presentación y contexto, pero entrega el contacto al canal que Lourdes ya utiliza con sus clientes.

### 5. No forzar el lanzamiento cuando la capacidad es limitada

La decisión de no operar la página todavía responde a una restricción real de capacidad, no a una carencia técnica. Antes de activarla como canal de adquisición se debe definir disponibilidad y volumen aceptable.

### 6. Señalar el contenido demostrativo

Los testimonios de muestra están rotulados como ilustrativos. Aunque deben reemplazarse o retirarse, la interfaz evita presentarlos silenciosamente como prueba real.

## Estado actual y límites

Confirmado:

- actividad y servicios reales de Lourdes;
- archivo fotográfico y reels reales;
- propuesta proactiva de Alejandro;
- página aprobada y recibida favorablemente;
- permisos para mostrar el trabajo;
- código y assets disponibles localmente;
- contacto por Instagram funcional.

Límites:

- la página no opera como canal comercial activo;
- no existen métricas atribuibles;
- no hay herramientas de gestión o captación;
- los testimonios son ilustrativos;
- el mensaje “Disponible para proyectos” debe revisarse si la capacidad continúa limitada.

## Resultados

No existen métricas de tráfico, consultas o ventas porque la página no se utiliza actualmente para captar demanda.

El resultado verificable es una nueva presencia web, construida desde cero a partir de una identidad y un archivo existentes, aprobada por Lourdes y lista para activarse cuando su capacidad lo permita.

## Ángulo narrativo recomendado

**Convertir una identidad que vivía en Instagram en un portfolio editorial propio.**

El caso muestra curaduría, sensibilidad visual, adaptación de tono, arquitectura de servicios y capacidad para construir una experiencia alejada de los lenguajes de e-commerce y producto.

## Estado visible recomendado

`Portfolio aprobado · Activación pendiente`

## Pendientes mínimos

1. Confirmar si las frases personales y la ubicación Buenos Aires fueron aprobadas literalmente o adaptadas por Alejandro.
2. Retirar o reemplazar testimonios ilustrativos antes de usar la página como canal operativo.
3. Ajustar “Disponible para proyectos” a la capacidad real antes de activar la captación.
4. Actualizar las pruebas automatizadas para validar la página real.
5. Cambiar el estado del caso solo cuando Lourdes decida operar la página.
