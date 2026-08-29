# Luca DS Coaching — ficha factual consolidada

**Estado del documento:** base confirmada para un caso compacto y actualizada tras la publicación de la nueva landing.
**Última actualización:** 28 de agosto de 2026.

Este archivo reúne información aportada por Alejandro y evidencia de la implementación disponible en `C:\Users\Ale\Desktop\Luca-programa`.

## Identidad y estado

- **Nombre visible:** Luca DS.
- **Responsable y figura del servicio:** Luca De Simone.
- **URL pública actual:** https://luca-ds-coaching.alegfink.chatgpt.site/
- **Relación:** Luca es amigo y socio de Alejandro en este proyecto.
- **Estado:** proyecto compartido en evolución; la nueva landing está publicada en producción. Todavía no existen métricas atribuibles suficientes para comunicar resultados.
- **Autorización:** Alejandro cuenta con permiso para mostrar el nombre, Instagram, fotografías, caso de éxito, ofertas, pantallas y proceso en su portfolio.
- **Fecha de implementación inicial verificable:** 2 de agosto de 2026.
- **Última publicación verificada:** 28 de agosto de 2026.

## Definición breve

Luca DS es un proyecto de coaching de físico y mentalidad orientado a personas que entrenan hace tiempo pero siguen estancadas. La propuesta combina estructura de entrenamiento, seguimiento, hábitos y disciplina mediante una comunicación directa y sin promesas mágicas.

Alejandro y Luca construyen y evolucionan el proyecto en conjunto. Luca aporta la figura, experiencia y servicio; Alejandro desarrolla la propuesta digital y comercial. La división operativa más detallada todavía puede documentarse a medida que avance la operación.

## Público y problema

La landing se dirige a personas que:

- entrenan desde hace meses o años;
- sienten que su físico no refleja el esfuerzo realizado;
- saltan entre rutinas y consejos sin una estructura consistente;
- valoran seguimiento y feedback directo;
- buscan sostener hábitos fuera del gimnasio.

La idea central no es “falta motivación”, sino “falta un sistema que permita medir, ejecutar, ajustar y sostener”.

## Ofertas confirmadas

Alejandro confirmó que la estructura de ofertas es válida por ahora.

### Coaching DS 1:1

Presentado como acompañamiento personalizado con:

- diagnóstico inicial;
- plan de entrenamiento personalizado;
- objetivos y acciones semanales;
- revisiones y ajustes;
- trabajo sobre hábitos y mentalidad;
- feedback directo.

La página deriva a una evaluación mediante conversación en Instagram. Duración, precio, cupos y modalidad exacta todavía no están publicados.

### Protocolo Base DS

Presentado como producto digital de entrada, sin seguimiento individual y marcado como “próximamente”. Su contenido propone una hoja de ruta, entrenamiento progresivo, seguimiento personal y hábitos.

El nombre y el alcance son válidos para la etapa actual, pero pueden evolucionar antes del lanzamiento.

## Caso 62 kg → 71 kg

Alejandro confirmó que el caso es real, válido y cuenta con autorización para ser mostrado. La página lo presenta como un proceso acompañado por Luca y utiliza una fotografía de evolución.

Antes de convertirlo en una prueba detallada del portfolio conviene documentar:

- identidad publicable o decisión de mantenerla anónima;
- período durante el cual ocurrió el cambio;
- punto de partida y condiciones relevantes;
- alcance exacto del acompañamiento de Luca;
- contexto detrás del aumento de peso y composición corporal.

Mientras esos datos no estén disponibles, la formulación segura es: **caso real y autorizado de evolución de 62 kg a 71 kg acompañado por Luca**, sin afirmar plazo ni causalidad adicional.

## Rol de Alejandro

El repositorio y la explicación del proyecto permiten atribuir a Alejandro:

- desarrollo conjunto del concepto comercial;
- posicionamiento y dirección del mensaje;
- organización de las dos líneas de producto;
- arquitectura de la landing;
- copy y tratamiento de objeciones;
- UX y recorrido hacia Instagram;
- dirección visual;
- desarrollo frontend asistido por IA;
- dirección y edición de composiciones visuales;
- dirección e implementación del hero cinemático y la narrativa de scroll;
- optimización responsive;
- metadata y pieza social;
- publicación y evolución de la landing en producción.

Luca aporta su historia, experiencia, fotografías, servicio, caso de éxito, contenido de referencia y validación de la oferta.

## Experiencia implementada

