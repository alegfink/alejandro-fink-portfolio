# Brief de implementación v1

**Proyecto:** portfolio profesional bilingüe de Alejandro Fink  
**Estado:** aprobado para desarrollo local  
**Lanzamiento:** pendiente de configuración operativa y revisión final

## 1. Resultado

Construir un portfolio premium, claro y orientado a negocio que convierta visitas en conversaciones calificadas y demuestre que Alejandro puede entender una necesidad comercial, diseñar una experiencia y construir una solución web funcional.

La Home se dirige primero a dueños, founders y responsables de negocio. Agencias, consultoras, recruiters y equipos remotos deben poder reconocer una modalidad de colaboración compatible sin competir con el mensaje principal.

## 2. Identidad y mensaje de trabajo

- **Nombre público:** Alejandro Fink.
- **Descriptor ES:** Desarrollador web y creador de productos digitales.
- **Descriptor EN:** Web Developer & Digital Product Builder.
- **Hero ES:** Diseño y desarrollo sitios web y productos digitales que resuelven problemas reales de negocio.
- **Hero EN:** I design and build websites and digital products that solve real business problems.
- **Apoyo:** desarrollo, UX y criterio comercial para convertir ideas, operaciones y oportunidades en soluciones web funcionales.
- **CTA principal:** `Contame tu proyecto` / `Tell me about your project`.
- **CTA secundario:** `Ver proyectos` / `View my work`.

Los descriptores son contenido editable, no parte rígida de la arquitectura. No mostrar ciudad, email, tiempo de respuesta, WhatsApp, LinkedIn ni disponibilidad detallada mientras no estén confirmados.

## 3. Alcance v1

### Rutas

```text
/
/es/
/es/proyectos/
/es/proyectos/[slug]/
/es/sobre-mi/
/es/contacto/
/es/privacidad/
/en/
/en/work/
/en/work/[slug]/
/en/about/
/en/contact/
/en/privacy/
```

La raíz detecta el idioma del navegador en la primera visita. La selección manual `ES / EN` prevalece, se recuerda y conserva la página equivalente cuando exista.

### Páginas

- Home ES/EN con Hero, casos destacados, oferta, proceso, trabajo adicional, perfil breve y CTA final.
- Índice de los seis proyectos.
- Seis páginas individuales con profundidad proporcional a la evidencia.
- About breve y orientado a la forma de pensar y trabajar.
- Contact con interfaz preparada para formulario y fallback.
- Privacy basada únicamente en el flujo realmente configurado.
- 404 localizada.

### Fuera de alcance

- blog, CMS, base de datos, autenticación o área de miembros;
- agenda, pagos o CRM;
- listado protagonista de tecnologías;
- GitHub en la navegación;
- foto personal como dependencia del layout;
- dark mode como identidad por defecto;
- animación compleja o decorativa;
- despliegue a producción en esta etapa.

## 4. Portfolio de proyectos

| Orden | Proyecto | Tratamiento | Estado público |
|---:|---|---|---|
| 1 | Torvena | Caso completo y ancla | Negocio propio · En producción |
| 2 | Brisa do Mar | Caso completo | Solución web · Operativa |
| 3 | CUIDALO | Caso completo contenido | MVP de validación · Sin lanzamiento comercial |
| 4 | Salto Cuántico | Caso compacto | Propuesta estratégica · Prototipo funcional |
| 5 | Luca DS Coaching | Caso compacto | Proyecto en desarrollo · Lanzamiento próximo |
| 6 | Lourdes Mirada | Caso compacto | Portfolio aprobado · Activación pendiente |

Las fichas de `docs/projects/` son la única fuente factual. Si un dato no aparece confirmado allí, se omite o se presenta como límite; nunca se completa por inferencia de marketing.

## 5. Dirección de arte

Usar **Editorial Product** como sistema principal e incorporar de **Precision Interface** metadata, estados, anotaciones y diagramas solo cuando ayuden a comprender.

- Base clara y cálida, tinta casi negra y azul cobalto como color de acción.
- Una sans contemporánea de alta legibilidad y una serif editorial de uso controlado; mono solo para metadata.
- Jerarquía editorial, grilla consistente y proyectos tratados como aperturas distintas, no como una cuadrícula de cards equivalentes.
- Torvena domina la secuencia de Home; Brisa y CUIDALO tienen composiciones diferenciadas.
- Cada caso puede adoptar un acento propio dentro del sistema compartido.
- Screenshots grandes y legibles, poco browser chrome y anotaciones puntuales.
- Motion breve y funcional, con experiencia completa bajo `prefers-reduced-motion`.
- El sitio debe funcionar sin retrato personal.

