/**
 * Portfolio contact receiver.
 * Bound to Alejandro Fink's private inquiry spreadsheet.
 */

const SPREADSHEET_ID = "1fl2mZywov2_JLjJhA07EXMfGxQ8_qpfVI1P667KU2QI";
const SHEET_NAME = "Consultas";
const RECIPIENT_EMAIL = "alegfink@gmail.com";
const SECRET_PROPERTY = "WEBHOOK_SECRET";
const ATTRIBUTION_HEADERS = ["Fuente", "Medio", "Campaña", "Término", "Contenido", "Dominio referente", "Primera ruta", "Atribución capturada"];

const LABELS = {
  goals: {
    "sell-more": "Vender más / mejorar conversión",
    "qualified-leads": "Conseguir consultas calificadas",
    "clarify-offer": "Clarificar la propuesta de valor",
    "build-trust": "Transmitir confianza y profesionalismo",
    streamline: "Ordenar o automatizar la operación",
    validate: "Validar una idea o producto",
    other: "Otro objetivo",
  },
  stages: {
    "no-site": "Sin sitio",
    "existing-underperforming": "Sitio existente sin el resultado esperado",
    "outdated-site": "Sitio desactualizado / no representa la marca",
    "social-first": "Opera por redes, WhatsApp o marketplaces",
    "digital-product": "Producto o sistema digital existente",
    defining: "Proyecto en definición",
  },
  challenges: {
    "unclear-offer": "Oferta poco clara",
    "low-leads": "Pocas consultas / poco calificadas",
    "low-conversion": "Interés que no convierte",
    "weak-brand": "Marca sin diferenciación o confianza",
    "manual-ops": "Operación manual",
    "tech-limits": "Límites técnicos o de mantenimiento",
    "no-direction": "Falta de prioridad o dirección",
    other: "Otro freno",
  },
  actions: {
    contact: "Contactar / dejar datos",
    whatsapp: "Iniciar conversación por WhatsApp",
    buy: "Comprar",
    book: "Reservar reunión o turno",
    quote: "Pedir cotización",
    register: "Registrarse / sumarse a una lista",
    other: "Otra acción",
  },
  brandTraits: {
    trustworthy: "Confiable",
    professional: "Profesional",
    premium: "Premium",
    clear: "Clara y simple",
    innovative: "Innovadora",
    human: "Cercana y humana",
    bold: "Audaz y diferente",
    other: "Otro atributo",
  },
  needs: {
    "business-site": "Sitio o landing",
    ecommerce: "E-commerce",
    funnel: "Funnel / captación",
    product: "MVP o producto digital",
    evolution: "Rediseño o evolución",
    automation: "Integraciones o automatización",
    strategy: "Diagnóstico y estrategia",
    other: "Otra necesidad",
  },
  investments: {
    none: "Sin inversión actual",
    "under-300": "Hasta USD 300 / mes",
    "300-1000": "USD 300–1.000 / mes",
    "1000-3000": "USD 1.000–3.000 / mes",
    "over-3000": "Más de USD 3.000 / mes",
    "prefer-not": "Prefiere no informar",
  },
  timelines: {
    asap: "Lo antes posible",
    "1-3-months": "1–3 meses",
    "3-6-months": "3–6 meses",
    flexible: "Sin fecha fija / explorando",
  },
  decisionStages: {
    exploring: "Explorando posibilidades",
    "needs-definition": "Necesita definir alcance",
    "partly-defined": "Idea bastante definida",
    comparing: "Comparando propuestas",
    ready: "Listo para empezar",
  },
};

