# Públicos, recorridos y conversión

## Principio

La página debe permitir que distintas audiencias se reconozcan, pero no puede tener varios mensajes principales. El recorrido prioritario es el de una persona con un problema u oportunidad de negocio que evalúa si Alejandro puede entenderlo y construir la solución.

## Públicos priorizados

### 1. Dueños y responsables de negocios

Incluye pymes, e-commerce, servicios profesionales y emprendimientos con una oferta real.

**Necesitan:** lanzar o mejorar una presencia digital, vender, explicar una oferta, ordenar una operación o agregar funcionalidad.

**Preguntas que traen:**

- ¿Va a entender mi negocio sin que yo tenga que especificar toda la solución?
- ¿Puede ocuparse de algo más que el diseño?
- ¿Qué nivel de inversión, tiempo y participación requiere?
- ¿Hay ejemplos parecidos al problema que tengo?

**Prueba:** Torvena, Brisa do Mar, proceso orientado a descubrimiento y casos explicados en lenguaje de negocio.

### 2. Founders y equipos que necesitan validar o extender un producto

**Necesitan:** MVP, prototipo funcional, landing de validación, panel, integración o evolución rápida.

**Preguntas:**

- ¿Puede reducir una idea amplia a una primera versión útil?
- ¿Puede trabajar con incertidumbre y cambiar de dirección?
- ¿Distingue prototipo, MVP y producto en producción?

**Prueba:** CUIDALO, Brisa do Mar y decisiones de alcance explícitas.

### 3. Agencias y consultoras

**Necesitan:** capacidad de entrega confiable, criterio propio, buena comunicación y adaptación a procesos existentes.

**Preguntas:**

- ¿Puede trabajar bajo marca blanca o con un equipo distribuido?
- ¿Documenta, comunica riesgos y respeta alcance?
- ¿Puede tomar una parte completa del proyecto?

**Prueba:** proceso, documentación, variedad de proyectos y una mención discreta a colaboraciones.

### 4. Recruiters y equipos remotos

**Necesitan:** comprender alcance, autonomía, comunicación, stack y disponibilidad.

**Prueba:** About, casos, LinkedIn actualizado y una descarga de CV solo si se decide mantenerla.

No se crea una Home separada para recruiters en v1.

## Objetivo primario de conversión

**Recibir una consulta calificada sobre un proyecto, colaboración freelance o contrato.**

Conversión principal:

- envío exitoso del formulario de contacto.

El formulario debe sentirse como el comienzo de una conversación, no como una solicitud de presupuesto rígida.

### Campos recomendados

- Nombre.
- Email.
- Empresa o proyecto, opcional.
- Qué necesitás: sitio, e-commerce, MVP/producto, mejora/evolución, colaboración de agencia, otro.
- Qué querés lograr o resolver.
- Plazo aproximado, opcional.
- Presupuesto orientativo, opcional y solo si se definen rangos útiles.

No pedir teléfono en el primer contacto salvo que sea necesario para el canal elegido.

## Objetivos secundarios

1. Abrir un caso destacado.
2. Recorrer al menos dos proyectos.
3. Visitar un proyecto en vivo.
4. Iniciar contacto por email.
5. Visitar LinkedIn desde About o Footer.
6. Cambiar de idioma cuando la versión inicial no sea la preferida.

WhatsApp y calendario no son conversiones principales en la baseline.

## Arquitectura de CTAs

### CTA principal

- ES: `Contame tu proyecto`.
- EN: `Tell me about your project`.

### CTA secundario

- ES: `Ver proyectos`.
- EN: `View selected work`.

### CTAs contextuales

- `Ver caso` / `View case study`.
- `Visitar proyecto` / `Visit live project`.
- `Colaboremos` para agencias, dentro de la sección o el formulario, no en el Hero.

Evitar alternar sin criterio entre “Hablemos”, “Contactame”, “Empezar”, “Agendar” y “Solicitar presupuesto”. Un sistema verbal consistente reduce fricción.

## Recorrido principal

1. **Orientación:** Hero explica qué construye, para quién y con qué enfoque.
2. **Prueba:** casos destacados demuestran capacidad real.
3. **Encaje:** servicios y proceso ayudan a reconocer el tipo de necesidad.
4. **Confianza:** About aporta historia relevante y perspectiva de operador.
5. **Acción:** CTA final abre un formulario breve con expectativas claras.

## Manejo de canales

### Formulario

Canal principal. Debe confirmar recepción, tiempo estimado de respuesta y alternativa por email si falla.

### Email

Alternativa visible para quien prefiere escribir desde su cliente de correo.

### WhatsApp

Puede ser útil para Argentina y relaciones cálidas, pero un botón flotante global dividiría el funnel y puede volver la experiencia más informal. Incluirlo solo después de confirmar un número profesional, disponibilidad y reglas de uso. Si se adopta, ubicarlo en Contact y no necesariamente en toda la web.

### Calendario

No se recomienda en v1. Agregarlo cuando exista disponibilidad estable y volumen suficiente para justificar llamadas directas sin calificación previa.

### LinkedIn

Canal de validación profesional y contacto alternativo. No reemplaza el CTA principal.

## Señales de confianza sin métricas inventadas

- estados reales de proyecto;
- screenshots y videos propios;
- roles y responsabilidades concretas;
- decisiones explicadas;
- enlaces públicos cuando corresponda;
- limitaciones y próximos pasos visibles;
- experiencia operando Torvena;
- disponibilidad, zona horaria e idiomas confirmados.

## Medición inicial

Eventos propuestos, a revisar al elegir analytics:

| Evento | Objetivo |
|---|---|
| `contact_form_started` | Detectar intención y abandono. |
| `contact_form_submitted` | Conversión primaria. |
| `contact_email_clicked` | Contacto alternativo. |
| `case_study_viewed` | Interés en evidencia. |
| `live_project_clicked` | Profundidad de evaluación. |
| `language_switched` | Adecuación lingüística. |
| `linkedin_clicked` | Validación profesional. |

No recopilar texto libre del formulario ni datos personales en analytics.