Los tokens exactos se eligen durante la implementación y se documentan en CSS. Priorizar tipografías con licencias aptas para web y estrategia de carga eficiente.

## 6. Base técnica

- Next.js con App Router y TypeScript.
- Renderizado static-first; usar servidor solo donde una función real lo requiera.
- Contenido local tipado, separado de componentes y organizado por locale/proyecto.
- CSS propio mediante tokens; evitar agregar un sistema de UI grande sin necesidad.
- Imágenes optimizadas por viewport y video sin autoplay.
- Dependencias mínimas y sin estado global si no existe una necesidad demostrada.
- Código y contenido dentro de este workspace; las carpetas fuente externas son de solo lectura.

No fijar una plataforma de hosting desde la arquitectura. La aplicación debe producir un build reproducible y conservar una capa pequeña de adaptación para contacto y analytics.

## 7. Contenido e i18n

Mantener una entidad canónica por proyecto con campos compartidos y campos localizados. Validar el esquema para impedir slugs duplicados, estados inválidos o ausencia de traducción en campos obligatorios.

El español y el inglés deben sonar naturales. No mezclar strings, traducir literalmente modismos ni permitir que una versión haga claims más fuertes que la otra. Fechas, metadata, alt text, errores, estados y CTAs también se localizan.

Cada página requiere title, description, canonical, alternates `es`, `en` y `x-default` cuando corresponda, Open Graph, enlaces internos del mismo locale, sitemap y robots coherentes con el entorno.

## 8. Fuentes y assets

### Fuentes canónicas

- Torvena: `docs/projects/torvena-facts.md` y su sitio público.
- Brisa do Mar: `docs/projects/brisa-do-mar-facts.md` y su sitio público.
- CUIDALO: `docs/projects/cuidalo-facts.md` y `C:\Users\Ale\Desktop\Localizate`.
- Salto Cuántico: `docs/projects/salto-cuantico-facts.md` y `C:\Users\Ale\Desktop\Anton`.
- Luca DS: `docs/projects/luca-ds-facts.md` y `C:\Users\Ale\Desktop\Luca-programa`.
- Lourdes Mirada: `docs/projects/lourdes-mirada-facts.md` y `C:\Users\Ale\Desktop\Luutienda`.

Seleccionar material autorizado, evitar datos personales o credenciales y copiar al portfolio solo los derivados necesarios. No modificar proyectos externos. Usar placeholders editoriales identificables únicamente mientras se producen las capturas; no inventar interfaces, métricas o testimonios.

## 9. Contacto, privacidad y analytics

Construir la interfaz, validación cliente/servidor, estados accesibles y contrato de integración del formulario. Hasta que existan email y proveedor reales:

- no enviar ni almacenar mensajes;
- no mostrar una confirmación falsa;
- no inventar un email de fallback;
- mantener la integración desactivada mediante configuración explícita;
- impedir que un despliegue final se considere listo sin configurar y probar el flujo.

Definir un mapa pequeño y estable de eventos —cambio de idioma, apertura de proyecto, CTA de contacto, intento/éxito/error de envío y links externos— sin instalar un proveedor ni registrar datos personales por defecto.

La política de privacidad debe describir herramientas y datos reales. No completar una política genérica antes de elegir el flujo.

## 10. Criterios de aceptación

- Todas las rutas ES/EN funcionan y el selector conserva equivalencias.
- Home, índice, seis proyectos, About, Contact, Privacy y 404 están implementados.
- Los estados y límites de cada proyecto son visibles y fieles a las fichas.
- No existen métricas, testimonios, clientes, precios, tecnologías o resultados inventados.
- La navegación y los formularios son utilizables con teclado y tienen foco visible.
- El sitio respeta reduced motion, contraste y estructura semántica.
- No hay overflow horizontal en mobile y la evidencia no desaparece en pantallas pequeñas.
- Metadata, canonical, alternates, sitemap y robots se generan correctamente.
- Lint, typecheck, pruebas relevantes y build terminan sin errores.
- El README documenta instalación, scripts, estructura, variables y pendientes de lanzamiento.
- El cierre de la tarea incluye una revisión visual de Home, un caso completo y un caso compacto en desktop y mobile.

## 11. Entrega esperada

Una v1 completa y ejecutable en local, con contenido factual, dirección visual coherente, assets autorizados disponibles, documentación de setup y una lista corta de bloqueadores de lanzamiento. No desplegar ni crear cuentas externas sin una instrucción posterior.
