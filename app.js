/**
 * Bioquímica Básica — Lógica de interfaz
 */
/* ── State ── */
let activeDrugId = null;
let PHARMA_DATA = null;
let SYNTHESIS_DATA = null;
let OBESITY_DATA = null;
let MUSCLE_DATA = null;
let CARDIOVASCULAR_DATA = null;
let AGING_DATA = null;
let synthesisStepById = {};
let muscleStepById = {};
let cardiovascularStepById = {};
let agingStepById = {};

let activeView = "synthesis";
let activeSynthesisStepId = null;
let activeMuscleStepId = null;
let activeCardiovascularStepId = null;
let activeAgingStepId = null;
let lastFocusedElement = null;

let lockSelectedTermId = null;
let lockMatches = {};

const connectionsLayers = new Map();

const DIAGRAM_LAYERS = {
  synthesis: "synthesis",
  muscle: "muscle",
  cardiovascular: "cardiovascular",
  aging: "aging",
};

const els = {
  drugMenu: document.getElementById("drug-menu"),
  userGuest: document.getElementById("user-guest"),
  userLogged: document.getElementById("user-logged"),
  userBadgeName: document.getElementById("user-badge-name"),
  userBadgeId: document.getElementById("user-badge-id"),
  drugMenuNotice: document.getElementById("drug-menu-notice"),
  btnOpenRegister: document.getElementById("btn-open-register"),
  btnMyMetrics: document.getElementById("btn-my-metrics"),
  btnSwitchUser: document.getElementById("btn-switch-user"),
  userRegisterOverlay: document.getElementById("user-register-overlay"),
  registerForm: document.getElementById("register-form"),
  registerName: document.getElementById("register-name"),
  registerStudentId: document.getElementById("register-id"),
  registerFeedback: document.getElementById("register-feedback"),
  registerDeviceUsers: document.getElementById("register-device-users"),
  registerClose: document.getElementById("register-close"),
  userMetricsOverlay: document.getElementById("user-metrics-overlay"),
  userMetricsClose: document.getElementById("user-metrics-close"),
  userMetricsSubtitle: document.getElementById("user-metrics-subtitle"),
  userMetricsStats: document.getElementById("user-metrics-stats"),
  btnDownloadMetricsPdf: document.getElementById("btn-download-metrics-pdf"),
  appStudy: document.getElementById("app-study"),
  btnBackMenu: document.getElementById("btn-back-menu"),
  drugPickers: document.querySelectorAll(".drug-picker"),
  drugTitle: document.getElementById("drug-title"),
  drugSubtitle: document.getElementById("drug-subtitle"),
  moduleBadge: document.getElementById("module-badge"),
  viewTabs: document.querySelectorAll(".view-tab[data-view]"),
  diagramHeading: document.getElementById("diagram-heading"),
  diagramSource: document.getElementById("diagram-source"),
  synthesisDiagram: document.getElementById("synthesis-diagram"),
  muscleDiagram: document.getElementById("muscle-diagram"),
  cardiovascularDiagram: document.getElementById("cardiovascular-diagram"),
  agingDiagram: document.getElementById("aging-diagram"),
  main: document.querySelector(".main"),
  studyPanel: document.querySelector(".study-panel"),
  diagramPanel: document.querySelector(".diagram-panel"),
  synthesisStudyCard: document.getElementById("synthesis-study-card"),
  synthesisStudyStep: document.getElementById("synthesis-study-step"),
  synthesisStudyTitle: document.getElementById("synthesis-study-title"),
  synthesisStudyBullets: document.getElementById("synthesis-study-bullets"),
  synthesisStudyTipText: document.getElementById("synthesis-study-tip-text"),
  obesityStudyCard: document.getElementById("obesity-study-card"),
  obesityStudyStep: document.getElementById("obesity-study-step"),
  obesityStudyTitle: document.getElementById("obesity-study-title"),
  obesitySynthesisBullets: document.getElementById("obesity-synthesis-bullets"),
  obesityImpactBullets: document.getElementById("obesity-impact-bullets"),
  obesityStudyTipText: document.getElementById("obesity-study-tip-text"),
  muscleStudyCard: document.getElementById("muscle-study-card"),
  muscleStudyStep: document.getElementById("muscle-study-step"),
  muscleStudyTitle: document.getElementById("muscle-study-title"),
  muscleStudyBullets: document.getElementById("muscle-study-bullets"),
  muscleStudyTipText: document.getElementById("muscle-study-tip-text"),
  cardiovascularStudyCard: document.getElementById("cardiovascular-study-card"),
  cardiovascularStudyStep: document.getElementById("cardiovascular-study-step"),
  cardiovascularStudyTitle: document.getElementById("cardiovascular-study-title"),
  cardiovascularStudyBullets: document.getElementById("cardiovascular-study-bullets"),
  cardiovascularStudyTipText: document.getElementById("cardiovascular-study-tip-text"),
  agingStudyCard: document.getElementById("aging-study-card"),
  agingStudyStep: document.getElementById("aging-study-step"),
  agingStudyTitle: document.getElementById("aging-study-title"),
  agingStudyBullets: document.getElementById("aging-study-bullets"),
  agingStudyTipText: document.getElementById("aging-study-tip-text"),
  physiologyLock: document.getElementById("physiology-lock"),
  studyContent: document.getElementById("study-content"),
  lockTitle: document.getElementById("lock-title"),
  lockIntro: document.getElementById("lock-intro"),
  lockTerms: document.getElementById("lock-terms"),
  lockDefinitions: document.getElementById("lock-definitions"),
  lockSubmit: document.getElementById("lock-submit"),
  lockHint: document.getElementById("lock-hint"),
  lockFail: document.getElementById("lock-fail"),
  lockRetry: document.getElementById("lock-retry"),
  professorOverlay: document.getElementById("professor-overlay"),
  professorClose: document.getElementById("professor-close"),
  professorStats: document.getElementById("professor-stats"),
  professorAuth: document.getElementById("professor-auth"),
  professorKeyInput: document.getElementById("professor-key-input"),
  professorKeySubmit: document.getElementById("professor-key-submit"),
  professorSubtitle: document.getElementById("professor-subtitle"),
  modalOverlay: document.getElementById("modal-overlay"),
  modalClose: document.getElementById("modal-close"),
  modalAcronym: document.getElementById("modal-acronym"),
  modalFullName: document.getElementById("modal-full-name"),
  modalBody: document.getElementById("modal-body"),
};

const VIEW_LABELS = {
  synthesis: "Síntesis",
  obesity: "Obesidad y testosterona",
  muscle: "Testosterona y músculo",
  cardiovascular: "Testosterona y salud cardiovascular",
  aging: "Testosterona y envejecimiento",
};

const TAB_VIEW_IDS = ["synthesis", "obesity", "muscle", "cardiovascular", "aging"];

const SECONDARY_VIEW_IDS = new Set(["muscle", "cardiovascular", "aging"]);

const STORAGE_KEY = "bioquimicaBasica_stats";
const USERS_KEY = "bioquimicaBasica_users";
const ACTIVE_USER_KEY = "bioquimicaBasica_activeUser";
const PROFESSOR_KEY_STORAGE = "bioquimicaBasica_professorKey";

let activeUserId = null;
let serverSyncEnabled = false;
let statsPushTimer = null;
let professorApiKey = sessionStorage.getItem(PROFESSOR_KEY_STORAGE) || "";