function doGet() {
  return jsonResponse_({ ok: true, service: "portfolio-contact", version: "2.0" });
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
    ensureAttributionHeaders_(sheet);

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
      safeCellText_(LABELS.goals[inquiry.goal]),
      safeCellText_(inquiry.goalOther),
      safeCellText_(LABELS.stages[inquiry.stage]),
      safeCellText_(labelsFor_(inquiry.challenges, LABELS.challenges)),
      safeCellText_(inquiry.challengeOther),
      safeCellText_(inquiry.audience),
      safeCellText_(LABELS.actions[inquiry.desiredAction]),
      safeCellText_(inquiry.desiredActionOther),
      safeCellText_(labelsFor_(inquiry.brandTraits, LABELS.brandTraits)),
      safeCellText_(inquiry.brandOther),
      safeCellText_(labelsFor_(inquiry.needs, LABELS.needs)),
      safeCellText_(inquiry.needOther),
      safeCellText_(LABELS.investments[inquiry.investment]),
      safeCellText_(LABELS.timelines[inquiry.timeline]),
      safeCellText_(LABELS.decisionStages[inquiry.decisionStage]),
      safeCellText_(inquiry.message),
      "RECIBIDA",
      "Nueva",
      "",
      receivedAt,
      safeCellText_(inquiry.attribution.source),
      safeCellText_(inquiry.attribution.medium),
      safeCellText_(inquiry.attribution.campaign),
      safeCellText_(inquiry.attribution.term),
      safeCellText_(inquiry.attribution.content),
      safeCellText_(inquiry.attribution.referrerDomain),
      safeCellText_(inquiry.attribution.landingPath),
      safeCellText_(inquiry.attribution.capturedAt),
    ]);

    const row = sheet.getLastRow();
    try {
      MailApp.sendEmail({
        to: RECIPIENT_EMAIL,
        replyTo: inquiry.email,
        name: "Alejandro Fink — Portfolio",
        subject: "[Portfolio] Nueva consulta — " + LABELS.goals[inquiry.goal],
        body: buildEmailBody_(inquiry, receivedAt),
      });
      sheet.getRange(row, 24).setValue("NOTIFICADA");
      sheet.getRange(row, 27).setValue(new Date());
      return jsonResponse_({ ok: true, id: inquiry.submissionId });
    } catch (error) {
      sheet.getRange(row, 24).setValue("ERROR_NOTIFICACION");
      sheet.getRange(row, 26).setValue(safeError_(error));
      sheet.getRange(row, 27).setValue(new Date());
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
    goal: text_(input.goal),
    goalOther: text_(input.goalOther),
    stage: text_(input.stage),
    challenges: stringArray_(input.challenges),
    challengeOther: text_(input.challengeOther),
    audience: text_(input.audience),
    desiredAction: text_(input.desiredAction),
    desiredActionOther: text_(input.desiredActionOther),
    brandTraits: stringArray_(input.brandTraits),
    brandOther: text_(input.brandOther),
    needs: stringArray_(input.needs),
    needOther: text_(input.needOther),
    investment: text_(input.investment),
    timeline: text_(input.timeline),
    decisionStage: text_(input.decisionStage),
    message: text_(input.message),
    attribution: normalizeAttribution_(input.attribution),
  };

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(inquiry.submissionId)) return null;
  if (inquiry.locale !== "es" && inquiry.locale !== "en") return null;
  if (inquiry.name.length < 2 || inquiry.name.length > 80) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.email.length > 160) return null;
  if (inquiry.company.length > 120) return null;
  if (inquiry.website && (!/^https?:\/\//i.test(inquiry.website) || inquiry.website.length > 500)) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.goals, inquiry.goal)) return null;
  if (!validOther_(inquiry.goal === "other", inquiry.goalOther)) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.stages, inquiry.stage)) return null;
  if (!validSelection_(inquiry.challenges, LABELS.challenges) || !validOther_(inquiry.challenges.indexOf("other") !== -1, inquiry.challengeOther)) return null;
  if (!inquiry.audience || inquiry.audience.length > 400) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.actions, inquiry.desiredAction)) return null;
  if (!validOther_(inquiry.desiredAction === "other", inquiry.desiredActionOther)) return null;
  if (!validSelection_(inquiry.brandTraits, LABELS.brandTraits) || !validOther_(inquiry.brandTraits.indexOf("other") !== -1, inquiry.brandOther)) return null;
  if (!validSelection_(inquiry.needs, LABELS.needs) || !validOther_(inquiry.needs.indexOf("other") !== -1, inquiry.needOther)) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.investments, inquiry.investment)) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.timelines, inquiry.timeline)) return null;
  if (!Object.prototype.hasOwnProperty.call(LABELS.decisionStages, inquiry.decisionStage)) return null;
  if (inquiry.message.length > 3000) return null;
  return inquiry;
}

function validSelection_(values, allowed) {
  if (!Array.isArray(values) || values.length < 1 || values.length > 3) return false;
  if (values.filter(function (value, index) { return values.indexOf(value) === index; }).length !== values.length) return false;
  return values.every(function (value) { return Object.prototype.hasOwnProperty.call(allowed, value); });
}

function validOther_(selected, value) {
  return !selected || (value.length >= 2 && value.length <= 180);
}

function findSubmissionRow_(sheet, submissionId) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const match = sheet.getRange(2, 1, lastRow - 1, 1).createTextFinder(submissionId).matchEntireCell(true).findNext();
  return match ? match.getRow() : 0;
}

