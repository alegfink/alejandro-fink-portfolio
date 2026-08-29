# Torvena — ficha factual consolidada

**Estado del documento:** base confirmada para redactar el caso.  
**Última actualización:** 17 de agosto de 2026.

Este archivo separa información aportada por Alejandro, evidencia observada en producción y datos verificados en los repositorios de Torvena.

## Identidad y estado

- **Nombre:** Torvena.
- **URL:** https://torvena.com.ar/
- **Relación:** negocio propio de Alejandro Fink.
- **Estado:** en producción, recibiendo pedidos y con campañas publicitarias activas.
- **Categoría:** e-commerce argentino de tecnología y soluciones prácticas para vehículos.
- **Modelo de producto:** selección de accesorios importados; Torvena no fabrica los productos.
- **Alcance geográfico:** Argentina.
- **Autorización:** Alejandro autoriza el uso de la marca y screenshots en su portfolio.

## Definición breve

Torvena es una marca argentina de accesorios tecnológicos y soluciones prácticas para vehículos. Selecciona productos importados por el problema que resuelven —carga, orden, limpieza, protección o autonomía— y los ofrece mediante un canal de venta propio con atención local.

## Cronología de trabajo

- **Principios de marzo de 2026:** inicio de la idea, todavía sin nombre ni marca.
- **Marzo–mayo:** definición de marca, búsqueda de proveedores, selección de producto y construcción del primer canal de venta con Lovable.
- **Mayo:** primer lanzamiento.
- **Después del primer lanzamiento:** pausa provocada por problemas con la cuenta o red social de Instagram.
- **Principios de julio:** relanzamiento.
- **Desde julio:** reestructuración completa del storefront con ChatGPT Codex.
- **14 de julio:** primer commit verificable del repositorio actual basado en Shopify Hydrogen.

Alejandro confirmó que marzo, mayo y julio corresponden a 2026.

## Punto de partida

Torvena comenzó desde cero. No existían marca, catálogo, proveedores ni canal de venta. El objetivo era construir un negocio propio alrededor de una categoría que Alejandro conocía y le interesaba: soluciones útiles para el automóvil.

El trabajo incluyó simultáneamente definición comercial, marca, sourcing, producto, experiencia web, adquisición y operación.

## Público

- Compradores de todo el país.
- Mayoritariamente mayores de 30 años según la observación inicial de Alejandro.
- Buscan resolver necesidades de orden, limpieza, carga de dispositivos y preparación ante imprevistos.

La documentación de marca identifica un núcleo de 40–65 años y un público de crecimiento de 25–39. El dato definitivo debe contrastarse con Meta Ads o analytics antes de publicar un rango exacto.

## Rol de Alejandro

Alejandro fundó y opera Torvena de punta a punta. Su participación confirmada incluye:

- elección de categoría y modelo de negocio;
- creación del nombre, posicionamiento y sistema de marca;
- investigación de productos y proveedores;
- definición de catálogo, precios, presupuestos y promociones;
- arquitectura del sitio y navegación;
- dirección visual y experiencia de usuario;
- dirección de la implementación técnica asistida por IA;
- configuración y operación de Shopify;
- páginas de producto, colecciones y contenido comercial;
- combos, descuentos, upsells y experiencia de carrito;
- producción y dirección de imágenes, videos y copy;
- campañas de Meta Ads;
- analytics y atribución;
- atención, logística, seguimiento y operación cotidiana;
- iteración de oferta, contenido y experiencia.

### Cómo describir la autoría técnica

La formulación precisa no es “Alejandro escribió manualmente todo el código”. La implementación fue dirigida por Alejandro y construida de forma asistida con Lovable en la primera etapa y ChatGPT Codex en la reestructuración actual.

Formulación recomendada:

> Dirigí el proyecto de punta a punta y utilicé herramientas de desarrollo asistido por IA para convertir decisiones comerciales, de UX y de producto en un storefront personalizado y operativo.

## Participación de terceros

- No se contrataron agencias, diseñadores ni desarrolladores externos.
- Una persona produjo una pieza UGC utilizada en una etapa anterior; ya no forma parte de la comunicación activa.
- Referencias de Pinterest y otros sitios fueron utilizadas como inspiración, no como autoría del proyecto.
- Proveedores aportaron los productos y parte del material de origen cuando correspondió.

Antes de mostrar piezas derivadas de UGC o material de proveedores se deben revisar derechos y transformaciones.

## Solución construida

La implementación pública y el repositorio permiten verificar:

