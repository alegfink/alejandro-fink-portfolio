# Migración del portfolio V2 a producción

Fecha del candidato: 2026-08-28

## Objetivo

- Publicar la experiencia actual en `https://www.alejandrofink.com/`.
- Mantener la versión anterior disponible únicamente por acceso manual en `/v1`.
- Conservar español e inglés con URLs canónicas limpias.
- Evitar que buscadores indexen el archivo o las rutas temporales.

## Mapa de rutas

| Experiencia | Español | Inglés |
| --- | --- | --- |
| Inicio | `/` | `/en` |
| Proyectos | `/proyectos` | `/en/projects` |
| Acerca de | `/acerca-de` | `/en/about` |
| Privacidad | `/privacidad` | `/en/privacy` |
| Archivo V1 | `/v1` | No publicado como ruta independiente |

Las rutas temporales `/v2/...` redirigen permanentemente hacia sus equivalentes canónicos. El archivo `/v1`, las rutas legacy `/es...` y las rutas temporales quedan fuera del sitemap y bloqueadas en `robots.txt`.

## Respaldo y trazabilidad

- El repositorio remoto existente conserva la publicación anterior en `origin/main` (`0e66f1940756e11eec7b429be0e3b5dd9d517a22`).
- La nueva versión se prepara en una rama independiente antes de modificar `main`.
- `public/og-v1.png` conserva la tarjeta social anterior.
- `/v1` presenta la experiencia legacy sin enlazarla desde la navegación nueva.

## Verificaciones del candidato

- `npm run check`: lint sin errores, typecheck correcto, 37 pruebas aprobadas y build Vinext correcto.
- `npm audit --omit=dev`: 0 vulnerabilidades conocidas.
- QA visual en 320×568, 360×740, 440×956 y 1440×900.
- Sin desborde horizontal, imágenes rotas ni errores de consola en las rutas canónicas.
- Social preview 1200×630, favicon SVG, canonical, alternates, Open Graph y Twitter Card presentes.
- Sitemap limitado a las ocho rutas canónicas.

## Secuencia de publicación pendiente de autorización

1. Subir la rama candidata al remoto sin reemplazar todavía `main`.
2. Crear una Preview de Sites y repetir smoke tests en esa URL.
3. Verificar manualmente portada, proyectos, acerca de, privacidad, selector de idioma, Gmail y `/v1`.
4. Aprobar el cambio de producción.
5. Publicar la versión candidata y conectar `www.alejandrofink.com` al nuevo proyecto.
6. Verificar HTTPS, redirecciones, `robots.txt`, `sitemap.xml`, social preview y favicon sobre el dominio real.
7. Mantener el commit V1 como rollback inmediato durante la observación inicial.

## Rollback

Si falla una verificación crítica después de publicar, restaurar temporalmente la publicación asociada a `origin/main` en el commit V1 indicado arriba, sin borrar la rama V2. Luego corregir el candidato y repetir Preview + smoke tests antes de un nuevo intento.