function getApiBase() {
  const configured = window.FARMA_API_URL;
  if (configured === false || configured === "off") return null;
  if (typeof configured === "string" && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  if (
    location.port === "3000" &&
    (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ) {
    return "";
  }
  // Mismo origen: Render sirve la app y la API juntas
  if (location.hostname.endsWith(".onrender.com")) {
    return "";
  }
  return null;
}

async function apiFetch(path, options = {}) {
  const base = getApiBase();
  if (base === null) return null;

  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Error HTTP ${response.status}`);
  }

  return response.json();
}

async function initServerConnection() {
  serverSyncEnabled = getApiBase() !== null;
  if (!serverSyncEnabled || !activeUserId) return;
  await pullStatsFromServer();
}

async function syncSessionOnServer(name, studentId) {
  if (!serverSyncEnabled) return null;

  try {
    const data = await apiFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({ name, studentId }),
    });

    if (data?.stats && data.userId) {
      const store = readAllStatsStore();
      store[data.userId] = data.stats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }

    return data;
  } catch (error) {
    console.warn("No se pudo sincronizar la sesión con el servidor:", error);
    return null;
  }
}

async function pullStatsFromServer() {
  if (!serverSyncEnabled || !activeUserId) return;

  try {
    const data = await apiFetch(`/api/session/stats?userId=${encodeURIComponent(activeUserId)}`);
    if (data?.stats) {
      const store = readAllStatsStore();
      store[activeUserId] = data.stats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
  } catch (error) {
    console.warn("No se pudo descargar progreso del servidor:", error);
  }
}

function scheduleServerStatsPush() {
  if (!serverSyncEnabled || !activeUserId) return;
  window.clearTimeout(statsPushTimer);
  statsPushTimer = window.setTimeout(() => {
    pushStatsToServer();
  }, 450);
}

async function pushStatsToServer() {
  if (!serverSyncEnabled || !activeUserId) return;

  try {
    await apiFetch("/api/session/stats", {
      method: "PUT",
      body: JSON.stringify({
        userId: activeUserId,
        stats: readStats(),
      }),
    });
  } catch (error) {
    console.warn("No se pudo guardar progreso en el servidor:", error);
  }
}

async function fetchProfessorDataFromServer(key) {
  if (!serverSyncEnabled) return null;
  return apiFetch("/api/students", {
    headers: { "X-Professor-Key": key },
  });
}

const ABBREV_ALIASES = {
  "complejo I": "Cx I",
  "Complejo I": "Cx I",
  "factor intrínseco": "IF",
  "vitamina B12": "B12",
  "Vitamina B12": "B12",
  "HMG-CoA reductasa": "HMGCR",
};

function getActiveModule() {
  return activeDrugId ? DRUG_MODULES[activeDrugId] : null;
}

function normalizeStudentId(studentId) {
  return String(studentId).trim().toUpperCase().replace(/\s+/g, "");
}

function userIdFromStudentId(studentId) {
  const matricula = normalizeStudentId(studentId);
  if (!matricula || matricula.length < 3) return null;
  return `student-${matricula.replace(/[^A-Z0-9]/g, "")}`;
}

function findUserIdByStudentId(studentId) {
  const userId = userIdFromStudentId(studentId);
  if (!userId) return null;
  const registry = readUsersRegistry();
  return registry.users[userId] ? userId : null;
}

function slugifyUserId(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

function readUsersRegistry() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : { users: {} };
  } catch {
    return { users: {} };
  }
}

function writeUsersRegistry(registry) {
  localStorage.setItem(USERS_KEY, JSON.stringify(registry));
}

function loadActiveUser() {
  activeUserId = localStorage.getItem(ACTIVE_USER_KEY);
  const registry = readUsersRegistry();
  if (activeUserId && !registry.users[activeUserId]) {
    activeUserId = null;
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
  migrateLegacyStatsIfNeeded();
}

function getActiveUserProfile() {
  if (!activeUserId) return null;
  return readUsersRegistry().users[activeUserId] ?? null;
}

function setActiveUser(userId) {
  activeUserId = userId;
  localStorage.setItem(ACTIVE_USER_KEY, userId);
  updateUserPanelUI();
}

function migrateLegacyStatsIfNeeded() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed.testosterona && !parsed.glp1 && !parsed.metformina) return;
    const userId = activeUserId || `legacy-${Date.now().toString(36)}`;
    const registry = readUsersRegistry();
    if (!registry.users[userId]) {
      registry.users[userId] = {
        name: "Progreso anterior",
        studentId: "",
        registeredAt: Date.now(),
      };
      writeUsersRegistry(registry);
    }
    if (!activeUserId) setActiveUser(userId);
    const nested = {};
    nested[userId] = parsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nested));
  } catch {
    /* ignore corrupt legacy data */
  }
}

function readAllStatsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readStats() {
  if (!activeUserId) return {};
  const store = readAllStatsStore();
  return store[activeUserId] ?? {};
}

function writeStats(stats) {
  if (!activeUserId) return;
  const store = readAllStatsStore();
  store[activeUserId] = stats;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  scheduleServerStatsPush();
}

function createDefaultDrugStats() {
  return {
    lock: { passed: false, attempts: 0 },
    tabVisits: {
      synthesis: 0,
      obesity: 0,
      muscle: 0,
      cardiovascular: 0,
      aging: 0,
    },
    synthesisSteps: [],
    obesitySteps: [],
    muscleSteps: [],
    cardiovascularSteps: [],
    agingSteps: [],
  };
}

function registerUser(name, studentId = "") {
  const trimmed = name.trim();
  const matricula = normalizeStudentId(studentId);

  if (trimmed.length < 2) {
    return { ok: false, message: "Escribe tu nombre completo." };
  }
  if (!matricula || matricula.length < 3) {
    return { ok: false, message: "La matrícula es obligatoria (mínimo 3 caracteres)." };
  }

  const registry = readUsersRegistry();
  const userId = userIdFromStudentId(matricula);
  const existing = registry.users[userId];
  const resumed = Boolean(existing);

  registry.users[userId] = {
    name: trimmed,
    studentId: matricula,
    registeredAt: existing?.registeredAt ?? Date.now(),
    lastLoginAt: Date.now(),
  };
  writeUsersRegistry(registry);
  setActiveUser(userId);

  const store = readAllStatsStore();
  if (!store[userId]) {
    store[userId] = {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  return {
    ok: true,
    resumed,
    userId,
    message: resumed
      ? serverSyncEnabled
        ? "¡Bienvenido de nuevo! Recuperamos tu progreso desde el servidor."
        : "¡Bienvenido de nuevo! Recuperamos tu progreso guardado en este navegador."
      : serverSyncEnabled
        ? "Cuenta creada. Tu progreso se guardará en el servidor."
        : "Cuenta creada. Tu progreso quedará ligado a esta matrícula en este dispositivo.",
  };
}

function isUserRegistered() {
  return Boolean(activeUserId && getActiveUserProfile());
}

function updateUserPanelUI() {
  const registered = isUserRegistered();
  if (els.userGuest) els.userGuest.hidden = registered;
  if (els.userLogged) els.userLogged.hidden = !registered;

  const profile = getActiveUserProfile();
  if (registered && profile) {
    if (els.userBadgeName) els.userBadgeName.textContent = profile.name;
    if (els.userBadgeId) {
      els.userBadgeId.textContent = profile.studentId ? `Matrícula ${profile.studentId}` : "";
      els.userBadgeId.hidden = !profile.studentId;
    }
  }

  els.drugPickers?.forEach((btn) => {
    btn.disabled = !registered;
    btn.classList.toggle("drug-picker--disabled", !registered);
  });

  if (els.drugMenuNotice) {
    els.drugMenuNotice.hidden = registered;
    if (!registered) {
      els.drugMenuNotice.textContent =
        "Regístrate con tu matrícula. Al terminar, descarga el PDF de métricas y envíaselo a tu profesor.";
    }
  }
}

function renderRegisterDeviceUsers() {
  if (!els.registerDeviceUsers) return;
  const registry = readUsersRegistry();
  const entries = Object.entries(registry.users)
    .filter(([, profile]) => profile.studentId)
    .sort((a, b) => (b[1].lastLoginAt || b[1].registeredAt) - (a[1].lastLoginAt || a[1].registeredAt));

  if (entries.length === 0) {
    els.registerDeviceUsers.innerHTML = "";
    els.registerDeviceUsers.hidden = true;
    return;
  }

  els.registerDeviceUsers.hidden = false;
  els.registerDeviceUsers.innerHTML = `
    <p class="register-device-users__heading">Cuentas en este navegador</p>
    ${entries
      .map(
        ([id, profile]) => `
      <button type="button" class="view-tab view-tab--ghost register-device-users__btn" data-resume-user="${id}">
        Continuar como ${escapeHtml(profile.name)} · ${escapeHtml(profile.studentId)}
      </button>
    `
      )
      .join("")}
  `;
}

function resumeExistingUser(userId) {
  const registry = readUsersRegistry();
  const profile = registry.users[userId];
  if (!profile) return;
  profile.lastLoginAt = Date.now();
  writeUsersRegistry(registry);
  setActiveUser(userId);
  if (serverSyncEnabled) {
    pullStatsFromServer().finally(() => {
      closeRegisterModal();
      updateUserPanelUI();
    });
    return;
  }
  closeRegisterModal();
  updateUserPanelUI();
}

function openRegisterModal() {
  if (!els.userRegisterOverlay) return;
  renderRegisterDeviceUsers();
  if (els.registerFeedback) {
    els.registerFeedback.textContent = "";
    els.registerFeedback.hidden = true;
  }
  els.userRegisterOverlay.hidden = false;
  els.userRegisterOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.registerStudentId?.focus();
}

function closeRegisterModal() {
  if (!els.userRegisterOverlay) return;
  els.userRegisterOverlay.hidden = true;
  els.userRegisterOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay?.hidden && els.userMetricsOverlay?.hidden && els.professorOverlay?.hidden) {
    document.body.style.overflow = "";
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = els.registerName?.value ?? "";
  const studentId = els.registerStudentId?.value ?? "";
  const result = registerUser(name, studentId);

  if (result.ok && serverSyncEnabled) {
    const serverSession = await syncSessionOnServer(name, studentId);
    if (serverSession?.resumed) {
      result.resumed = true;
      result.message = "¡Bienvenido de nuevo! Recuperamos tu progreso desde el servidor.";
    } else if (serverSession) {
      result.message = "Cuenta creada. Tu progreso se guardará en el servidor.";
    }
  }

  if (els.registerFeedback) {
    els.registerFeedback.hidden = false;
    els.registerFeedback.textContent = result.message ?? "";
    els.registerFeedback.dataset.type = result.ok ? (result.resumed ? "resume" : "new") : "error";
  }

  if (result.ok) {
    window.setTimeout(() => {
      els.registerForm?.reset();
      closeRegisterModal();
      updateUserPanelUI();
    }, result.resumed ? 900 : 500);
  }
}

function switchUser() {
  activeUserId = null;
  localStorage.removeItem(ACTIVE_USER_KEY);
  updateUserPanelUI();
  openRegisterModal();
}

function summarizeDrugMetrics(drugStats) {
  const lockAttempts = drugStats.lock?.attempts ?? 0;
  const lockPassed = drugStats.lock?.passed === true;
  const tabVisits = {
    synthesis: 0,
    obesity: 0,
    muscle: 0,
    cardiovascular: 0,
    aging: 0,
    ...(drugStats.tabVisits ?? {}),
  };
  const obesitySteps = drugStats.obesitySteps ?? [];
  const muscleSteps = drugStats.muscleSteps ?? [];
  const cardiovascularSteps = drugStats.cardiovascularSteps ?? [];
  const agingSteps = drugStats.agingSteps ?? [];
  const synthesisSteps = drugStats.synthesisSteps ?? [];
  const obesityTotal = DRUG_MODULES.testosterona?.synthesis?.steps?.length ?? 0;
  const synthesisTotal = DRUG_MODULES.testosterona?.synthesis?.steps?.length ?? 0;
  const muscleTotal = DRUG_MODULES.testosterona?.muscle?.steps?.length ?? 0;
  const cardiovascularTotal = DRUG_MODULES.testosterona?.cardiovascular?.steps?.length ?? 0;
  const agingTotal = DRUG_MODULES.testosterona?.aging?.steps?.length ?? 0;
  const tabsVisited = TAB_VIEW_IDS.filter((id) => (tabVisits[id] ?? 0) > 0).length;

  return {
    lockAttempts,
    lockPassed,
    tabVisits,
    tabsVisited,
    obesityStepsExplored: obesitySteps.length,
    obesityTotalSteps: obesityTotal,
    muscleStepsExplored: muscleSteps.length,
    muscleTotalSteps: muscleTotal,
    cardiovascularStepsExplored: cardiovascularSteps.length,
    cardiovascularTotalSteps: cardiovascularTotal,
    agingStepsExplored: agingSteps.length,
    agingTotalSteps: agingTotal,
    synthesisStepsExplored: synthesisSteps.length,
    synthesisTotalSteps: synthesisTotal,
    hasActivity:
      tabsVisited > 0 ||
      obesitySteps.length > 0 ||
      muscleSteps.length > 0 ||
      cardiovascularSteps.length > 0 ||
      agingSteps.length > 0 ||
      synthesisSteps.length > 0,
  };
}

function buildMetricsCardsHtml(drugStats, drugLabel) {
  const summary = summarizeDrugMetrics(drugStats);

  return `
    <article class="professor-card professor-card--teal">
      <h4 class="professor-card__title">${drugLabel} · Pestañas visitadas</h4>
      <p class="professor-card__value">${summary.tabsVisited}/5</p>
      <p class="professor-card__meta">
        Síntesis ${summary.tabVisits.synthesis ?? 0} · Obesidad ${summary.tabVisits.obesity ?? 0} · Músculo ${summary.tabVisits.muscle ?? 0} · CV ${summary.tabVisits.cardiovascular ?? 0} · Envej ${summary.tabVisits.aging ?? 0}
      </p>
    </article>
    <article class="professor-card professor-card--lavender">
      <h4 class="professor-card__title">${drugLabel} · Síntesis explorada</h4>
      <p class="professor-card__value">${summary.synthesisStepsExplored}/${summary.synthesisTotalSteps}</p>
      <p class="professor-card__meta">Pasos del diagrama de síntesis</p>
    </article>
    <article class="professor-card professor-card--yellow">
      <h4 class="professor-card__title">${drugLabel} · Músculo explorado</h4>
      <p class="professor-card__value">${summary.muscleStepsExplored}/${summary.muscleTotalSteps}</p>
      <p class="professor-card__meta">Pasos del diagrama testosterona–músculo</p>
    </article>
    <article class="professor-card professor-card--coral">
      <h4 class="professor-card__title">${drugLabel} · Salud cardiovascular</h4>
      <p class="professor-card__value">${summary.cardiovascularStepsExplored}/${summary.cardiovascularTotalSteps}</p>
      <p class="professor-card__meta">Pasos del diagrama testosterona–CV (Thirumalai 2022)</p>
    </article>
    <article class="professor-card professor-card--sky">
      <h4 class="professor-card__title">${drugLabel} · Envejecimiento</h4>
      <p class="professor-card__value">${summary.agingStepsExplored}/${summary.agingTotalSteps}</p>
      <p class="professor-card__meta">Pasos del diagrama testosterona–envejecimiento (Anawalt 2022)</p>
    </article>
  `;
}

function formatReportDate(timestamp = Date.now()) {
  return new Date(timestamp).toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function slugifyFilename(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const PDF_COLORS = {
  cream: [251, 249, 241],
  black: [24, 24, 27],
  yellow: [253, 224, 147],
  teal: [42, 157, 143],
  lavender: [199, 184, 234],
  coral: [244, 162, 97],
  sky: [168, 218, 220],
  white: [255, 255, 255],
  muted: [68, 68, 68],
};

function pdfSetFill(doc, rgb) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function pdfSetStroke(doc, rgb) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function pdfSetText(doc, rgb) {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function pdfTextColorForCard(fillRgb) {
  return fillRgb === PDF_COLORS.teal ? PDF_COLORS.white : PDF_COLORS.black;
}

function pdfMetaColorForCard(fillRgb) {
  return fillRgb === PDF_COLORS.teal ? [230, 245, 243] : PDF_COLORS.muted;
}

function pdfEnsureSpace(doc, y, needed, margin) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed <= pageHeight - margin) return y;
  doc.addPage();
  pdfPaintPageBackground(doc);
  return margin;
}

function pdfPaintPageBackground(doc) {
  pdfSetFill(doc, PDF_COLORS.cream);
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), "F");
}

function pdfDrawShadowRect(doc, x, y, w, h, fillRgb, shadow = 1.8) {
  pdfSetFill(doc, PDF_COLORS.black);
  doc.rect(x + shadow, y + shadow, w, h, "F");
  pdfSetFill(doc, fillRgb);
  pdfSetStroke(doc, PDF_COLORS.black);
  doc.setLineWidth(0.55);
  doc.rect(x, y, w, h, "FD");
}

function pdfSafeText(text) {
  return String(text)
    .replace(/\u2192/g, " -> ")
    .replace(/·/g, " | ")
    .replace(/—/g, "-");
}

function pdfMeasureLines(doc, text, maxWidth, fontSize = 8.8) {
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(pdfSafeText(text), maxWidth);
}

function pdfDrawRecommendationsSection(doc, y, title, tips, margin, contentWidth) {
  if (tips.length === 0) return y;

  y = pdfEnsureSpace(doc, y, 24, margin);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(pdfSafeText(title), margin, y);
  y += 6;

  const textX = margin + 4;
  const textWidth = contentWidth - 8;
  const lineHeight = 4.2;

  tips.forEach((tip, index) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    const bodyLines = pdfMeasureLines(doc, tip, textWidth - 6, 8.8);
    const firstLine = `${index + 1}. ${bodyLines[0] ?? ""}`;
    const restLines = bodyLines.slice(1);
    const allDisplayLines = [firstLine, ...restLines.map((line) => `   ${line}`)];
    const paddingTop = 4;
    const paddingBottom = 3.5;
    const boxH = paddingTop + allDisplayLines.length * lineHeight + paddingBottom;

    y = pdfEnsureSpace(doc, y, boxH + 4, margin);
    pdfDrawShadowRect(doc, margin, y, contentWidth, boxH, index % 2 === 0 ? PDF_COLORS.sky : PDF_COLORS.coral);

    pdfSetText(doc, PDF_COLORS.black);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.8);
    allDisplayLines.forEach((line, lineIndex) => {
      doc.text(line, textX, y + paddingTop + 3 + lineIndex * lineHeight);
    });

    y += boxH + 4;
  });

  return y + 4;
}

function buildTestosteronaRecommendations(summary) {
  const tips = [];

  if (!summary.hasActivity) {
    tips.push(
      "Recorre las 5 pestañas: Síntesis, Obesidad, Músculo, Salud cardiovascular y Testosterona y envejecimiento."
    );
    return tips;
  }

  if ((summary.tabVisits.synthesis ?? 0) === 0) {
    tips.push(
      "Síntesis: repasa las 4 cajas — mevalonato, mitocondria (CYP11A1), andrógenos (3β-HSD2/17β-HSD3) y aromatización periférica."
    );
  }
  if (summary.synthesisStepsExplored < summary.synthesisTotalSteps) {
    tips.push(
      `Síntesis: explora los ${summary.synthesisTotalSteps} pasos del diagrama (llevas ${summary.synthesisStepsExplored}).`
    );
  }
  if ((summary.tabVisits.obesity ?? 0) === 0) {
    tips.push("Obesidad y testosterona: revisa cómo la obesidad altera cada paso de la síntesis (Grossmann 2018).");
  }
  if (summary.obesityStepsExplored < summary.obesityTotalSteps) {
    tips.push(
      `Obesidad: explora los ${summary.obesityTotalSteps} pasos del diagrama (llevas ${summary.obesityStepsExplored}).`
    );
  }
  if ((summary.tabVisits.muscle ?? 0) === 0) {
    tips.push("Testosterona y músculo: repasa AR, acción genómica, crosstalk PI3K/Akt y hipertrofia (Dubois 2011).");
  }
  if (summary.muscleStepsExplored < summary.muscleTotalSteps) {
    tips.push(
      `Músculo: explora los ${summary.muscleTotalSteps} pasos del diagrama (llevas ${summary.muscleStepsExplored}).`
    );
  }
  if ((summary.tabVisits.cardiovascular ?? 0) === 0) {
    tips.push(
      "Salud cardiovascular: repasa testosterona endógena, terapia de reemplazo, desenlaces CV y balance clínico (Thirumalai & Anawalt 2022)."
    );
  }
  if (summary.cardiovascularStepsExplored < summary.cardiovascularTotalSteps) {
    tips.push(
      `Salud cardiovascular: explora los ${summary.cardiovascularTotalSteps} pasos del diagrama (llevas ${summary.cardiovascularStepsExplored}).`
    );
  }
  if ((summary.tabVisits.aging ?? 0) === 0) {
    tips.push(
      "Envejecimiento: repasa eje HPT envejecido, hipogonadismo secundario vs primario y manejo clínico (Anawalt & Matsumoto 2022)."
    );
  }
  if (summary.agingStepsExplored < summary.agingTotalSteps) {
    tips.push(
      `Envejecimiento: explora los ${summary.agingTotalSteps} pasos del diagrama (llevas ${summary.agingStepsExplored}).`
    );
  }
  if (
    summary.tabsVisited >= 5 &&
    summary.synthesisStepsExplored >= summary.synthesisTotalSteps &&
    summary.obesityStepsExplored >= summary.obesityTotalSteps &&
    summary.muscleStepsExplored >= summary.muscleTotalSteps &&
    summary.cardiovascularStepsExplored >= summary.cardiovascularTotalSteps &&
    summary.agingStepsExplored >= summary.agingTotalSteps
  ) {
    tips.push("Excelente recorrido. Refuerza casos clínicos: sarcopenia, hipogonadismo, obesidad y decisión de terapia con testosterona.");
  }

  if (tips.length === 0) {
    tips.push("Sigue repasando las pestañas del módulo antes de la evaluación formal.");
  }

  return tips;
}

function pdfDrawMetricCard(doc, x, y, w, title, value, meta, fillRgb) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const metaLines = pdfMeasureLines(doc, meta, w - 8, 8.5);
  const h = Math.max(28, 20 + metaLines.length * 3.8);
  pdfDrawShadowRect(doc, x, y, w, h, fillRgb);
  const textColor = pdfTextColorForCard(fillRgb);
  const metaColor = pdfMetaColorForCard(fillRgb);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  pdfSetText(doc, textColor);
  doc.text(pdfSafeText(title), x + 3, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(pdfSafeText(String(value)), x + 3, y + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  pdfSetText(doc, metaColor);
  metaLines.forEach((line, index) => {
    doc.text(line, x + 3, y + 21 + index * 3.8);
  });

  return h;
}

function pdfDrawDrugModuleSection(doc, y, drugLabel, summary, margin, contentWidth) {
  y = pdfEnsureSpace(doc, y, 48, margin);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(pdfSafeText(drugLabel), margin, y);
  y += 8;

  const cardW = (contentWidth - 4) / 2;
  const tabsValue = `${summary.tabsVisited}/5`;
  const tabsMeta = `Sintesis ${summary.tabVisits.synthesis ?? 0} | Obesidad ${summary.tabVisits.obesity ?? 0} | Musculo ${summary.tabVisits.muscle ?? 0} | CV ${summary.tabVisits.cardiovascular ?? 0} | Envej ${summary.tabVisits.aging ?? 0}`;
  const muscleValue = `${summary.muscleStepsExplored}/${summary.muscleTotalSteps}`;
  const muscleMeta =
    summary.muscleStepsExplored === 0
      ? "Sin pasos explorados aun"
      : "Pasos del diagrama visitados";
  const cardiovascularValue = `${summary.cardiovascularStepsExplored}/${summary.cardiovascularTotalSteps}`;
  const cardiovascularMeta =
    summary.cardiovascularStepsExplored === 0
      ? "Sin pasos explorados aun"
      : "Pasos del diagrama CV visitados";

  const cardHeights = [
    pdfDrawMetricCard(doc, margin, y, cardW, "Pestanas visitadas", tabsValue, tabsMeta, PDF_COLORS.teal),
    pdfDrawMetricCard(
      doc,
      margin + cardW + 4,
      y,
      cardW,
      "Musculo explorado",
      muscleValue,
      muscleMeta,
      PDF_COLORS.yellow
    ),
  ];
  y += Math.max(...cardHeights) + 4;

  const row2Heights = [
    pdfDrawMetricCard(
      doc,
      margin,
      y,
      cardW,
      "Salud cardiovascular",
      cardiovascularValue,
      cardiovascularMeta,
      PDF_COLORS.coral
    ),
    pdfDrawMetricCard(
      doc,
      margin + cardW + 4,
      y,
      cardW,
      "Sintesis explorada",
      `${summary.synthesisStepsExplored}/${summary.synthesisTotalSteps}`,
      "Pasos del diagrama de sintesis",
      PDF_COLORS.lavender
    ),
  ];
  y += Math.max(...row2Heights) + 8;

  return y;
}

function downloadMetricsPdf() {
  const profile = getActiveUserProfile();
  if (!profile) {
    openRegisterModal();
    return;
  }

  const jsPdfLib = window.jspdf?.jsPDF;
  if (!jsPdfLib) {
    window.alert("No se pudo cargar el generador de PDF. Recarga la pagina e intenta de nuevo.");
    return;
  }

  const stats = readStats();
  const tSummary = summarizeDrugMetrics(stats.testosterona ?? createDefaultDrugStats());

  const hasProgress = tSummary.hasActivity;

  if (!hasProgress) {
    window.alert("Explora al menos una pestaña del módulo Testosterona antes de generar el reporte.");
    return;
  }

  const tTips = buildTestosteronaRecommendations(tSummary);
  const generatedAt = Date.now();

  const doc = new jsPdfLib({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  pdfPaintPageBackground(doc);

  pdfDrawShadowRect(doc, margin, margin, contentWidth, 34, PDF_COLORS.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text("Bioquímica Básica", margin + 4, margin + 11);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  pdfSetText(doc, PDF_COLORS.muted);
  doc.text("Reporte de progreso del alumno", margin + 4, margin + 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  pdfSetText(doc, PDF_COLORS.black);
  doc.text(profile.name, margin + 4, margin + 26);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Matricula: ${profile.studentId || "—"}`, margin + 4, margin + 31);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  pdfSetText(doc, PDF_COLORS.muted);
  const dateText = formatReportDate(generatedAt);
  doc.text(dateText, pageWidth - margin - 4, margin + 31, { align: "right" });

  let y = margin + 42;

  y = pdfDrawDrugModuleSection(doc, y, "Testosterona", tSummary, margin, contentWidth);
  y = pdfDrawRecommendationsSection(
    doc,
    y,
    "Recomendaciones de estudio | Testosterona",
    tTips,
    margin,
    contentWidth
  );

  y = pdfEnsureSpace(doc, y, 14, margin);
  const footerText =
    "Envia este PDF a tu profesor/a. Las recomendaciones se basan en tu desempeno en la app.";
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  const footerLines = pdfMeasureLines(doc, footerText, contentWidth - 8, 8.5);
  const footerH = 6 + footerLines.length * 4;
  pdfDrawShadowRect(doc, margin, y, contentWidth, footerH, PDF_COLORS.lavender);
  pdfSetText(doc, PDF_COLORS.black);
  footerLines.forEach((line, index) => {
    doc.text(line, margin + 4, y + 5 + index * 4);
  });

  const datePart = new Date(generatedAt).toISOString().slice(0, 10);
  const idPart = profile.studentId ? slugifyFilename(profile.studentId) : slugifyFilename(profile.name);
  doc.save(`BioquimicaBasica_${idPart}_${datePart}.pdf`);
}

function renderUserMetricsPanel() {
  const profile = getActiveUserProfile();
  if (!profile || !els.userMetricsStats) return;

  els.userMetricsSubtitle.textContent = profile.studentId
    ? `${profile.name} · Matrícula ${profile.studentId}`
    : profile.name;

  const stats = readStats();
  const t = stats.testosterona ?? createDefaultDrugStats();
  els.userMetricsStats.innerHTML = buildMetricsCardsHtml(t, "Testosterona");
}

function openUserMetricsPanel() {
  if (!isUserRegistered()) {
    openRegisterModal();
    return;
  }
  renderUserMetricsPanel();
  els.userMetricsOverlay.hidden = false;
  els.userMetricsOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.userMetricsClose?.focus();
}

function closeUserMetricsPanel() {
  els.userMetricsOverlay.hidden = true;
  els.userMetricsOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay?.hidden && els.userRegisterOverlay?.hidden && els.professorOverlay?.hidden) {
    document.body.style.overflow = "";
  }
}