- Home editorial orientada a necesidades del conductor.
- Catálogo y colecciones de Shopify.
- Navegación por necesidad: carga, seguridad/autonomía, limpieza y orden.
- Páginas de producto personalizadas.
- Presentaciones de producto con fotografía, video, demostración y educación.
- Combos comerciales.
- Descuentos y lógica de precios.
- Upsells y progreso de beneficios en carrito.
- Carrito y checkout conectado a Shopify.
- Búsqueda y búsqueda predictiva.
- Garantía, políticas, contacto y botón de arrepentimiento.
- WhatsApp como canal de soporte.
- Meta Pixel y eventos de comercio.
- Analytics first-party y atribución de campañas.
- Panel administrativo protegido para analytics.
- Registro seguro de pedidos pagados sin almacenar datos personales en la capa analítica.
- Base técnica preparada para Customer Account, aunque el acceso público se presenta actualmente como “próximamente”.

## Arquitectura técnica verificada

### Comercio y hosting

- Shopify como fuente de verdad de productos, variantes, precios, inventario, promociones y checkout.
- Shopify Hydrogen 2026.4.4 como framework de storefront headless.
- Shopify Oxygen como entorno de despliegue documentado.
- Storefront API y Customer Account API mediante GraphQL.

### Frontend

- React 18.3.1.
- React Router 7.16.0.
- TypeScript 5.9.2.
- Vite 8.0.1.
- CSS propio y sistema de tokens.

### Datos y analytics

- Supabase JavaScript 2.110.7.
- Supabase Auth para acceso administrativo.
- Row Level Security para proteger sesiones, eventos, órdenes y roles.
- Tracking first-party de sesiones, vistas de producto y eventos de carrito.
- Captura de UTM e identificadores de campaña, conjunto y anuncio de Meta.
- Clasificación y exclusión de tráfico interno.
- Panel administrativo de analytics.
- Supabase Edge Function para el webhook orders/paid de Shopify.
- Validación HMAC, deduplicación y almacenamiento sin información personal del comprador.

### Marketing y medición

- Meta Ads.
- Meta Pixel con PageView, ViewContent y AddToCart, entre otros eventos implementados.
- Atribución de campañas mediante UTM e IDs de Meta.
- Google Business Profile, según la ficha de Alejandro.

### IA y producción

- Lovable en la primera etapa del storefront.
- ChatGPT y Codex para estrategia, investigación, análisis, contenido y desarrollo.
- Herramientas de generación de imágenes y video documentadas en el brand system.
- CapCut para compilación y edición manual de video.

No es necesario enumerar todas estas tecnologías en la Home del portfolio. En el caso deben aparecer solo las que explican decisiones relevantes.

## Decisiones demostrables

### 1. Crear la marca y el canal desde cero

Alejandro no recibió un producto definido para implementar. Eligió la categoría, creó la marca, buscó proveedores y construyó el canal comercial.

### 2. Organizar el catálogo alrededor de problemas

La experiencia pública prioriza necesidades —carga, limpieza, autonomía y orden— en lugar de presentar únicamente categorías técnicas. Esto conecta la navegación con situaciones de uso.

### 3. Evolucionar de una primera implementación a un storefront headless

El proyecto pasó de una primera etapa construida con Lovable a una arquitectura personalizada con Shopify Hydrogen y un sistema de marca documentado.

### 4. Crear medición propia de adquisición y compra

El sistema complementa Shopify y Meta con analytics first-party, UTMs, exclusión de tráfico interno y asociación anónima entre sesión y pedido pagado.

### 5. Expandir el catálogo ante una restricción de suministro

La falta de reposición del primer proveedor se convirtió en una decisión de diversificación y expansión de marca.

### 6. Incorporar un ciclo controlado de auditoría, QA y publicación

Entre el 15 y el 17 de agosto de 2026, el storefront completó una auditoría técnica integral, correcciones con pruebas de regresión, varios ciclos de QA/re-QA, validación en Oxygen Preview, migraciones de Supabase, configuración de Google OAuth, despliegue gradual y smoke de Producción.

Hechos documentados del cierre:

- la candidata focalizada `4fb9c3d` aprobó 33/33 pruebas, lint, TypeScript, build, rutas y auditoría productiva sin vulnerabilidades;
- Preview usó exclusivamente Supabase Staging `earxzitnldvxizicmrdz` y Producción mantuvo `hecnofqkdcaqtuwgwhsn`;
- se aplicaron cinco migraciones pendientes en Producción después de backup y autorización explícita;
- el carrito optimista se verificó bajo red lenta y request bloqueada, con coherencia visual, rollback y reintento;
- Google OAuth, checkout y un redirect administrado se probaron en el entorno correspondiente;
- el despliegue productivo terminó con smoke y una compra real controlada mediante transferencia bancaria.

