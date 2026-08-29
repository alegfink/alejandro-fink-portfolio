# Salto Cuántico — ficha factual consolidada

**Estado del documento:** base confirmada para redactar un caso compacto.  
**Última actualización:** 8 de agosto de 2026.

Este archivo reúne la explicación de Alejandro, la documentación estratégica y la implementación disponible en `C:\Users\Ale\Desktop\Anton`.

## Identidad y estado

- **Nombre:** Salto Cuántico.
- **Creador y responsable del programa:** Anton Aliwen y su equipo.
- **URL del prototipo de Alejandro:** https://salto-cuantico-anton.alegfink.chatgpt.site/
- **Relación:** Alejandro trabajó anteriormente como closer de ventas para Anton cuando el programa ya se comercializaba.
- **Origen del proyecto:** propuesta proactiva de Alejandro para mejorar una página que consideraba demasiado básica para representar el valor real del servicio.
- **Presentación:** la propuesta fue presentada a un socio de Anton.
- **Estado del programa:** activo y funcionando con su infraestructura existente.
- **Estado de la nueva página:** prototipo funcional y propuesta de evolución futura; no es la página operativa del programa.
- **Recepción:** la propuesta gustó claramente al socio de Anton y permanece en evaluación.
- **Autorización:** Alejandro cuenta con permiso para mostrar el nombre, la propuesta, las pantallas, la imagen, los testimonios y el proceso en su portfolio.

## Cronología verificable

- **30 de julio de 2026:** fecha del estudio de mercado, auditoría y oportunidad digital.
- **31 de julio de 2026:** construcción del prototipo y sus iteraciones verificables en el repositorio.
- **Principios de agosto de 2026:** presentación de la propuesta al socio de Anton.

## Definición breve

Salto Cuántico es un programa existente de transformación personal guiada creado por Anton Aliwen. El trabajo de Alejandro es una propuesta estratégica y un prototipo de experiencia digital para explicar mejor el método, conectar la adquisición con el producto real y preparar una evolución futura hacia un ecosistema propio.

## Contexto y oportunidad

Alejandro conocía el servicio y su proceso comercial por haber trabajado como closer. Desde esa posición detectó una brecha entre:

- la riqueza del programa, el acompañamiento y la comunidad;
- la forma simplificada en que la web existente los presentaba antes de la venta.

La auditoría planteó que el problema no era únicamente visual. La experiencia pública no explicaba de manera suficiente el método, las fases, la semana tipo, el equipo, la comunidad ni el alcance. La propuesta buscó hacer visible ese valor antes de pedir una aplicación o una llamada.

## Fuentes utilizadas

Alejandro confirmó que la investigación se realizó con fuentes públicas y disponibles en producción, sin depender de información privada del programa. Entre las fuentes documentadas aparecen:

- sitio público de Anton;
- landing pública Mapa del Alma;
- Instagram;
- YouTube;
- formularios Typeform existentes;
- información visible de la comunidad y el programa;
- referencias de mercado y productos comparables.

Los números observados durante la auditoría —seguidores, miembros, publicaciones o participantes— son fotografías temporales del 30 de julio de 2026. No deben trasladarse automáticamente al portfolio ni presentarse como resultados del trabajo de Alejandro.

## Rol de Alejandro

El caso permite atribuir a Alejandro:

- detección de la oportunidad a partir de su experiencia comercial previa;
- auditoría de la presencia digital y del funnel existente;
- investigación del mercado y referencias competitivas;
- definición del problema y de la propuesta de evolución;
- arquitectura del nuevo funnel;
- estrategia de dos páginas coordinadas;
- estructura de contenido y tratamiento de objeciones;
- copy y tono general del prototipo;
- UX y dirección visual;
- diseño de la experiencia responsive;
- implementación del prototipo asistida por IA;
- integración visual de Typeform;
- transferencia de parámetros de campaña;
- diseño de eventos genéricos de funnel;
- publicación y presentación de la propuesta.

Anton y su equipo son responsables del programa, el método, los formularios, los testimonios, la imagen pública y los contenidos de origen. El prototipo no convierte esos activos en autoría de Alejandro.

## Propuesta estratégica

La documentación plantea una evolución por etapas:

1. nueva experiencia de adquisición mediante una landing principal y Mapa del Alma;
2. optimización de formulario, agenda, CRM y medición;
3. portal propio para participantes, manteniendo inicialmente la comunidad existente;
4. posible comunidad propia cuando el producto y la operación lo justifiquen;
5. ecosistema posterior de programas, retiros y continuidad.

Solo la primera etapa fue explorada mediante páginas funcionales. El portal, la comunidad propia y las integraciones operativas son visión de producto, no funcionalidades construidas.

## Experiencia implementada

### Landing principal

- Hero orientado a una persona que funciona por fuera pero se siente desconectada por dentro.
- Problemas y patrones de comportamiento organizados visualmente.
- Método propuesto en tres fases: Sombra, Propósito y Expansión.
- Representación de una semana tipo.
- Prácticas de meditación, escritura activa y presencia.
- Integración narrativa de música y escucha.
- Presentación de Anton y espacios reservados para el equipo.
- Mockup conceptual de una futura plataforma.
- Extractos de testimonios previamente publicados.
- Segmentación “para quién es / para quién no”.
- Preguntas frecuentes que indican explícitamente qué datos siguen sin validar.
- Typeform de evaluación embebido.
- Avisos sobre límites clínicos y claims no confirmados.

### Mapa del Alma

- Página independiente coordinada con el mismo sistema visual.
- Introducción breve al ejercicio.
- Categorías presentadas como hipótesis de diseño, no diagnósticos clínicos.
- Typeform embebido.
- Práctica de reflexión previa.
- Video de Anton cargado bajo interacción.
- Puente de regreso hacia la explicación completa de Salto Cuántico.

