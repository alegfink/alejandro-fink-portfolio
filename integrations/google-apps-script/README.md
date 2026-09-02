# Receptor del formulario con Google Apps Script

Esta integración recibe el diagnóstico comercial validado de `POST /api/contact`, guarda sus 27 campos operativos en la hoja privada **Portfolio — Consultas de contacto** y envía un resumen accionable a `alegfink@gmail.com` con `replyTo` configurado al email de la persona.

## Recursos

- Hoja privada: configurada fuera del repositorio. Su URL y su identificador no se versionan.
- Código: `Code.gs`
- Manifiesto: `appsscript.json`

## Activación única

1. Abrir la hoja y elegir **Extensiones → Apps Script**.
2. Reemplazar el contenido de `Code.gs` por el archivo de este directorio.
3. En **Configuración del proyecto**, activar la visualización del archivo de manifiesto y copiar `appsscript.json`.
4. Crear en **Propiedades del script** la propiedad `WEBHOOK_SECRET` con un valor aleatorio de al menos 32 caracteres. El mismo valor se configura como secreto `CONTACT_WEBHOOK_SECRET` en Sites; nunca se incorpora al repositorio.
5. Crear una implementación de tipo **Aplicación web**, ejecutar como el propietario y permitir acceso a **Cualquier usuario**. Autorizar únicamente Sheets y el envío de email.
6. Copiar la URL terminada en `/exec` y configurarla en Sites como `CONTACT_WEBHOOK_URL`.
7. Configurar en Sites:

   - `CONTACT_PROVIDER=google-apps-script`
   - `CONTACT_RECIPIENT_EMAIL=alegfink@gmail.com`
   - `CONTACT_WEBHOOK_URL=<url /exec>`
   - `CONTACT_WEBHOOK_SECRET=<mismo secreto>`

## Comportamiento y recuperación

- El secreto evita llamadas directas al receptor; nunca llega al navegador.
- El ID de envío evita filas y emails duplicados ante un reintento.
- Los campos, enums, listas de una a tres prioridades y alternativas “otro” se vuelven a validar dentro de Apps Script.
- Los valores peligrosos para fórmulas se guardan como texto para impedir formula injection.
- `NOTIFICADA` indica que la hoja y el email quedaron resueltos.
- `ERROR_NOTIFICACION` conserva la consulta aunque el email falle. La fila permite responder manualmente sin perder el mensaje.
- `GET` sobre la URL `/exec` devuelve un estado mínimo para monitoreo manual.

## Pruebas posteriores al despliegue

1. `GET /exec` responde `{"ok":true,"service":"portfolio-contact","version":"2.0"}`.
2. Un secreto incorrecto responde `UNAUTHORIZED` y no agrega una fila.
3. Una consulta válida agrega una fila, envía el email y queda `NOTIFICADA`.
4. Repetir el mismo ID no agrega otra fila ni envía otro email.
5. Un payload inválido responde `VALIDATION_ERROR`.
6. Desactivar temporalmente la implementación hace que Sites muestre un error y preserve los campos para reintentar.

La hoja debe permanecer privada. El control de seguimiento y la eliminación de consultas al cumplir 12 meses son manuales.