- Hero inmersivo en video con el mensaje “Tu físico no miente”.
- Posicionamiento alrededor de entrenamiento, hábitos y mentalidad.
- Sección de problema y “verdad incómoda”.
- Método en cuatro pasos: diagnóstico, plan, control y mentalidad.
- Historia personal de Luca.
- Bloque editorial centrado en disciplina y físico.
- Caso real 62 kg → 71 kg.
- Presentación diferenciada del 1:1 y del producto de entrada.
- Filtro “es para vos / no es para vos”.
- Preguntas frecuentes.
- CTAs reiterados hacia el Instagram oficial `@lucadsok`.
- Tarjeta Open Graph propia.
- Diseño responsive y soporte para reduced motion.
- Preloader, transiciones y progresión narrativa vinculadas al scroll.

## Funcionalidad real

La página es una landing estática orientada a iniciar conversaciones por Instagram.

Implementado:

- navegación interna;
- enlaces externos a Instagram;
- secciones de oferta y afinidad;
- FAQs desplegables;
- adaptación responsive;
- metadata social dinámica según el host.

No implementado:

- formulario de evaluación;
- captura o almacenamiento de leads;
- analytics o eventos de conversión;
- base de datos;
- CRM;
- agenda;
- pagos;
- cuentas de usuario;
- entrega del producto digital;
- panel administrativo.

La conversión solo puede verificarse mediante conversaciones que lleguen al Instagram de Luca y, en la versión actual, no existe atribución propia desde la página.

## Imágenes y dirección de arte

La carpeta contiene:

- fotografías reales de Luca;
- una imagen del caso de éxito;
- una fotografía de entrenamiento obtenida de Unsplash y acreditada en el footer;
- composiciones editoriales del hero y del bloque de físico;
- tarjeta social `og.png`;
- favicon propio.

El historial del repositorio identifica parte del trabajo como arte de campaña generado y refinado. Para el portfolio puede describirse como **dirección de arte y edición asistidas por IA a partir de material autorizado**, sin presentar las composiciones como fotografía documental sin intervención.

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
- metadatos Open Graph y Twitter;
- skip link y estructura semántica básica;
- responsive para escritorio, tablet y móvil;
- reducción de movimiento contemplada;
- dependencias de D1 y Drizzle presentes por el starter, pero sin tablas ni uso real.

El archivo de pruebas continúa validando el starter inicial y no la landing actual. Debe actualizarse antes de considerar la verificación automatizada como parte de la calidad del proyecto.

## Decisiones demostrables

### 1. Definir un público más específico que “personas que quieren estar en forma”

La propuesta se concentra en quienes ya entrenan y están estancados. Esto permite hablar desde frustraciones y objeciones más concretas.

### 2. Construir una voz coherente con Luca

La dirección verbal es directa, confrontativa y rioplatense. Evita el tono suave de autoayuda y utiliza disciplina, estructura y responsabilidad como ejes.

### 3. Separar una oferta personalizada de un producto de entrada

El 1:1 sirve a quien necesita acompañamiento cercano. El protocolo futuro abre una vía de menor compromiso sin fingir que ya está disponible.

### 4. Usar Instagram como cierre inicial

La primera versión prioriza el canal que Luca ya utiliza, sin agregar un formulario o CRM antes de definir la operación comercial definitiva.

### 5. Combinar material real y dirección de arte

Las fotografías mantienen a Luca como figura reconocible mientras las composiciones editoriales construyen una identidad visual más diferenciada.

### 6. Mostrar prueba sin prometer resultados universales

El caso se presenta como experiencia individual y el footer aclara que los resultados dependen de cada persona y de su constancia.

## Resultados

No existen métricas de tráfico, consultas o ventas atribuibles a la landing porque todavía no se lanzó como página de producción y no tiene analytics propios.

El resultado actual es un sistema comercial y visual acordado entre los socios, materializado en una landing pública de trabajo y preparado para evolucionar antes del lanzamiento.

## Ángulo narrativo recomendado

**Construir junto a un socio una marca de coaching lista para pasar de Instagram a un sistema comercial propio.**

El caso puede demostrar posicionamiento, arquitectura de oferta high-ticket, dirección verbal, diseño orientado a conversión y desarrollo visual, manteniendo visible que el proyecto todavía está en construcción.

## Estado visible recomendado

`Proyecto en desarrollo · Lanzamiento próximo`

## Pendientes mínimos

1. Definir la división operativa exacta entre Alejandro y Luca para la etapa de producción.
2. Documentar el período y contexto completo del caso 62 kg → 71 kg si se quiere destacar como evidencia.
3. Confirmar nombres, duración, precio, cupos y modalidad antes del lanzamiento.
4. Definir cómo se medirán las conversaciones originadas en la landing.
5. Actualizar las pruebas automatizadas para que validen la página real.
6. Reemplazar el estado del caso por “En producción” solo después del lanzamiento efectivo.
