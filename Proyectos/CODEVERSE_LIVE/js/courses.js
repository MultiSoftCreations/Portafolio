// CODEVERSE — Cursos y progreso (bloqueo de lecciones)
// MultiSoftCreations

import { onUserChanged, getCurrentUser } from "./auth.js";
import { getCourseProgress, saveCourseProgress } from "./projects.js";

/**
 * Carga el manifiesto de un curso.
 * @param {string} courseId ej. "html"
 * @param {string} basePath ruta relativa a la carpeta del curso
 */
export async function loadCourse(courseId, basePath = `Cursos/${courseId.toUpperCase()}`) {
  // HTML está en Cursos/HTML (mayúsculas)
  const pathMap = {
    html: "Cursos/HTML/course.json"
  };
  const url = pathMap[courseId] || `${basePath}/course.json`;
  const res = await fetch(url + "?t=" + Date.now(), { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar el curso: " + courseId);
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

/**
 * Obtiene progreso del usuario (nube). Si no hay sesión, usa localStorage como respaldo.
 */
export async function loadProgress(courseId) {
  const localKey = "codeverse_progress_" + courseId;
  let local = emptyProgress();
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) local = { ...emptyProgress(), ...JSON.parse(raw) };
  } catch (_) {}

  const user = getCurrentUser();
  if (!user) return { ...local, source: "local" };

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
  const localKey = "codeverse_progress_" + courseId;
  try {
    localStorage.setItem(localKey, JSON.stringify(payload));
  } catch (_) {}

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
  // Esperar auth (o null)
  const user = await new Promise((resolve) => {
    const unsub = onUserChanged((u) => {
      unsub();
      resolve(u);
    });
  });

  // Exigir login para cursos (progreso en nube)
  if (!user) {
    // Ruta relativa desde la raíz de CODEVERSE_LIVE (para login.html?redirect=)
    const parts = window.location.pathname.split("/");
    const idx = parts.lastIndexOf("Cursos");
    const rel = idx >= 0 ? parts.slice(idx).join("/") : "academy.html";
    window.location.replace("../../login.html?redirect=" + encodeURIComponent(rel + window.location.search));
    throw new Error("login_required");
  }

  const course = await loadCourse(courseId);
  const progress = await loadProgress(courseId);

  if (!isLessonUnlocked(course, progress, lessonId)) {
    alert("Esta lección aún está bloqueada. Completa las anteriores para continuar.");
    window.location.replace("../../academy.html?course=" + encodeURIComponent(courseId));
    throw new Error("lesson_locked");
  }

  const lesson = (course.lessons || []).find((l) => l.id === lessonId);
  return { course, progress, lesson, user };
}

export function courseListPath() {
  return "academy.html";
}
