# Brisa do Mar — ficha factual consolidada

**Estado del documento:** base confirmada para redactar el caso.  
**Última actualización:** 8 de agosto de 2026.

Este archivo reúne información aportada por Alejandro, evidencia observada en producción y funcionalidades verificadas en el repositorio local.

## Identidad y estado

- **Nombre:** Brisa do Mar.
- **URL:** https://brisa-do-mar-arraial.alegfink.chatgpt.site/
- **Relación:** solución desarrollada para una amiga de Alejandro que trabaja con experiencias turísticas en Arraial do Cabo.
- **Estado:** activa y utilizada para presentar actividades y generar consultas por WhatsApp.
- **Publicación inicial:** fines de julio de 2026.
- **Primer commit verificable:** 29 de julio de 2026.
- **Dominio:** URL actual de ChatGPT Sites; existe intención de migrar a un dominio propio que deberá adquirir la responsable.
- **Autorización:** Alejandro confirma permiso para mostrar marca, imágenes, funcionamiento y screenshots.

## Definición breve

Brisa do Mar es una solución web multilingüe para presentar y comparar experiencias turísticas en Arraial do Cabo. Centraliza actividades, imágenes, condiciones y precios; guía al visitante según el tipo de experiencia que busca y prepara el contacto por WhatsApp para que la anfitriona cierre la consulta personalmente.

## Punto de partida

Antes de la web, la responsable se acercaba a turistas en la playa, presentaba las actividades mediante un folleto y resolvía por WhatsApp las dudas, fotografías, condiciones y precios.

Esto generaba una experiencia fragmentada:

- la información dependía de una conversación individual;
- las imágenes y condiciones debían enviarse repetidamente;
- los precios eran más difíciles de mantener consistentes;
- el visitante no podía comparar alternativas por su cuenta;
- la propuesta tenía menos respaldo digital;
- español, portugués e inglés debían resolverse manualmente.

## Objetivo

Construir una vidriera confiable y fácil de mantener que:

- reúna la oferta completa;
- muestre material y precios vigentes;
- atienda a turistas en español, portugués e inglés;
- ayude a elegir una actividad;
- reduzca preguntas repetitivas;
- entregue a WhatsApp una consulta con mejor contexto;
- permita comprender cómo llegan y qué hacen los visitantes.

## Público

- turistas que visitan Arraial do Cabo;
- parejas, familias y grupos;
- personas interesadas en barco, buceo, snorkel, buggy o quadriciclo;
- visitantes que se comunican en español, portugués o inglés.

## Rol de Alejandro

Alejandro dirigió y construyó la solución completa con asistencia de IA:

- descubrimiento del problema;
- arquitectura de información;
- estructura comercial y recorrido de conversión;
- copy y adaptación ES/PT/EN;
- diseño visual y responsive;
- desarrollo frontend;
- recomendador de experiencias;
- asistente de consulta;
- integración con WhatsApp;
- panel administrativo;
- modelo de datos;
- analytics first-party;
- autenticación administrativa;
- optimización y publicación;
- mantenimiento inicial.

La responsable aportó:

- fotografías y videos;
- precios vigentes;
- información de actividades;
- aclaraciones comerciales y operativas.

No se identificaron otros colaboradores.

## Experiencia pública verificada

- Navegación en español, portugués e inglés.
- Cinco tipos de experiencia: barco, buceo, snorkel, buggy y quadriciclo.
- Comparación de duración, estilo, público ideal, precio e inclusiones.
- Detalle ampliado de cada actividad.
- Paquetes de barco y rutas de buggy.
- Recomendador interactivo según preferencia del visitante.
- Galería de imágenes y videos.
- Presentación de la anfitriona.
- Contenido de confianza y preguntas frecuentes.
- Asistente que solicita actividad, fecha, cantidad de personas, idioma y preferencia.
- Mensaje de WhatsApp preparado con el contexto elegido.
- Botones contextuales de WhatsApp.
- Navegación accesible, soporte de teclado y reduced motion observados en la implementación.

## Panel administrativo verificado

### Gestión de precios

El panel permite actualizar los valores publicados de actividades, paquetes y tasas. Para cada valor se puede elegir:

- precio fijo;
- precio “desde”;
- consultar valor.

Los precios generales de barco y buggy se derivan automáticamente de las opciones disponibles para evitar duplicaciones y diferencias.

### Presentación de precios

Alejandro confirmó que la referencia inicial a “disponibilidad” describía la opción de publicar una actividad como “consultar valor”. El panel no administra cupos ni disponibilidad por fecha.

La función debe presentarse como gestión de precios y modalidad de publicación: fijo, “desde” o “consultar”.

### Analytics

El panel permite consultar períodos de 7, 30 y 90 días y muestra:

- visitas del período y del día;
- sesiones que continuaron a WhatsApp;
- oportunidades generadas por el asistente;
- tasa de microconversión entre visita y consulta preparada;
- principal origen;
- fuentes de tráfico;
- tendencia diaria;
- dispositivos;
- recorrido previo a WhatsApp;
- actividades vistas, detalles abiertos y clics;
- idiomas utilizados;
- campañas y UTMs;
- paquetes, rutas o planes seleccionados;
- enlaces rastreables para compartir en canales concretos.

Una “oportunidad” representa una consulta preparada para WhatsApp, no una reserva ni una venta confirmada. Esta distinción debe conservarse en el portfolio.

## Datos registrados

