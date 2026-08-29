# Portfolio V2 — Brief del laboratorio de Heroes

## Objetivo

Construir una página paralela para explorar cinco direcciones de Hero antes de definir el frontend completo del Portfolio V2. La web publicada permanece sin cambios.

## Fuente visual

- Archivo Figma: `Portfolio V2 — Referencias visuales`
- File key: `UhnRMPpP5F1MQImLy0uZeC`
- Nodo principal: `5:15` (`Heroes`)
- Referencias documentadas: Rick Allan, Chk Stepan, Juan Mora y Mauricio Juba.

Las referencias se usan para extraer principios de composición e interacción, no para clonar las páginas.

## Cinco direcciones

1. **Impacto cinematográfico** — tipografía dominante, capas de proyectos y respuesta del cursor.
2. **Campo reactivo** — líneas procedurales animadas y deformación local alrededor del cursor.
3. **Nombre vivo** — el nombre de Alejandro funciona como ventana hacia distintos proyectos.
4. **Del píxel al sistema** — contraste entre información fragmentada y claridad revelada.
5. **Radar de decisiones** — síntesis original enfocada en oportunidades y beneficios del cliente.

## Guardrails

- No modificar las rutas actuales ni desplegar a Producción.
- Implementar el laboratorio en `/v2/heroes` y marcarlo `noindex`.
- Reutilizar información y assets reales del portfolio.
- No inventar métricas, resultados, testimonios, clientes ni tecnologías.
- No solicitar cámara, micrófono ni audio en esta etapa.
- Mantener texto semántico por encima de los efectos decorativos.
- Respetar `prefers-reduced-motion` y ofrecer una composición legible en móvil.
- Detener animaciones continuas cuando la variante no está activa o la pestaña no está visible.
- No incorporar GSAP o Lenis hasta seleccionar una dirección o demostrar que aportan una mejora concreta.

## Prompt operativo para Codex

```text
Trabajá sobre este workspace para crear el laboratorio inicial del Portfolio V2 sin modificar la experiencia publicada.

Usá como fuente visual el archivo de Figma “Portfolio V2 — Referencias visuales”, file key UhnRMPpP5F1MQImLy0uZeC, nodo 5:15. Interpretá las referencias y las notas como dirección de arte; no copies literalmente las páginas externas.

Construí una ruta aislada y no indexable en /v2/heroes con cinco propuestas de Hero comparables desde un selector accesible: impacto cinematográfico, campo reactivo, nombre vivo, píxel a sistema y radar de decisiones. Usá la información real del portfolio y los assets locales existentes. No inventes resultados ni métricas.

El campo reactivo debe generarse en vivo con Canvas, reaccionar al cursor y detenerse cuando no esté visible. Todas las variantes deben funcionar con teclado, móvil y prefers-reduced-motion. No actives cámara, micrófono o audio. No agregues GSAP o Lenis hasta que una dirección haya sido elegida y exista un uso concreto.

Ejecutá lint, typecheck, pruebas y build. Revisá visualmente la ruta en desktop y móvil. No publiques ni cambies dominios, variables o Producción.
```

## Criterios de aceptación de esta etapa

- Las cinco propuestas se pueden comparar dentro de una sola ruta.
- Cada propuesta expresa una dirección visual distinta y usa el posicionamiento real de Alejandro.
- El concepto reactivo responde al cursor sin usar video.
- La ruta actual del portfolio continúa sin cambios.
- Lint, tipos, pruebas y build finalizan correctamente.
- La selección de una dirección queda como decisión posterior del usuario.
