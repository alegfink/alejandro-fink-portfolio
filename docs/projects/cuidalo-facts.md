# CUIDALO — ficha factual consolidada

**Estado del documento:** base verificada; quedan confirmaciones puntuales antes de redactar el caso público.  
**Última actualización:** 8 de agosto de 2026.

Este archivo reúne información aportada por Alejandro, evidencia del repositorio local y documentación de investigación, marca y producto guardada en `C:\Users\Ale\Desktop\Localizate`.

## Identidad y estado

- **Nombre de trabajo:** CUIDALO.
- **URL pública del MVP:** https://cuidalo-argentina.alegfink.chatgpt.site/
- **Relación y propiedad:** proyecto propio perteneciente a Alejandro y a su socio.
- **División general:** el socio se ocupará de redes sociales; Alejandro se ocupa de la web, marketing y desarrollo general de la propuesta.
- **Autorización:** Alejandro está autorizado por su socio para mostrar la marca, el proyecto, las pantallas y el proceso en su portfolio.
- **Estado:** MVP público de validación; todavía no tuvo lanzamiento comercial ni está operando como e-commerce de producción.
- **Inicio:** fines de julio de 2026.
- **Primer commit verificable:** 31 de julio de 2026.
- **Último commit observado:** 2 de agosto de 2026.
- **Marca:** CUIDALO es un nombre de trabajo. Alejandro todavía no decidió si será el nombre definitivo.

La existencia de una URL pública no debe confundirse con un lanzamiento comercial. El sitio está disponible para explorar y validar la propuesta, pero no recibe pagos ni genera pedidos reales.

## Definición breve

CUIDALO es un proyecto de marca orientado a soluciones simples para el hogar y la vida cotidiana. Su primer producto potencial es un localizador compacto para encontrar objetos mediante las redes colaborativas de iPhone y Android; a futuro, la marca podría ampliarse a otras soluciones conectadas.

## Producto inicial y necesidad

La documentación identifica el producto investigado como **OTAG F8 Dual**. La propuesta busca reducir la fricción y la incertidumbre alrededor de objetos que suelen perderse o quedar lejos: llaves, mochila, billetera, equipaje y, como ayuda complementaria, pertenencias asociadas a mascotas.

El planteo comercial evita presentar el dispositivo como un GPS satelital:

- utiliza una red colaborativa de celulares cercanos para actualizar la ubicación;
- no promete seguimiento continuo ni tiempo real;
- la búsqueda cercana y la actualización remota son comportamientos diferentes;
- en mascotas no reemplaza una chapita, un microchip ni un GPS específico;
- no requiere un abono mensual propio según la propuesta investigada.

La compatibilidad exacta, la batería, la resistencia y el contenido final del empaque deben confirmarse con una unidad física y documentación del proveedor antes de vender o publicar especificaciones definitivas.

## Punto de partida

El proyecto comenzó como una exploración de producto y oportunidad comercial en Argentina. La carpeta contiene un relevamiento minorista fechado el 31 de julio de 2026, análisis de competidores, bandas de precio, canales posibles, riesgos de comunicación y una propuesta de diferenciación basada en:

- explicación honesta del funcionamiento;
- instalación sencilla;
- accesorios adecuados a cada uso;
- soporte local;
- packs por cantidad y situación.

Ese relevamiento es investigación interna y una fotografía temporal del mercado. No constituye por sí mismo validación de demanda propia, asesoramiento legal ni confirmación de costos o márgenes reales.

## Rol de Alejandro y colaboración

Confirmado por Alejandro:

- participación en la construcción de la página;
- dirección del marketing y de la propuesta digital;
- desarrollo general del proyecto junto con un socio;
- coordinación futura con el trabajo de redes sociales del socio.

Alejandro confirmó que, por el momento, el socio participa únicamente en redes sociales. El resto del trabajo documentado corresponde al proceso liderado por Alejandro:

- investigación del mercado y de competidores;
- exploración de nombres y arquitectura de marca;
- posicionamiento, tono y mensajes;
- estructura de oferta y packs;
- UX y dirección visual del storefront;
- implementación frontend y backend asistida por IA;
- instrumentación del funnel;
- panel para seguimiento de interés y contactos;
- curaduría y transformación inicial de imágenes de producto.

Esta distribución corresponde al estado actual del proyecto y puede actualizarse si el alcance del socio cambia durante el lanzamiento.

## Experiencia pública verificada

El MVP implementa:

- presentación de marca y propuesta de valor;
- oferta de una, dos o tres unidades mediante los packs Cerca Esencial, Cerca Dúo y Cerca Familia;
- ahorro por cantidad y beneficios progresivos representados en la interfaz;
- selector de packs y actualización de precio por unidad;
- galería de producto y escenas de uso;
- explicación visible de que no es GPS en tiempo real;
- comparación frente a un localizador Bluetooth básico y un GPS con SIM;
- casos de uso para llaves, equipaje y mascotas;
- preguntas frecuentes y tratamiento de objeciones;
- carrito lateral accesible;
- captura de email e intención de compra;
- estados de carga, éxito y error al enviar el contacto;
- adaptación responsive y barra de compra móvil.

El carrito conserva una sola presentación elegida durante la sesión actual de la página. No se observó persistencia en `localStorage` ni una lógica de catálogo o inventario externo.

## Backend, medición y panel verificados

Aunque no existe checkout transaccional, el repositorio contiene una capa funcional de validación:

- base D1 configurada para eventos y contactos;
- sesiones anónimas mediante cookie;
- registro de vistas, clics, selección de pack, agregado al carrito y creación de contacto;
- captura de fuente, referrer, campaña UTM y dispositivo;
- formulario que guarda email, pack, cantidad, valor de referencia y fuente;
- deduplicación de envíos recientes y límite por sesión;
- validación de origen para escrituras;
- panel administrativo protegido;
- vistas de 7, 30 y 90 días;
- funnel de visitas, selecciones, carritos y contactos;
- análisis por pack y fuente;
- seguimiento de contactos como nuevo, contactado, convertido o descartado;
- exportación CSV;
- registro y limitación de intentos de acceso administrativo.

Los importes del panel deben interpretarse con precisión:

- **ingreso potencial** es la suma del valor declarado en contactos, no dinero cobrado;
- **ingreso convertido** depende de que un administrador marque manualmente un contacto como convertido;
- ninguno de los dos equivale a una transacción confirmada por una pasarela de pagos.

## Qué no está implementado

- pasarela de pagos;
- cobros;
- creación de pedidos comerciales;
- inventario o stock;
- catálogo administrable;
- cuentas de clientes;
- cálculo o contratación real de envíos;
- financiación o cuotas reales;
- emisión de comprobantes;
- automatización de fulfillment;
- envío de un resumen por email.

El formulario utiliza el texto “Recibí el resumen de tu compra”, pero la implementación observada guarda el contacto y devuelve una confirmación en pantalla; no integra un proveedor de email. Esta frase debe corregirse o implementarse antes de una validación pública más amplia.

## Arquitectura técnica verificada

### Aplicación

- React 19.2.
- API y estructura de aplicación compatibles con Next.js 16.
- Vinext 0.0.50 y Vite 8 para ejecución y build.
- TypeScript 5.9.
- CSS propio; Tailwind 4 está instalado, aunque no es necesario presentarlo como parte central del caso.

### Hosting y datos

- proyecto configurado para OpenAI Sites;
- integración con el runtime de Cloudflare;
- D1 vinculada como `DB`;
- Drizzle ORM y migraciones SQL para modelar analytics, contactos e intentos de acceso.

### Seguridad y administración

- credenciales administrativas mediante variables de entorno;
- contraseña almacenada como hash;
- cookie de sesión firmada;
- comparación segura de credenciales;
- protección de rutas y endpoints administrativos;
- límites de intentos y de creación de contactos.

La existencia de estas piezas está verificada en el repositorio, pero Alejandro todavía no probó el panel ni confirmó que base, credenciales y migraciones estén activas en el despliegue público. Por lo tanto, deben presentarse como infraestructura implementada en el prototipo, no como operación vigente.

## Marca y exploraciones visuales

La carpeta contiene:

- estrategia inicial de marca;
- posicionamiento “Tecnología simple para cuidar lo que importa”;
- promesa “Lo importante, siempre cerca”;
- voz cercana, práctica y no basada en miedo;
- paleta azul petróleo, coral, menta, marfil y grafito;
- tres exploraciones de logo;
- una variante de nombre CAVUNI implementada como preview dentro del proyecto.

Alejandro confirmó como símbolo vigente —todavía provisional— el concepto de dos formas que acompañan un punto central. Los archivos de exploración declaran expresamente que no son logos finales ni archivos vectoriales.

La pre-evaluación interna de nombres ubica a CUIDALO en **riesgo marcario preliminar medio** y propone estudiar alternativas inventadas. No es un dictamen jurídico ni una concesión del INPI. Hasta que exista una decisión formal, el portfolio debe tratar el nombre y el logo como dirección de trabajo.

## Imágenes, fuentes y derechos

Se identificaron:

- imágenes originales del fabricante Bmovor;
- material de una publicación de Atlantic Trade;
- referencias de Made-in-China;
- versiones limpiadas, reencuadradas y adaptadas para el MVP;
- imágenes separadas como “no publicar” cuando el texto del producto fue alterado o el empaque no estaba confirmado;
- un catálogo CSV que registra fuente, transformación, estado y observaciones.

Alejandro confirmó que cuenta con permiso para utilizar comercialmente las imágenes y especificaciones aportadas por el proveedor. Debe conservarse evidencia de esa autorización y distinguir el material fuente de las transformaciones realizadas para el proyecto. También deben respetarse las reglas de uso de los distintivos Apple Find My y Google Find Hub.

## Decisiones demostrables

### 1. Diseñar una marca extensible, no atada a un solo dispositivo

La propuesta parte de un localizador, pero el territorio de marca se definió alrededor de tranquilidad y soluciones cotidianas para permitir una expansión futura hacia el hogar.

### 2. Educar antes de vender

La página dedica una parte central a explicar por qué el producto no es GPS en tiempo real. La transparencia reduce expectativas incorrectas y es más valiosa que exagerar una especificación.

### 3. Convertir un producto genérico en una oferta por necesidad y cantidad

Los packs y casos de uso ayudan a comunicar valor sin fingir que cada aplicación corresponde a un dispositivo diferente.

### 4. Validar intención sin simular una compra terminada

El recorrido llega hasta el carrito y luego captura un contacto. Esto permite estudiar el interés por pack antes de invertir en una infraestructura transaccional completa.

### 5. Instrumentar el MVP desde el comienzo

La solución registra el funnel y permite administrar contactos, fuentes y estados, por lo que la validación futura puede apoyarse en comportamiento observado y no solo en opiniones.

### 6. Documentar riesgos de marca, producto y contenido

El proceso conserva antecedentes de nombres, límites de claims, fuentes de imágenes y piezas que no deben publicarse. Esa trazabilidad es parte relevante del trabajo.

## Estado actual y límites

Confirmado:

- proyecto propio en colaboración;
- propiedad compartida y autorización para mostrar el trabajo;
- participación actual del socio limitada a redes sociales;
- inicio a fines de julio de 2026;
- URL pública de prueba;
- identidad y oferta en exploración;
- símbolo visual provisional confirmado;
- storefront y carrito funcionales como interfaz;
- captura de intención, analytics y administración implementados en el repositorio;
- permiso de uso comercial de imágenes y especificaciones del proveedor confirmado por Alejandro;
- presentación a potenciales compradores y recepción cualitativa favorable;
- ausencia de lanzamiento comercial, pagos y pedidos reales.

No confirmado todavía:

- funcionamiento del producto mediante una unidad física, porque todavía no se compró ni probó una muestra;
- especificaciones definitivas y documentación del proveedor;
- activación real de D1, migraciones y panel en el despliegue público;
- nombre y logo definitivos.

## Resultados y aprendizaje

No existen ventas ni resultados cuantitativos publicables porque el proyecto no tuvo lanzamiento comercial.

Alejandro mostró la propuesta a potenciales compradores y recibió una respuesta favorable. Esto puede presentarse como validación cualitativa inicial, sin afirmar todavía demanda comprobada, intención de pago ni una tasa de aceptación. Si el dato se utilizara como evidencia destacada, convendría documentar posteriormente cuántas personas participaron, qué perfil tenían, qué se les mostró y qué observaciones realizaron.

El resultado demostrable es la transformación de una oportunidad de producto en una propuesta de marca, una oferta estructurada y un MVP medible. Cualquier aprendizaje sobre preferencia de packs, conversión o adquisición debe publicarse únicamente después de una prueba definida y con datos válidos.

## Ángulo narrativo recomendado

**De una oportunidad de producto a un MVP de marca medible, antes de invertir en la operación completa.**

CUIDALO puede demostrar investigación, posicionamiento, educación de producto, diseño comercial, construcción full-stack ligera e instrumentación. Su valor no depende de presentarlo como negocio lanzado.

## Pendientes mínimos

1. Comprar o conseguir una muestra física y validar funcionamiento, compatibilidad, batería, contenido y especificaciones antes del lanzamiento.
2. Conservar la evidencia del permiso comercial sobre imágenes y especificaciones del proveedor.
3. Decidir si el caso conservará el nombre CUIDALO como nombre de trabajo aunque la marca cambie después.
4. Verificar que D1, migraciones, credenciales y panel funcionan en el despliegue público.
5. Documentar con mayor precisión la validación cualitativa solo si se quiere utilizar como evidencia destacada.
6. Elegir 6–10 pantallas y assets que puedan mostrarse sin revelar emails ni credenciales.