### Visita

- identificador anónimo de sesión;
- fecha y hora;
- fuente;
- host de referencia;
- ruta;
- UTM source y campaign;
- dispositivo;
- idioma.

### Interacción

- actividad vista;
- detalle abierto;
- plan seleccionado;
- opción seleccionada;
- clic a WhatsApp;
- cambio de idioma;
- apertura del asistente.

### Oportunidad

- actividad;
- fecha de viaje;
- cantidad de personas;
- idioma;
- preferencia;
- contexto;
- fuente, campaña y dispositivo.

La implementación declara que no almacena nombres, teléfonos ni direcciones IP en analytics.

## Arquitectura técnica verificada

### Frontend

- React 19.
- TypeScript 5.7.
- Vite 6.
- Lucide React para iconografía.
- CSS propio y diseño responsive.

### Hosting y backend

- Proyecto configurado para OpenAI Sites.
- Worker propio para servir la aplicación y las APIs.
- Base de datos D1 vinculada como DB.
- Migraciones SQL para precios, tráfico, interacciones y oportunidades.
- Endpoints propios para precios, analytics y panel.

### Autenticación

- Acceso administrativo protegido mediante HTTP Basic.
- Usuario y contraseña almacenados como variables de entorno.
- Comparación segura de credenciales mediante hash.
- Rutas administrativas y respuestas marcadas como privadas y no indexables.

### Medios

- Material original reunido en la carpeta imagenes-y-videos-reales.
- Versiones optimizadas dentro de public/media/optimized.
- Imágenes responsive en WebP.
- Videos con posters y reproducción controlada.

### IA

La estrategia, el contenido, el diseño y el desarrollo fueron realizados por Alejandro con asistencia de IA. La formulación del caso debe enfatizar dirección, criterio y validación, no presentar la herramienta como autora autónoma.

## Decisiones demostrables

### 1. Mantener WhatsApp como cierre, pero mejorar lo que ocurre antes

La solución no intenta reemplazar el proceso comercial de la anfitriona. Organiza la información y prepara una consulta más completa antes de entregar la conversación a WhatsApp.

### 2. Diseñar para tres idiomas desde la arquitectura

El sitio no agrega traducciones como una capa tardía: contenido, actividades, FAQs, mensajes y opciones de contacto están estructurados para ES/PT/EN.

### 3. Ayudar a elegir, no solo listar

El recomendador traduce preferencias como relajación, familia, vida marina, fotografía o adrenalina en una sugerencia concreta.

### 4. Centralizar precios sin duplicarlos

El panel actualiza valores y las tarjetas generales derivan el precio mínimo automáticamente. Esto reduce inconsistencias entre páginas y mensajes de WhatsApp.

### 5. Medir el recorrido hasta la consulta

El sistema no se limita a contar visitas: registra qué actividad despertó interés, qué opciones se eligieron y en qué momento se continuó a WhatsApp.

### 6. Proteger la privacidad del visitante

La analítica se diseñó alrededor de sesiones e interacciones, sin guardar nombres, teléfonos ni IPs.

## Estado actual

Confirmado:

- sitio público activo;
- uso real por la responsable;
- ES/PT/EN activos;
- precios dinámicos;
- panel protegido;
- analytics y tracking activos en producción según Alejandro;
- contacto y asistente de WhatsApp funcionales;
- material real aportado por la responsable;
- autorización para mostrar el proyecto.

## Límites

- La conversión final ocurre por WhatsApp; no hay reserva ni pago online.
- Todavía no existen métricas maduras de consultas o reservas por la reciente publicación.
- El panel no exporta analytics.
- El panel no administra cupos ni disponibilidad por fecha; esta función no forma parte del alcance.
- El dominio actual es temporal.
- El README y PHOTO_CREDITS describen una etapa anterior de prototipo con material demostrativo. Deben reconciliarse con los assets actuales antes de afirmar que cada imagen publicada es propia.

## Evidencia disponible

- sitio en producción;
- repositorio y commits;
- código del panel y APIs;
- esquema y migraciones de base de datos;
- imágenes y videos fuente;
- medios optimizados;
- actividad futura del panel, cuando exista volumen;
- acceso administrativo que puede demostrarse mediante grabación sin compartir credenciales.

## Resultados

No hay resultados cuantitativos publicables todavía.

Resultados cualitativos confirmados:

- la oferta dejó de depender únicamente de folleto y explicaciones manuales;
- actividades, imágenes, condiciones y precios están centralizados;
- el visitante puede informarse en tres idiomas;
- la anfitriona puede mantener precios sin editar código;
- el contacto por WhatsApp llega con más contexto;
- existe medición del recorrido previo a la consulta.

Estas formulaciones describen capacidades y cambios observables; no afirman aumento de ventas ni reducción medida de trabajo.

## Ángulo narrativo recomendado

**De un folleto y conversaciones repetitivas a una experiencia turística multilingüe y administrable.**

Brisa do Mar debe demostrar que Alejandro puede entender una operación de servicios, preservar el canal humano que cierra la venta y construir alrededor de él una solución digital con contenido, gestión y medición.

## Pendientes mínimos

1. Confirmar si alguna imagen demostrativa de la primera versión permanece en producción.
2. Grabar una demo breve del panel sin revelar credenciales.
3. Elegir 6–10 pantallas para el caso.
4. Incorporar métricas solo cuando exista un período suficiente y una definición verificable.
