/**
 * Portfolio contact receiver.
 * Bound to the private Google Sheet created for Alejandro Fink.
 */

const SPREADSHEET_ID = "1fl2mZywov2_JLjJhA07EXMfGxQ8_qpfVI1P667KU2QI";
const SHEET_NAME = "Consultas";
const RECIPIENT_EMAIL = "alegfink@gmail.com";
const SECRET_PROPERTY = "WEBHOOK_SECRET";

const ALLOWED_NEEDS = ["business-site", "ecommerce", "product", "evolution", "collaboration"];
const ALLOWED_STAGES = ["starting", "existing-site", "operating", "exploring"];
const NEED_LABELS = {
  "business-site": "Sitio o landing",
  ecommerce: "E-commerce",
  product: "MVP o producto digital",
  evolution: "Evolución de un producto",
  collaboration: "Agencia o contract",
};
const STAGE_LABELS = {
  starting: "Idea o proyecto nuevo",
  "existing-site": "Ya existe un sitio",
  operating: "Producto o negocio operativo",
  exploring: "Todavía lo está definiendo",
};

function doGet() {
  return jsonResponse_({ ok: true, service: "portfolio-contact", version: "1.0" });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return jsonResponse_({ ok: false, code: "BUSY" });

  try {
    const body = parseBody_(event);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY);
    if (!expectedSecret) return jsonResponse_({ ok: false, code: "MISCONFIGURED" });
    if (!body || body.secret !== expectedSecret) return jsonResponse_({ ok: false, code: "UNAUTHORIZED" });

    const inquiry = normalizeAndValidateInquiry_(body.inquiry);
    if (!inquiry) return jsonResponse_({ ok: false, code: "VALIDATION_ERROR" });

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) return jsonResponse_({ ok: false, code: "SHEET_NOT_FOUND" });

    const duplicateRow = findSubmissionRow_(sheet, inquiry.submissionId);
    if (duplicateRow) return jsonResponse_({ ok: true, duplicate: true, id: inquiry.submissionId });

    const receivedAt = new Date();
    sheet.appendRow([
      safeCellText_(inquiry.submissionId),
      receivedAt,
      safeCellText_(inquiry.locale),
      safeCellText_(inquiry.name),
      safeCellText_(inquiry.email),
      safeCellText_(inquiry.company),
      safeCellText_(inquiry.website),
      safeCellText_(NEED_LABELS[inquiry.need]),
      safeCellText_(STAGE_LABELS[inquiry.stage]),
      safeCellText_(inquiry.message),
      "RECIBIDA",
      "Nueva",
      "",
      receivedAt,
    ]);

    const row = sheet.getLastRow();
    try {
      MailApp.sendEmail({
        to: RECIPIENT_EMAIL,
        replyTo: inquiry.email,
        name: "Alejandro Fink — Portfolio",
        subject: "[Portfolio] Nueva consulta — " + NEED_LABELS[inquiry.need],
        body: buildEmailBody_(inquiry, receivedAt),
      });
      sheet.getRange(row, 11).setValue("NOTIFICADA");
      sheet.getRange(row, 14).setValue(new Date());
      return jsonResponse_({ ok: true, id: inquiry.submissionId });
    } catch (error) {
      sheet.getRange(row, 11).setValue("ERROR_NOTIFICACION");
      sheet.getRange(row, 13).setValue(safeError_(error));
      sheet.getRange(row, 14).setValue(new Date());
      return jsonResponse_({ ok: false, code: "EMAIL_FAILED", id: inquiry.submissionId });
    }
  } catch (error) {
    return jsonResponse_({ ok: false, code: "INTERNAL_ERROR", detail: safeError_(error) });
  } finally {
    lock.releaseLock();
  }
}

function parseBody_(event) {
  if (!event || !event.postData || typeof event.postData.contents !== "string") return null;
  try {
    return JSON.parse(event.postData.contents);
  } catch (_error) {
    return null;
  }
}

function normalizeAndValidateInquiry_(input) {
  if (!input || typeof input !== "object") return null;
  const inquiry = {
    submissionId: text_(input.submissionId),
    locale: text_(input.locale),
    name: text_(input.name),
    email: text_(input.email).toLowerCase(),
    company: text_(input.company),
    website: text_(input.website),
    need: text_(input.need),
    stage: text_(input.stage),
    message: text_(input.message),
  };

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(inquiry.submissionId)) return null;
  if (inquiry.locale !== "es" && inquiry.locale !== "en") return null;
  if (inquiry.name.length < 2 || inquiry.name.length > 80) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.email.length > 160) return null;
  if (inquiry.company.length > 120) return null;
  if (inquiry.website && (!/^https?:\/\//i.test(inquiry.website) || inquiry.website.length > 500)) return null;
  if (ALLOWED_NEEDS.indexOf(inquiry.need) === -1) return null;
  if (ALLOWED_STAGES.indexOf(inquiry.stage) === -1) return null;
  if (inquiry.message.length < 20 || inquiry.message.length > 3000) return null;
  return inquiry;
}

function findSubmissionRow_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const match = sheet.getRange(2, 1, lastRow - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function buildEmailBody_(inquiry, receivedAt) {
  return [
    "Nueva consulta recibida desde el portfolio.",
    "",
    "Fecha: " + Utilities.formatDate(receivedAt, "America/Buenos_Aires", "yyyy-MM-dd HH:mm:ss"),
    "Idioma: " + inquiry.locale.toUpperCase(),
    "Nombre: " + inquiry.name,
    "Email: " + inquiry.email,
    "Empresa o proyecto: " + (inquiry.company || "—"),
    "Sitio o referencia: " + (inquiry.website || "—"),
    "Necesidad: " + NEED_LABELS[inquiry.need],
    "Situación: " + STAGE_LABELS[inquiry.stage],
    "",
    "Mensaje:",
    inquiry.message,
    "",
    "ID: " + inquiry.submissionId,
    "Responder este email dirige la respuesta a " + inquiry.email + ".",
  ].join("\n");
}

function text_(value) {
  return typeof value === "string" ? value.trim() : "";
}

function safeCellText_(value) {
  const text = String(value || "");
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function safeError_(error) {
  const message = error && error.message ? String(error.message) : "Error desconocido";
  return message.replace(/[\r\n]+/g, " ").slice(0, 300);
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