## Typeform, UTMs y analytics

Alejandro confirmó que el Typeform fue replicado a partir de un formulario que ya existe en producción.

La implementación:

- incrusta dos identificadores de Typeform;
- carga el script solo cuando el formulario se aproxima al viewport;
- transfiere `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid` y `gclid`;
- escucha inicio y envío del formulario;
- genera eventos genéricos como `landing_view`, `diagnostic_start`, `diagnostic_complete`, `application_start` y `application_complete`;
- no incorpora respuestas, diagnósticos, medicación ni texto sensible en esos eventos.

Los eventos se agregan a `dataLayer` y se emiten como eventos del navegador, pero el prototipo no configura por sí mismo un proveedor de analytics, CRM o base de datos. La transferencia de UTMs está implementada del lado de la página; su almacenamiento definitivo depende de la configuración del formulario.

## Qué no está implementado

- portal real de participantes;
- cuentas, perfiles o progreso;
- comunidad propia;
- base de datos;
- CRM;
- calendario o agenda conectada;
- reserva de llamadas;
- tracking confirmado hasta venta;
- panel administrativo;
- resultados personalizados nativos del Mapa del Alma;
- políticas legales definitivas;
- gestión propia de los datos enviados al Typeform.

La pantalla de plataforma está rotulada como vista conceptual. El porcentaje de progreso, la fase actual, el calendario, la bitácora y las publicaciones son recursos de diseño para comunicar una dirección futura.

## Contenido y claims

La implementación evita afirmar como hechos:

- duración exacta;
- inversión y planes de pago;
- fecha de la próxima cohorte;
- alcance del acompañamiento individual;
- nombres y credenciales del equipo;
- garantía;
- resultados en un plazo fijo;
- claims médicos.

Los testimonios se presentan con advertencias sobre contexto y resultados individuales. Alejandro confirmó permiso para mostrarlos, pero el portfolio debe evitar reutilizarlos como prueba del trabajo de diseño o como resultados producidos por el prototipo.

## Arquitectura técnica verificada

### Aplicación

- React 19.2.
- estructura y APIs compatibles con Next.js 16.
- Vinext 0.0.50 y Vite 8.
- TypeScript 5.9.
- CSS propio y diseño responsive.
- fuentes Manrope y Newsreader.

### Hosting

- proyecto configurado para OpenAI Sites;
- runtime compatible con Cloudflare;
- sin D1 ni R2 vinculados.

### Experiencia y calidad

- rutas `/` y `/mapa-del-alma`;
- metadata, Open Graph, sitemap y robots;
- datos estructurados de servicio, organización y FAQs;
- navegación por teclado y skip link;
- foco visible y soporte de reduced motion;
- video con portada y carga bajo interacción;
- formularios cargados de manera diferida;
- pruebas automatizadas de renderizado y salvaguardas de contenido.

## Decisiones demostrables

### 1. Convertir experiencia comercial en criterio de producto

Alejandro no auditó el funnel únicamente desde afuera: conocía las conversaciones de venta y pudo reconocer qué información faltaba antes de la llamada.

### 2. Mostrar el producto real antes de pedir una aplicación

La propuesta expone método, semana, prácticas, equipo y experiencia antes del formulario, en lugar de depender solamente de una promesa y un video.

### 3. Diseñar dos recorridos según temperatura del tráfico

La landing principal atiende a personas con mayor contexto. Mapa del Alma funciona como entrada breve para tráfico frío y conecta el diagnóstico con el programa.

### 4. Mantener Typeform para validar antes de reemplazarlo

La primera etapa reutiliza una herramienta existente y reserva un diagnóstico nativo para una fase posterior, cuando el funnel y la segmentación estén probados.

### 5. Separar realidad actual y visión de plataforma

La futura experiencia de participantes se comunica mediante un mockup rotulado como conceptual. No se presenta como software operativo.

### 6. Reducir riesgos en una categoría sensible

El prototipo evita promesas médicas, resultados garantizados y categorías clínicas no aprobadas. También separa los eventos de medición de las respuestas potencialmente sensibles.

## Resultado

La propuesta fue completada y presentada a un socio de Anton a principios de agosto de 2026. La recepción fue favorable y Alejandro obtuvo autorización para mostrarla. Todavía está en evaluación y no fue adoptada como experiencia operativa.

Alejandro decidió incorporar el caso al portfolio en su estado actual y actualizar su clasificación si la propuesta avanza. El caso debe incluir fecha y estado visibles para que su evolución futura no reescriba retrospectivamente lo que estaba confirmado en esta versión.

No existen métricas de conversión atribuibles al prototipo. La actividad, audiencia y comunidad del programa ya existían antes de este trabajo y deben utilizarse únicamente como contexto.

## Ángulo narrativo recomendado

**De conversaciones de venta a una propuesta de producto digital más clara.**

El caso demuestra cómo Alejandro utilizó conocimiento comercial de primera mano para auditar un funnel, reorganizar una oferta compleja y convertir una oportunidad detectada en una propuesta estratégica y un prototipo funcional.

## Estado visible recomendado

`Propuesta estratégica · Prototipo funcional`

## Pendientes mínimos

1. Actualizar el estado del caso si la propuesta es adoptada, pilotada o implementada más adelante.
2. Decidir si los Typeforms reales deben permanecer activos dentro del prototipo público.
3. Elegir screenshots que distingan claramente la landing implementada de la plataforma conceptual.
4. No invitar a completar los formularios desde el portfolio mientras privacidad, responsable de datos y destino de las respuestas no estén documentados.