function buildEmailBody_(inquiry, receivedAt) {
  return [
    "Nueva consulta recibida desde el diagnóstico del portfolio.",
    "",
    "Fecha: " + Utilities.formatDate(receivedAt, "America/Buenos_Aires", "yyyy-MM-dd HH:mm:ss"),
    "Idioma: " + inquiry.locale.toUpperCase(),
    "Nombre: " + inquiry.name,
    "Email: " + inquiry.email,
    "Empresa o proyecto: " + (inquiry.company || "—"),
    "Sitio o referencia: " + (inquiry.website || "—"),
    "",
    "OBJETIVO: " + LABELS.goals[inquiry.goal] + otherSuffix_(inquiry.goalOther),
    "PUNTO DE PARTIDA: " + LABELS.stages[inquiry.stage],
    "FRENOS: " + labelsFor_(inquiry.challenges, LABELS.challenges) + otherSuffix_(inquiry.challengeOther),
    "AUDIENCIA: " + inquiry.audience,
    "ACCIÓN ESPERADA: " + LABELS.actions[inquiry.desiredAction] + otherSuffix_(inquiry.desiredActionOther),
    "MARCA: " + labelsFor_(inquiry.brandTraits, LABELS.brandTraits) + otherSuffix_(inquiry.brandOther),
    "AYUDA BUSCADA: " + labelsFor_(inquiry.needs, LABELS.needs) + otherSuffix_(inquiry.needOther),
    "INVERSIÓN ACTUAL: " + LABELS.investments[inquiry.investment],
    "PLAZO: " + LABELS.timelines[inquiry.timeline],
    "ETAPA DE DECISIÓN: " + LABELS.decisionStages[inquiry.decisionStage],
    "",
    "ATRIBUCIÓN CONSENTIDA:",
    "Fuente / medio: " + ((inquiry.attribution.source || "directo / no informado") + (inquiry.attribution.medium ? " / " + inquiry.attribution.medium : "")),
    "Campaña: " + (inquiry.attribution.campaign || "—"),
    "Término / contenido: " + ((inquiry.attribution.term || "—") + " / " + (inquiry.attribution.content || "—")),
    "Referente: " + (inquiry.attribution.referrerDomain || "—"),
    "Primera ruta: " + (inquiry.attribution.landingPath || "—"),
    "Capturada: " + (inquiry.attribution.capturedAt || "—"),
    "",
    "CONTEXTO ADICIONAL:",
    inquiry.message || "—",
    "",
    "ID: " + inquiry.submissionId,
    "Responder este email dirige la respuesta a " + inquiry.email + ".",
  ].join("\n");
}

function ensureAttributionHeaders_(sheet) {
  const startColumn = 28;
  const current = sheet.getRange(1, startColumn, 1, ATTRIBUTION_HEADERS.length).getDisplayValues()[0];
  if (current.join("|") !== ATTRIBUTION_HEADERS.join("|")) {
    sheet.getRange(1, startColumn, 1, ATTRIBUTION_HEADERS.length).setValues([ATTRIBUTION_HEADERS]);
  }
}

function normalizeAttribution_(input) {
  const empty = { source: "", medium: "", campaign: "", term: "", content: "", referrerDomain: "", landingPath: "", capturedAt: "" };
  if (!input || typeof input !== "object") return empty;
  const landingPath = text_(input.landingPath).slice(0, 240);
  const capturedAt = text_(input.capturedAt).slice(0, 40);
  const referrerDomain = text_(input.referrerDomain).toLowerCase().slice(0, 120);
  if (landingPath && !/^\/(es|en)(\/[a-z0-9-]+)*\/?$/i.test(landingPath)) return empty;
  if (referrerDomain && !/^[a-z0-9.-]+$/.test(referrerDomain)) return empty;
  return {
    source: attributionText_(input.source, 100),
    medium: attributionText_(input.medium, 100),
    campaign: attributionText_(input.campaign, 100),
    term: attributionText_(input.term, 100),
    content: attributionText_(input.content, 100),
    referrerDomain: referrerDomain,
    landingPath: landingPath,
    capturedAt: capturedAt,
  };
}

function attributionText_(value, max) {
  const normalized = text_(value).replace(/[\x00-\x1F\x7F]/g, "").slice(0, max);
  if (normalized.indexOf("@") !== -1 || /\d{8,}/.test(normalized.replace(/\D/g, ""))) return "";
  return normalized;
}

function labelsFor_(values, labels) {
  return values.map(function (value) { return labels[value]; }).join(" · ");
}

function otherSuffix_(value) {
  return value ? " — " + value : "";
}

function stringArray_(value) {
  return Array.isArray(value) ? value.map(text_) : [];
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