function getDrugStats(drugId = activeDrugId) {
  const stats = readStats();
  if (!stats[drugId]) {
    stats[drugId] = createDefaultDrugStats();
  }
  return stats[drugId];
}

function saveDrugStats(drugId, drugStats) {
  const stats = readStats();
  stats[drugId] = drugStats;
  writeStats(stats);
}

function isPhysiologyUnlocked(drugId = activeDrugId) {
  const mod = DRUG_MODULES[drugId];
  if (!mod?.requiresPhysiologyLock) return true;
  return getDrugStats(drugId).lock.passed === true;
}

function formatDuration(ms) {
  if (!ms || ms < 0) return "—";
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resetInteractiveState() {
  lockSelectedTermId = null;
  lockMatches = {};
  if (els.lockFail) els.lockFail.hidden = true;
}

function loadDrugData(drugId) {
  const mod = DRUG_MODULES[drugId];
  PHARMA_DATA = mod.pharmaData;
  SYNTHESIS_DATA = mod.synthesis;
  OBESITY_DATA = mod.obesity;
  MUSCLE_DATA = mod.muscle;
  CARDIOVASCULAR_DATA = mod.cardiovascular;
  AGING_DATA = mod.aging;
  synthesisStepById = Object.fromEntries(SYNTHESIS_DATA.steps.map((s) => [s.id, s]));
  muscleStepById = Object.fromEntries(MUSCLE_DATA.steps.map((s) => [s.id, s]));
  cardiovascularStepById = Object.fromEntries(CARDIOVASCULAR_DATA.steps.map((s) => [s.id, s]));
  agingStepById = Object.fromEntries(AGING_DATA.steps.map((s) => [s.id, s]));
  activeSynthesisStepId = SYNTHESIS_DATA.steps[0].id;
  activeMuscleStepId = MUSCLE_DATA.steps[0].id;
  activeCardiovascularStepId = CARDIOVASCULAR_DATA.steps[0].id;
  activeAgingStepId = AGING_DATA.steps[0].id;
}

function getDiagramContext(viewId = activeView) {
  if (viewId === "aging") {
    return {
      viewId: "aging",
      data: AGING_DATA,
      stepMap: agingStepById,
      container: els.agingDiagram,
      layerKey: DIAGRAM_LAYERS.aging,
      getActiveStepId: () => activeAgingStepId,
      setActiveStepId: (id) => {
        activeAgingStepId = id;
      },
      statsKey: "agingSteps",
      showObesity: false,
    };
  }
  if (viewId === "cardiovascular") {
    return {
      viewId: "cardiovascular",
      data: CARDIOVASCULAR_DATA,
      stepMap: cardiovascularStepById,
      container: els.cardiovascularDiagram,
      layerKey: DIAGRAM_LAYERS.cardiovascular,
      getActiveStepId: () => activeCardiovascularStepId,
      setActiveStepId: (id) => {
        activeCardiovascularStepId = id;
      },
      statsKey: "cardiovascularSteps",
      showObesity: false,
    };
  }
  if (viewId === "muscle") {
    return {
      viewId: "muscle",
      data: MUSCLE_DATA,
      stepMap: muscleStepById,
      container: els.muscleDiagram,
      layerKey: DIAGRAM_LAYERS.muscle,
      getActiveStepId: () => activeMuscleStepId,
      setActiveStepId: (id) => {
        activeMuscleStepId = id;
      },
      statsKey: "muscleSteps",
      showObesity: false,
    };
  }
  return {
    viewId: viewId === "obesity" ? "obesity" : "synthesis",
    data: SYNTHESIS_DATA,
    stepMap: synthesisStepById,
    container: els.synthesisDiagram,
    layerKey: DIAGRAM_LAYERS.synthesis,
    getActiveStepId: () => activeSynthesisStepId,
    setActiveStepId: (id) => {
      activeSynthesisStepId = id;
    },
    statsKey: viewId === "obesity" ? "obesitySteps" : "synthesisSteps",
    showObesity: viewId === "obesity",
  };
}

function getMergedAbbreviations() {
  return {
    ...(SYNTHESIS_DATA?.abbreviations ?? {}),
    ...(OBESITY_DATA?.extraAbbreviations ?? {}),
  };
}

function getStudyEls(viewId) {
  if (viewId === "obesity") {
    return {
      step: els.obesityStudyStep,
      title: els.obesityStudyTitle,
      synthesisBullets: els.obesitySynthesisBullets,
      impactBullets: els.obesityImpactBullets,
      tipText: els.obesityStudyTipText,
      card: els.obesityStudyCard,
    };
  }
  if (viewId === "muscle") {
    return {
      step: els.muscleStudyStep,
      title: els.muscleStudyTitle,
      bullets: els.muscleStudyBullets,
      tipText: els.muscleStudyTipText,
      card: els.muscleStudyCard,
    };
  }
  if (viewId === "cardiovascular") {
    return {
      step: els.cardiovascularStudyStep,
      title: els.cardiovascularStudyTitle,
      bullets: els.cardiovascularStudyBullets,
      tipText: els.cardiovascularStudyTipText,
      card: els.cardiovascularStudyCard,
    };
  }
  if (viewId === "aging") {
    return {
      step: els.agingStudyStep,
      title: els.agingStudyTitle,
      bullets: els.agingStudyBullets,
      tipText: els.agingStudyTipText,
      card: els.agingStudyCard,
    };
  }
  return {
    step: els.synthesisStudyStep,
    title: els.synthesisStudyTitle,
    bullets: els.synthesisStudyBullets,
    tipText: els.synthesisStudyTipText,
    card: els.synthesisStudyCard,
  };
}

function getActiveStepId(viewId = activeView) {
  return getDiagramContext(viewId).getActiveStepId();
}

function getAbbreviationsForView(viewId) {
  if (viewId === "obesity") return getMergedAbbreviations();
  if (viewId === "muscle") return MUSCLE_DATA?.abbreviations ?? {};
  if (viewId === "cardiovascular") return CARDIOVASCULAR_DATA?.abbreviations ?? {};
  if (viewId === "aging") return AGING_DATA?.abbreviations ?? {};
  return SYNTHESIS_DATA?.abbreviations ?? {};
}

function resetStudyPanelAlign() {
  if (els.studyPanel) els.studyPanel.style.marginTop = "";
}

function alignStudyPanelWithNode(stepId, viewId = activeView) {
  if (!els.studyPanel || !els.diagramPanel) return;
  if (window.matchMedia("(max-width: 860px)").matches) {
    resetStudyPanelAlign();
    return;
  }

  const ctx = getDiagramContext(viewId);
  const node = ctx.container?.querySelector(`[data-id="${stepId}"]`);
  if (!node) {
    resetStudyPanelAlign();
    return;
  }

  const diagramRect = els.diagramPanel.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const panelHeight = els.studyPanel.offsetHeight;

  let offset = nodeRect.top - diagramRect.top;
  const maxOffset = Math.max(0, diagramRect.height - panelHeight);
  offset = Math.max(0, Math.min(offset, maxOffset));

  els.studyPanel.style.marginTop = `${offset}px`;

  requestAnimationFrame(() => {
    const panelRect = els.studyPanel.getBoundingClientRect();
    const refreshedNodeRect = node.getBoundingClientRect();
    const vh = window.innerHeight;
    const needsScroll =
      refreshedNodeRect.top < 72 ||
      refreshedNodeRect.bottom > vh - 24 ||
      panelRect.bottom > vh - 16;
    if (needsScroll) {
      node.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  });
}

function scheduleStudyPanelAlign(stepId, viewId = activeView) {
  requestAnimationFrame(() => {
    alignStudyPanelWithNode(stepId, viewId);
  });
}

function updateDiagramChrome() {
  const isObesity = activeView === "obesity";
  const isMuscle = activeView === "muscle";
  const isCardiovascular = activeView === "cardiovascular";
  const isAging = activeView === "aging";
  const isSecondaryDiagram = SECONDARY_VIEW_IDS.has(activeView);
  if (els.diagramHeading) {
    if (isAging) {
      els.diagramHeading.textContent = "Andrógenos, envejecimiento e hipogonadismo";
    } else if (isCardiovascular) {
      els.diagramHeading.textContent = "Testosterona y enfermedad cardiovascular";
    } else if (isMuscle) {
      els.diagramHeading.textContent = "Acción anabólica en músculo esquelético";
    } else if (isObesity) {
      els.diagramHeading.textContent = "Síntesis + señales de obesidad";
    } else {
      els.diagramHeading.textContent = "Ruta clínico-nutricional";
    }
  }
  if (els.diagramSource) {
    let source = SYNTHESIS_DATA?.source;
    if (isObesity) source = OBESITY_DATA?.source;
    if (isMuscle) source = MUSCLE_DATA?.source;
    if (isCardiovascular) source = CARDIOVASCULAR_DATA?.source;
    if (isAging) source = AGING_DATA?.source;
    if (source) {
      els.diagramSource.textContent = source.doi
        ? `${source.full} DOI: ${source.doi}`
        : source.full;
    }
  }
  if (els.synthesisDiagram) {
    els.synthesisDiagram.hidden = isSecondaryDiagram;
    els.synthesisDiagram.classList.toggle("diagram--obesity-mode", isObesity);
  }
  if (els.muscleDiagram) {
    els.muscleDiagram.hidden = !isMuscle;
  }
  if (els.cardiovascularDiagram) {
    els.cardiovascularDiagram.hidden = !isCardiovascular;
  }
  if (els.agingDiagram) {
    els.agingDiagram.hidden = !isAging;
  }
  if (els.synthesisStudyCard) els.synthesisStudyCard.hidden = isObesity || isSecondaryDiagram;
  if (els.obesityStudyCard) els.obesityStudyCard.hidden = !isObesity;
  if (els.muscleStudyCard) els.muscleStudyCard.hidden = !isMuscle;
  if (els.cardiovascularStudyCard) els.cardiovascularStudyCard.hidden = !isCardiovascular;
  if (els.agingStudyCard) els.agingStudyCard.hidden = !isAging;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAbbrevMatchers(dict) {
  const matchers = [];

  Object.entries(dict).forEach(([key, abbr]) => {
    matchers.push({ key, pattern: escapeRegex(abbr.acronym) });
  });

  Object.entries(ABBREV_ALIASES).forEach(([alias, key]) => {
    if (dict[key]) {
      matchers.push({ key, pattern: escapeRegex(alias) });
    }
  });

  return matchers.sort((a, b) => b.pattern.length - a.pattern.length);
}

function linkifyAbbreviations(text, dict) {
  const matchers = buildAbbrevMatchers(dict);
  if (matchers.length === 0) return escapeHtml(text);

  let output = text;
  const placeholders = [];

  matchers.forEach(({ key, pattern }) => {
    const isShort = pattern.length <= 4;
    const regex = new RegExp(
      `(?<![A-Za-z0-9/-])(${pattern})(?![A-Za-z0-9/-])`,
      isShort ? "g" : "gi"
    );

    output = output.replace(regex, (match) => {
      const token = `@@ABBR${placeholders.length}@@`;
      placeholders.push({ token, key, match });
      return token;
    });
  });

  output = escapeHtml(output);
  placeholders.forEach(({ token, key, match }) => {
    output = output.replace(
      token,
      `<button type="button" class="text-link-sigla" data-abbr-key="${key}">${escapeHtml(match)}</button>`
    );
  });

  return output;
}

function recordTabVisit(viewId) {
  if (!activeDrugId || !TAB_VIEW_IDS.includes(viewId)) return;
  const stats = getDrugStats();
  if (!stats.tabVisits) {
    stats.tabVisits = { synthesis: 0, obesity: 0, muscle: 0, cardiovascular: 0, aging: 0 };
  }
  stats.tabVisits[viewId] = (stats.tabVisits[viewId] ?? 0) + 1;
  saveDrugStats(activeDrugId, stats);
}

function updateStudyVisibility() {
  const mod = getActiveModule();
  const needsLock = mod?.requiresPhysiologyLock && !isPhysiologyUnlocked();
  if (els.physiologyLock) els.physiologyLock.hidden = !needsLock;
  if (els.studyContent) els.studyContent.hidden = needsLock;
  if (needsLock) renderPhysiologyLock();
}

function showDrugMenu() {
  activeDrugId = null;
  resetInteractiveState();
  closeModal();
  closeProfessorPanel();
  closeUserMetricsPanel();
  closeRegisterModal();
  updateUserPanelUI();
  els.drugMenu.hidden = false;
  els.appStudy.hidden = true;
  document.title = "Bioquímica Básica — Temas";
}

function selectDrug(drugId) {
  if (!DRUG_MODULES[drugId]) return;
  if (!isUserRegistered()) {
    openRegisterModal();
    return;
  }

  activeDrugId = drugId;
  loadDrugData(drugId);
  resetInteractiveState();

  els.drugMenu.hidden = true;
  els.appStudy.hidden = false;

  updateStudyVisibility();
  renderDrugContent();
  if (isPhysiologyUnlocked()) {
    activeView = "";
    switchView("synthesis");
  }

  document.title = `Bioquímica Básica — ${PHARMA_DATA.drug.title}`;
}

function unlockStudyAfterLock() {
  updateStudyVisibility();
  renderDrugContent();
  switchView("synthesis");
}

function renderDrugContent() {
  if (els.studyContent?.hidden) return;
  renderHeader();
  updateDiagramChrome();
  renderAllDiagrams();
  renderStudyCard(activeView, getActiveStepId());
  scheduleStudyPanelAlign(getActiveStepId(), activeView);
}

function init() {
  serverSyncEnabled = getApiBase() !== null;
  loadActiveUser();
  initServerConnection().finally(() => {
    updateUserPanelUI();
  });
  showDrugMenu();
  bindGlobalEvents();
}

function renderHeader() {
  els.drugTitle.textContent = PHARMA_DATA.drug.title;
  els.drugSubtitle.textContent = PHARMA_DATA.drug.subtitle;
  updateModuleBadge();
}

function updateModuleBadge() {
  els.moduleBadge.textContent = VIEW_LABELS[activeView] ?? "Módulo activo";
}

function switchView(viewId) {
  if (viewId === activeView) return;
  if (els.studyContent?.hidden) return;
  if (!TAB_VIEW_IDS.includes(viewId)) return;

  activeView = viewId;
  recordTabVisit(viewId);

  els.viewTabs.forEach((tab) => {
    const active = tab.dataset.view === viewId;
    tab.classList.toggle("view-tab--active", active);
    tab.setAttribute("aria-selected", active ? "true" : "false");
    tab.tabIndex = active ? 0 : -1;
  });

  updateModuleBadge();
  updateDiagramChrome();
  resetStudyPanelAlign();
  renderDiagram();
  renderStudyCard(viewId, getActiveStepId(viewId));
  scheduleStudyPanelAlign(getActiveStepId(viewId), viewId);
  requestAnimationFrame(() => drawConnections());
}

/* ── Diagramas interactivos ── */
function createNode(step, ctx) {
  const showObesity = ctx.showObesity;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "node";
  btn.dataset.id = step.id;
  btn.dataset.color = step.color;
  btn.setAttribute("role", "tab");
  btn.setAttribute("aria-selected", step.id === ctx.getActiveStepId() ? "true" : "false");
  btn.setAttribute(
    "aria-label",
    showObesity && step.obesitySignal
      ? `${step.label}: ${step.sublabel}. Obesidad: ${step.obesitySignal}`
      : `${step.label}: ${step.sublabel}`
  );

  const obesitySignalHtml =
    showObesity && step.obesitySignal
      ? `<span class="node__obesity-signal" aria-hidden="true">${escapeHtml(step.obesitySignal)}</span>`
      : "";

  btn.innerHTML = `
    <div class="node__shape node__shape--${step.shape}"></div>
    <span class="node__label-box"><span class="node__label">${step.label}</span></span>
    <span class="node__sublabel">${step.sublabel}</span>
    ${obesitySignalHtml}
  `;

  btn.addEventListener("click", () => selectDiagramStep(step.id));
  return btn;
}

function renderDiagram(viewId = activeView) {
  const ctx = getDiagramContext(viewId);
  if (!ctx.data?.diagram || !ctx.container) return;

  ctx.container.innerHTML = "";

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("connections-layer");
  svg.setAttribute("aria-hidden", "true");
  ctx.container.appendChild(svg);
  connectionsLayers.set(ctx.layerKey, svg);

  const rowsWrapper = document.createElement("div");
  rowsWrapper.className = "diagram__rows";

  ctx.data.diagram.rows.forEach((rowIds) => {
    const row = document.createElement("div");
    row.className = "diagram__row";
    rowIds.forEach((id) => {
      const step = ctx.stepMap[id];
      if (step) row.appendChild(createNode(step, ctx));
    });
    rowsWrapper.appendChild(row);
  });

  ctx.container.appendChild(rowsWrapper);
  if (viewId === activeView) {
    updateActiveNode();
  }
  requestAnimationFrame(() => {
    if (viewId === activeView) drawConnections();
  });
}

function renderAllDiagrams() {
  renderDiagram("synthesis");
  renderDiagram("muscle");
  renderDiagram("cardiovascular");
  renderDiagram("aging");
}

function drawConnections() {
  const ctx = getDiagramContext();
  const svg = connectionsLayers.get(ctx.layerKey);
  const container = ctx.container;
  if (!svg || !container || !ctx.data?.diagram) return;

  const width = container.offsetWidth;
  const height = container.offsetHeight;
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.replaceChildren();

  const containerRect = container.getBoundingClientRect();

  ctx.data.diagram.connections.forEach(({ from, to, label }) => {
    const fromNode = container.querySelector(`[data-id="${from}"]`);
    const toNode = container.querySelector(`[data-id="${to}"]`);
    if (!fromNode || !toNode) return;

    const fRect = fromNode.getBoundingClientRect();
    const tRect = toNode.getBoundingClientRect();
    const x1 = fRect.left + fRect.width / 2 - containerRect.left;
    const y1 = fRect.bottom - containerRect.top;
    const x2 = tRect.left + tRect.width / 2 - containerRect.left;
    const y2 = tRect.top - containerRect.top;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#18181B");
    path.setAttribute("stroke-width", "4");
    path.setAttribute("stroke-linecap", "square");
    svg.appendChild(path);

    if (label) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const padX = 8;
      const textLen = label.length * 7 + padX * 2;
      const textH = 22;

      const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bg.setAttribute("x", String(midX - textLen / 2));
      bg.setAttribute("y", String(midY - textH / 2));
      bg.setAttribute("width", String(textLen));
      bg.setAttribute("height", String(textH));
      bg.setAttribute("rx", "11");
      bg.setAttribute("class", "conn-label__bg");
      bg.setAttribute("fill", "#FFFFFF");
      bg.setAttribute("stroke", "#18181B");
      bg.setAttribute("stroke-width", "2");
      svg.appendChild(bg);

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(midX));
      text.setAttribute("y", String(midY + 4));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("class", "conn-label__text");
      text.setAttribute("fill", "#18181B");
      text.setAttribute("font-size", "11");
      text.setAttribute("font-weight", "600");
      text.setAttribute("font-family", "Outfit, sans-serif");
      text.textContent = label;
      svg.appendChild(text);
    }
  });
}

function updateActiveNode() {
  const ctx = getDiagramContext();
  const container = ctx.container;
  if (!container) return;
  container.querySelectorAll(".node").forEach((node) => {
    const isActive = node.dataset.id === ctx.getActiveStepId();
    node.classList.toggle("node--active", isActive);
    node.setAttribute("aria-selected", isActive ? "true" : "false");
  });
}

function selectDiagramStep(stepId) {
  const ctx = getDiagramContext();
  ctx.setActiveStepId(stepId);
  if (activeDrugId) {
    const stats = getDrugStats();
    if (!stats[ctx.statsKey]) stats[ctx.statsKey] = [];
    if (!stats[ctx.statsKey].includes(stepId)) {
      stats[ctx.statsKey].push(stepId);
      saveDrugStats(activeDrugId, stats);
    }
  }
  updateActiveNode();
  renderStudyCard(activeView, stepId);
  scheduleStudyPanelAlign(stepId, activeView);
  requestAnimationFrame(() => drawConnections());
}

function renderStudyCard(viewId, stepId) {
  const ctx = getDiagramContext(viewId);
  const step = ctx.stepMap[stepId];
  const studyEls = getStudyEls(viewId);
  if (!step || !studyEls.step || !ctx.data?.steps) return;

  const dict = getAbbreviationsForView(viewId);
  const idx = ctx.data.steps.findIndex((s) => s.id === stepId) + 1;
  studyEls.step.textContent = `Paso ${idx} de ${ctx.data.steps.length}`;
  studyEls.title.textContent = step.title;

  if (viewId === "obesity") {
    studyEls.synthesisBullets.innerHTML = step.bullets
      .map((b) => `<li>${linkifyAbbreviations(b, dict)}</li>`)
      .join("");
    studyEls.impactBullets.innerHTML = (step.obesityBullets ?? [])
      .map((b) => `<li>${linkifyAbbreviations(b, dict)}</li>`)
      .join("");
    studyEls.tipText.innerHTML = linkifyAbbreviations(step.obesityTip ?? step.clinicalTip, dict);
  } else {
    studyEls.bullets.innerHTML = step.bullets
      .map((b) => `<li>${linkifyAbbreviations(b, dict)}</li>`)
      .join("");
    studyEls.tipText.innerHTML = linkifyAbbreviations(step.clinicalTip, dict);
  }

  studyEls.card.style.animation = "none";
  void studyEls.card.offsetWidth;
  studyEls.card.style.animation = "";
  scheduleStudyPanelAlign(stepId, viewId);
}

/* ── Candado fisiológico ── */
function renderPhysiologyLock() {
  const lockData = getActiveModule()?.physiologyLock;
  if (!lockData || !els.physiologyLock) return;

  lockSelectedTermId = null;
  lockMatches = {};
  els.lockFail.hidden = true;
  els.lockTitle.textContent = lockData.title;
  els.lockIntro.innerHTML = linkifyAbbreviations(lockData.intro, lockData.abbreviations);

  const dict = lockData.abbreviations;
  const shuffledDefs = shuffleArray(lockData.pairs);

  els.lockTerms.innerHTML = lockData.pairs
    .map(
      (pair) => `
      <button type="button" class="match-item" data-term-id="${pair.id}">
        <span class="match-item__title">${linkifyAbbreviations(pair.term, dict)}</span>
      </button>
    `
    )
    .join("");

  els.lockDefinitions.innerHTML = shuffledDefs
    .map(
      (pair) => `
      <button type="button" class="match-item match-item--def" data-def-id="${pair.id}">
        <span class="match-item__text">${linkifyAbbreviations(pair.definition, dict)}</span>
      </button>
    `
    )
    .join("");

  updateLockBoardUI();
}

function updateLockBoardUI() {
  els.lockTerms?.querySelectorAll(".match-item").forEach((btn) => {
    const id = btn.dataset.termId;
    const matchedDefId = lockMatches[id];
    btn.classList.toggle("match-item--selected", id === lockSelectedTermId);
    btn.classList.toggle("match-item--paired", Boolean(matchedDefId));
    btn.disabled = Boolean(matchedDefId);
  });

  const usedDefIds = new Set(Object.values(lockMatches));
  els.lockDefinitions?.querySelectorAll(".match-item").forEach((btn) => {
    const id = btn.dataset.defId;
    btn.classList.toggle("match-item--paired", usedDefIds.has(id));
    btn.disabled = usedDefIds.has(id);
  });

  const total = getActiveModule()?.physiologyLock?.pairs?.length ?? 0;
  const done = Object.keys(lockMatches).length;
  els.lockHint.textContent =
    done === total
      ? "Todos emparejados. Pulsa «Comprobar emparejamientos»."
      : "Selecciona un concepto y luego su función correspondiente.";
}

function handleLockTermClick(termId) {
  if (lockMatches[termId]) return;
  lockSelectedTermId = termId;
  updateLockBoardUI();
}

function handleLockDefClick(defId) {
  if (!lockSelectedTermId) return;
  if (Object.values(lockMatches).includes(defId)) return;
  lockMatches[lockSelectedTermId] = defId;
  lockSelectedTermId = null;
  updateLockBoardUI();
}

function submitPhysiologyLock() {
  const mod = getActiveModule();
  const lockData = mod?.physiologyLock;
  if (!lockData) return;

  const stats = getDrugStats();
  const total = lockData.pairs.length;
  const matched = Object.keys(lockMatches).length;

  if (matched < total) {
    els.lockFail.hidden = false;
    stats.lock.attempts += 1;
    saveDrugStats(activeDrugId, stats);
    return;
  }

  const allCorrect = lockData.pairs.every((pair) => lockMatches[pair.id] === pair.id);
  if (!allCorrect) {
    els.lockFail.hidden = false;
    stats.lock.attempts += 1;
    saveDrugStats(activeDrugId, stats);
    return;
  }

  stats.lock.attempts += 1;
  stats.lock.passed = true;
  stats.lock.passedAt = Date.now();
  saveDrugStats(activeDrugId, stats);
  els.lockFail.hidden = true;
  unlockStudyAfterLock();
}

function retryPhysiologyLock() {
  lockSelectedTermId = null;
  lockMatches = {};
  els.lockFail.hidden = true;
  renderPhysiologyLock();
}

/* ── Panel del profesor ── */
function renderProfessorCards(registry, store) {
  const userIds = Object.keys(registry.users);

  if (userIds.length === 0) {
    els.professorStats.innerHTML = `
      <article class="professor-card professor-card--lavender">
        <h4 class="professor-card__title">Sin alumnos registrados</h4>
        <p class="professor-card__meta">Los datos aparecerán cuando los alumnos entren con su matrícula.</p>
      </article>
    `;
    return;
  }

  els.professorStats.innerHTML = userIds
    .map((userId) => {
      const profile = registry.users[userId];
      const userStats = store[userId] ?? {};
      const t = userStats.testosterona ?? createDefaultDrugStats();
      const summary = summarizeDrugMetrics(t);
      const idLine = profile.studentId ? ` · ${profile.studentId}` : "";
      return `
        <article class="professor-card professor-card--yellow">
          <h4 class="professor-card__title">${escapeHtml(profile.name)}${escapeHtml(idLine)}</h4>
          <p class="professor-card__value">${summary.tabsVisited}/5</p>
          <p class="professor-card__meta">
            Síntesis ${summary.synthesisStepsExplored}/${summary.synthesisTotalSteps} ·
            Obesidad ${summary.obesityStepsExplored}/${summary.obesityTotalSteps} ·
            Músculo ${summary.muscleStepsExplored}/${summary.muscleTotalSteps} ·
            CV ${summary.cardiovascularStepsExplored}/${summary.cardiovascularTotalSteps} ·
            Envej ${summary.agingStepsExplored}/${summary.agingTotalSteps}
          </p>
        </article>
      `;
    })
    .join("");
}

function updateProfessorSubtitle() {
  if (!els.professorSubtitle) return;
  els.professorSubtitle.textContent = serverSyncEnabled
    ? "Datos del servidor · todos los alumnos del curso"
    : "Datos de este navegador · activa el servidor para ver a todos";
}

function setProfessorAuthVisible(visible) {
  if (!els.professorAuth) return;
  els.professorAuth.hidden = !visible;
  if (visible) {
    els.professorStats.innerHTML = "";
    els.professorKeyInput?.focus();
  }
}

async function loadProfessorPanelData() {
  updateProfessorSubtitle();

  if (serverSyncEnabled && !professorApiKey) {
    setProfessorAuthVisible(true);
    return;
  }

  setProfessorAuthVisible(false);

  if (serverSyncEnabled) {
    try {
      const data = await fetchProfessorDataFromServer(professorApiKey);
      renderProfessorCards({ users: data.users }, data.stats);
      return;
    } catch (error) {
      professorApiKey = "";
      sessionStorage.removeItem(PROFESSOR_KEY_STORAGE);
      els.professorStats.innerHTML = `
        <article class="professor-card professor-card--lavender">
          <h4 class="professor-card__title">No se pudo cargar</h4>
          <p class="professor-card__meta">${escapeHtml(error.message || "Error de conexión")}</p>
        </article>
      `;
      setProfessorAuthVisible(true);
      return;
    }
  }

  renderProfessorCards(readUsersRegistry(), readAllStatsStore());
}

async function handleProfessorAuthSubmit(event) {
  event.preventDefault();
  const key = els.professorKeyInput?.value?.trim() ?? "";
  if (!key) return;

  professorApiKey = key;
  sessionStorage.setItem(PROFESSOR_KEY_STORAGE, key);
  await loadProfessorPanelData();
}

async function renderProfessorPanel() {
  await loadProfessorPanelData();
}

function openProfessorPanel() {
  renderProfessorPanel();
  els.professorOverlay.hidden = false;
  els.professorOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (serverSyncEnabled && !professorApiKey) {
    els.professorKeyInput?.focus();
  } else {
    els.professorClose.focus();
  }
}

function closeProfessorPanel() {
  els.professorOverlay.hidden = true;
  els.professorOverlay.setAttribute("aria-hidden", "true");
  if (els.modalOverlay.hidden) document.body.style.overflow = "";
}

function getAbbrevDictionary(viewId = activeView) {
  if (viewId === "obesity") return getMergedAbbreviations();
  if (viewId === "muscle") return MUSCLE_DATA?.abbreviations ?? null;
  if (viewId === "cardiovascular") return CARDIOVASCULAR_DATA?.abbreviations ?? null;
  if (viewId === "aging") return AGING_DATA?.abbreviations ?? null;
  if (viewId === "synthesis") return SYNTHESIS_DATA?.abbreviations ?? null;
  if (viewId === "lock") return getActiveModule()?.physiologyLock?.abbreviations ?? null;
  return null;
}

function getAbbrevFromKey(key, viewId = activeView) {
  return getAbbrevDictionary(viewId)?.[key] ?? null;
}

function handleSiglaClick(event) {
  const btn = event.target.closest(".text-link-sigla");
  if (!btn) return;

  let viewId = activeView;
  if (btn.closest("#synthesis-study-card")) viewId = "synthesis";
  if (btn.closest("#obesity-study-card")) viewId = "obesity";
  if (btn.closest("#muscle-study-card")) viewId = "muscle";
  if (btn.closest("#cardiovascular-study-card")) viewId = "cardiovascular";
  if (btn.closest("#aging-study-card")) viewId = "aging";
  if (btn.closest("#physiology-lock")) viewId = "lock";

  const abbr = getAbbrevFromKey(btn.dataset.abbrKey, viewId);
  if (abbr) openModal(abbr);
}

/* ── Modal ── */
function openModal(abbr) {
  lastFocusedElement = document.activeElement;
  els.modalAcronym.textContent = abbr.acronym;
  els.modalFullName.textContent = abbr.fullName;
  els.modalBody.innerHTML = `
    <p><strong>¿Qué es?</strong> ${escapeHtml(abbr.what)}</p>
    ${abbr.reaction ? `<p><strong>Reacción:</strong> ${escapeHtml(abbr.reaction)}</p>` : ""}
    <p><strong>¿Qué hace aquí?</strong> ${escapeHtml(abbr.role)}</p>
  `;
  els.modalOverlay.hidden = false;
  els.modalOverlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  els.modalClose.focus();
}

function closeModal() {
  els.modalOverlay.hidden = true;
  els.modalOverlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

function bindGlobalEvents() {
  els.modalClose.addEventListener("click", closeModal);
  els.modalOverlay.addEventListener("click", (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });
  els.professorClose?.addEventListener("click", closeProfessorPanel);
  els.professorAuth?.addEventListener("submit", handleProfessorAuthSubmit);
  els.professorOverlay?.addEventListener("click", (e) => {
    if (e.target === els.professorOverlay) closeProfessorPanel();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!els.userRegisterOverlay.hidden) closeRegisterModal();
      else if (!els.userMetricsOverlay.hidden) closeUserMetricsPanel();
      else if (!els.professorOverlay.hidden) closeProfessorPanel();
      else if (!els.modalOverlay.hidden) closeModal();
    }
    if (e.shiftKey && (e.key === "P" || e.key === "p")) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      if (els.professorOverlay.hidden) openProfessorPanel();
      else closeProfessorPanel();
    }
  });
  els.viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.dataset.view));
  });
  els.drugPickers.forEach((btn) => {
    btn.addEventListener("click", () => selectDrug(btn.dataset.drug));
  });
  els.btnBackMenu.addEventListener("click", showDrugMenu);
  els.btnOpenRegister?.addEventListener("click", openRegisterModal);
  els.btnMyMetrics?.addEventListener("click", openUserMetricsPanel);
  els.btnDownloadMetricsPdf?.addEventListener("click", downloadMetricsPdf);
  els.btnSwitchUser?.addEventListener("click", switchUser);
  els.registerForm?.addEventListener("submit", handleRegisterSubmit);
  els.registerDeviceUsers?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-resume-user]");
    if (btn) resumeExistingUser(btn.dataset.resumeUser);
  });
  els.registerClose?.addEventListener("click", closeRegisterModal);
  els.userRegisterOverlay?.addEventListener("click", (e) => {
    if (e.target === els.userRegisterOverlay) closeRegisterModal();
  });
  els.userMetricsClose?.addEventListener("click", closeUserMetricsPanel);
  els.userMetricsOverlay?.addEventListener("click", (e) => {
    if (e.target === els.userMetricsOverlay) closeUserMetricsPanel();
  });
  document.addEventListener("click", handleSiglaClick);
  window.addEventListener("resize", () => {
    drawConnections();
    scheduleStudyPanelAlign(getActiveStepId(), activeView);
  });

  els.lockSubmit?.addEventListener("click", submitPhysiologyLock);
  els.lockRetry?.addEventListener("click", retryPhysiologyLock);
  els.lockTerms?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-term-id]");
    if (btn) handleLockTermClick(btn.dataset.termId);
  });
  els.lockDefinitions?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-def-id]");
    if (btn) handleLockDefClick(btn.dataset.defId);
  });
}

init();
