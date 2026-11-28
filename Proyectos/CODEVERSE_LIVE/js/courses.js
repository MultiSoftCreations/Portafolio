// CODEVERSE — Cursos y progreso (bloqueo de lecciones)
// MultiSoftCreations

import { onUserChanged, getCurrentUser, hasValidAITunnelSession, getAITunnelInfo } from "./auth.js";
import { gatePage } from "./site-access.js";
import { getCourseProgress, saveCourseProgress } from "./projects.js";


/**
 * Raíz de CODEVERSE_LIVE en la URL (funciona desde / y desde /Cursos/HTML/).
 */
export function getLiveRoot() {
  const path = window.location.pathname || "/";
  const cursos = path.indexOf("/Cursos/");
  if (cursos >= 0) return path.slice(0, cursos + 1);
  const last = path.lastIndexOf("/");
  return last >= 0 ? path.slice(0, last + 1) : "/";
}

/** URL absoluta en el sitio a partir de una ruta relativa a la raíz LIVE */
export function liveUrl(rel) {
  const clean = String(rel || "").replace(/^\/+/, "");
  return getLiveRoot() + clean;
}


/**
 * Carga el manifiesto de un curso.
 * @param {string} courseId ej. "html"
 * @param {string} basePath ruta relativa a la carpeta del curso
 */
export async function loadCourse(courseId, basePath = `Cursos/${courseId.toUpperCase()}`) {
  // Rutas siempre desde la raíz de CODEVERSE_LIVE (no relativas a la lección)
  const pathMap = {
    html: "Cursos/HTML/course.json",
    css: "Cursos/CSS/course.json",
    js: "Cursos/JS/course.json",
    python: "Cursos/Python/course.json"
  };
  const rel = pathMap[courseId] || `${basePath}/course.json`;
  const url = liveUrl(rel) + "?t=" + Date.now();
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el curso: " + courseId + " (" + url + ")");
  return res.json();
}

/**
 * Progreso por defecto
 */
export function emptyProgress() {
  return {
    completedLessons: [],
    currentLessonId: null,
    updatedAt: null
  };
}

/** Clave de progreso: usuarios normales vs sesión de túnel IA (aislada) */
function progressStorageKey(courseId) {
  if (hasValidAITunnelSession()) {
    const info = getAITunnelInfo();
    const tag = (info && info.code) ? String(info.code) : "ai";
    return "codeverse_progress_ai_" + tag + "_" + courseId;
  }
  return "codeverse_progress_" + courseId;
}

/**
 * Obtiene progreso del usuario (nube). IA del túnel y sin login usan almacenamiento local.
 */
export async function loadProgress(courseId) {
  const localKey = progressStorageKey(courseId);
  let local = emptyProgress();
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) local = { ...emptyProgress(), ...JSON.parse(raw) };
  } catch (_) {}

  const user = getCurrentUser();
  if (!user) {
    if (hasValidAITunnelSession()) return { ...local, source: "ai_tunnel" };
    return { ...local, source: "local" };
  }

  try {
    const remote = await getCourseProgress(courseId);
    if (!remote) return { ...local, source: "local" };
    const merged = {
      completedLessons: Array.isArray(remote.completedLessons)
        ? remote.completedLessons
        : local.completedLessons || [],
      currentLessonId: remote.currentLessonId || local.currentLessonId || null,
      updatedAt: remote.updatedAt || null,
      source: "cloud"
    };
    try {
      localStorage.setItem(localKey, JSON.stringify(merged));
    } catch (_) {}
    return merged;
  } catch (err) {
    console.warn("[CODEVERSE] Progreso nube no disponible:", err);
    return { ...local, source: "local" };
  }
}

/**
 * Guarda progreso en local + nube (si hay sesión)
 */
export async function persistProgress(courseId, progress) {
  const payload = {
    completedLessons: progress.completedLessons || [],
    currentLessonId: progress.currentLessonId || null
  };
  const localKey = progressStorageKey(courseId);
  try {
    localStorage.setItem(localKey, JSON.stringify(payload));
  } catch (_) {}

  // Túnel IA: solo local/sesión (no nube Firebase de usuarios)
  if (hasValidAITunnelSession() && !getCurrentUser()) {
    return { ...payload, source: "ai_tunnel" };
  }

  const user = getCurrentUser();
  if (!user) return { ...payload, source: "local" };

  await saveCourseProgress(courseId, payload);
  return { ...payload, source: "cloud" };
}

/**
 * Índice de una lección en el curso (0-based). -1 si no existe.
 */
export function lessonIndex(course, lessonId) {
  return (course.lessons || []).findIndex((l) => l.id === lessonId);
}

/**
 * ¿La lección está desbloqueada?
 * Regla: la primera siempre; las demás requieren que la anterior esté completada.
 */
export function isLessonUnlocked(course, progress, lessonId) {
  const lessons = course.lessons || [];
  const idx = lessonIndex(course, lessonId);
  if (idx < 0) return false;
  if (idx === 0) return true;
  const completed = new Set(progress.completedLessons || []);
  // Todas las anteriores deben estar completadas
  for (let i = 0; i < idx; i++) {
    if (!completed.has(lessons[i].id)) return false;
  }
  return true;
}

export function isLessonCompleted(progress, lessonId) {
  return (progress.completedLessons || []).includes(lessonId);
}

/**
 * Marca lección como completada y avanza currentLessonId
 */
export async function completeLesson(course, lessonId) {
  const progress = await loadProgress(course.id);
  const completed = new Set(progress.completedLessons || []);
  completed.add(lessonId);

  const idx = lessonIndex(course, lessonId);
  const next = course.lessons[idx + 1];
  const updated = {
    completedLessons: Array.from(completed),
    currentLessonId: next ? next.id : lessonId
  };
  return persistProgress(course.id, updated);
}

/**
 * Protege una página de lección. Si no está desbloqueada, redirige al curso.
 * @returns {{ course, progress, lesson }}
 */
export async function guardLessonPage(courseId, lessonId) {
  const allowed = await gatePage("lesson", { courseId, lessonId });
  if (!allowed) {
    const err = new Error("access_blocked");
    throw err;
  }

  // Esperar auth (o null)
  const user = await new Promise((resolve) => {
    const unsub = onUserChanged((u) => {
      unsub();
      resolve(u);
    });
  });

  const aiTunnel = hasValidAITunnelSession();

  // Usuarios normales: login obligatorio. Túnel IA: puede entrar a probar cursos.
  if (!user && !aiTunnel) {
    const parts = window.location.pathname.split("/");
    const idx = parts.lastIndexOf("Cursos");
    const rel = idx >= 0 ? parts.slice(idx).join("/") : "academy.html";
    window.location.replace(liveUrl("login.html") + "?redirect=" + encodeURIComponent(rel + window.location.search));
    throw new Error("login_required");
  }

  const course = await loadCourse(courseId);
  const progress = await loadProgress(courseId);

  // Misma regla de seguridad para todos (usuario e IA): no saltar lecciones
  if (!isLessonUnlocked(course, progress, lessonId)) {
    alert("Esta lección aún está bloqueada. Completa las anteriores para continuar.");
    window.location.replace(liveUrl("academy.html") + "?course=" + encodeURIComponent(courseId));
    throw new Error("lesson_locked");
  }

  const lesson = (course.lessons || []).find((l) => l.id === lessonId);
  return { course, progress, lesson, user, aiTunnel };
}

export function courseListPath() {
  return "academy.html";
}