Alejandro definió prioridades y criterios de aceptación, configuró o revisó acciones manuales, autorizó cambios sensibles y validó los recorridos. Codex ejecutó análisis, cambios, automatizaciones y verificaciones técnicas bajo esa dirección. Esta evidencia respalda coordinación funcional y de release asistida por IA; no desarrollo, QA automation, DevOps, seguridad o bases de datos con autonomía profesional.

## Estado actual y límites

- Storefront, catálogo, carrito, checkout, campañas y operación: activos.
- La tienda pública, el carrito y el checkout están operativos. Lo que permanece pendiente es el acceso privado para que cada cliente inicie sesión y gestione su cuenta; esto no limita el recorrido público de compra.
- El seguimiento first-party de pedidos pagados funciona en producción y forma parte de la operación habitual.
- Google Analytics 4 está implementado en Torvena y Alejandro inició su revisión práctica. La experiencia es inicial: no se presenta como dominio avanzado ni como base suficiente para atribución o mejoras causales. Los resultados cuantitativos se documentarán cuando exista un período y una fuente consistentes.
- El claim sobre resistencia de Luo requiere la demostración documentada en el sistema de marca; no debe utilizarse como evidencia del caso del portfolio.

## Evidencia disponible

- Sitio en producción.
- Repositorio completo del storefront actual.
- Sistema documentado de marca, contenido, medios y motion.
- Fotografías de producto y contexto.
- Videos editados y material original.
- Piezas de Meta Ads.
- Registros de Shopify y analytics.
- Conversaciones reales de atención y registros de entregas, sujetos a anonimización y selección.

No hace falta crear desde cero una carpeta de assets. Primero se debe curar y copiar únicamente el material seleccionado desde los repositorios existentes al workspace del portfolio.

## Resultados

Confirmado cualitativamente:

- negocio activo;
- pedidos reales;
- campañas activas;
- operación nacional;
- experiencia acumulada en construcción y operación de e-commerce.

Confirmado cuantitativamente con corte y definiciones documentados:

- al 9 de agosto de 2026, Shopify registraba 95 pedidos, 136 artículos netos vendidos, ARS 5.957.610 de ventas netas y ARS 6.462.010 de ventas totales; el inicio del acumulado es desconocido y las ventas no equivalen a ganancia;
- entre el 11 de julio y el 9 de agosto de 2026, Shopify registró 22 pedidos, ARS 1.714.070 de ventas netas y ARS 1.759.170 de ventas totales;
- el analytics first-party observó 2.565 sesiones consentidas desde el 21 de julio hasta la generación parcial del 10 de agosto de 2026, y el webhook incorporado el 29 de julio capturó 19 órdenes pagadas; estas coberturas no son comparables con todo el acumulado de Shopify.

Continúan pendientes para claims más amplios el historial estable de GA4 y first-party, clientes Shopify, inversión y atribución de Meta, costos/margen y una reconciliación formal entre órdenes, pagos, devoluciones y ventas netas.

## Aprendizajes aportados por Alejandro

- optimización de experiencia web;
- uso de analytics para comprender el negocio;
- operación de Shopify;
- uso de Supabase para datos y medición;
- Google Business Profile;
- campañas de Meta Ads;
- importancia de confianza, prueba real y baja fricción.

La afirmación “más opciones y una oferta más agresiva aumentan la conversión” debe tratarse como hipótesis o aprendizaje cualitativo hasta contar con un experimento y período comparables.

## Ángulo narrativo recomendado

**De cero a un e-commerce operado en primera persona.**

Torvena debe demostrar que Alejandro no solo diseña una interfaz: define una oferta, construye el sistema de venta, conecta medición, gestiona adquisición y aprende de una operación real.

## Pendientes actuales

1. Acumular historial comparable de GA4 y analytics first-party antes de sostener atribución, crecimiento o mejora causal.
2. Obtener reportes compatibles de Meta y datos de costos/margen sólo si un claim futuro los vuelve necesarios.
3. Mantener el acceso privado de clientes como funcionalidad pendiente hasta que esté disponible y verificado públicamente.
4. Curar 6–10 pantallas o assets y decidir qué métricas fechadas, si alguna, se mostrarán en el portfolio público.
