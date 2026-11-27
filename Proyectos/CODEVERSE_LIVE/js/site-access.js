// CODEVERSE — Control de acceso / mantenimiento (nube)
// Los bloqueos NO afectan al túnel IA.
// MultiSoftCreations

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { getCurrentUser, hasValidAITunnelSession, onUserChanged } from "./auth.js";

const DEFAULT = {
  globalLock: false,
  globalMessage: "Estamos en mantenimiento. Vuelve pronto.",
  lockCourses: false,
  lockCoursesMessage: "Los cursos están temporalmente no disponibles.",
  lockedCourseIds: [],
  lockedLessons: {},
  lockMiniEditor: false,
  lockLiveEditor: false,
  editorsMessage: "El editor está en mantenimiento.",
  updatedAt: null,
  updatedBy: null
};

let cache = null;
let cacheAt = 0;
const CACHE_MS = 15000;

export function defaultSiteAccess() {
  return { ...DEFAULT, lockedCourseIds: [], lockedLessons: {} };
}

export async function fetchSiteAccess(force = false) {
  const now = Date.now();
  if (!force && cache && now - cacheAt < CACHE_MS) return cache;
  try {
    const ref = doc(db, "config", "siteAccess");
    const snap = await Promise.race([
      getDoc(ref),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout siteAccess")), 8000))
    ]);
    if (!snap.exists()) {
      cache = defaultSiteAccess();
    } else {
      cache = { ...defaultSiteAccess(), ...snap.data() };
      if (!Array.isArray(cache.lockedCourseIds)) cache.lockedCourseIds = [];
      if (!cache.lockedLessons || typeof cache.lockedLessons !== "object") cache.lockedLessons = {};
    }
  } catch (err) {
    console.warn("[CODEVERSE] No se pudo leer siteAccess:", err);
    cache = defaultSiteAccess();
  }
  cacheAt = now;
  return cache;
}

export function clearSiteAccessCache() {
  cache = null;
  cacheAt = 0;
}

export function isLockExempt() {
  return hasValidAITunnelSession();
}

function normalizeMsg(msg, fallback) {
  const t = (msg || "").trim();
  return t || fallback;
}

/**
 * Evalúa si la página actual debe bloquearse.
 * @param {"global"|"courses"|"course"|"lesson"|"mini"|"live"} scope
 * @param {{ courseId?: string, lessonId?: string }} meta
 */
export async function evaluateAccess(scope, meta = {}) {
  if (isLockExempt()) {
    return { ok: true, exempt: true, access: await fetchSiteAccess() };
  }

  const access = await fetchSiteAccess();
  const user = getCurrentUser();

  // Bloqueo de usuario (cuenta)
  if (user) {
    try {
      const us = await getDoc(doc(db, "users", user.uid));
      if (us.exists()) {
        const st = (us.data().status || "active").toLowerCase();
        if (st === "banned" || st === "suspended") {
          return {
            ok: false,
            reason: "user",
            title: st === "banned" ? "Cuenta bloqueada" : "Cuenta suspendida",
            message: us.data().blockReason || "Tu acceso fue restringido. Contacta a soporte si crees que es un error.",
            access
          };
        }
      }
    } catch (_) {}
  }

  if (access.globalLock) {
    return {
      ok: false,
      reason: "global",
      title: "Sitio en mantenimiento",
      message: normalizeMsg(access.globalMessage, DEFAULT.globalMessage),
      access
    };
  }

  if (scope === "global") {
    return { ok: true, access };
  }

  if (scope === "courses" || scope === "course" || scope === "lesson") {
    if (access.lockCourses) {
      return {
        ok: false,
        reason: "courses",
        title: "Cursos no disponibles",
        message: normalizeMsg(access.lockCoursesMessage, DEFAULT.lockCoursesMessage),
        access
      };
    }
    const cid = (meta.courseId || "").toLowerCase();
    if (cid && Array.isArray(access.lockedCourseIds) && access.lockedCourseIds.map(String).map((x) => x.toLowerCase()).includes(cid)) {
      return {
        ok: false,
        reason: "course",
        title: "Curso en mantenimiento",
        message: normalizeMsg(access.lockCoursesMessage, "Este curso está temporalmente bloqueado."),
        access
      };
    }
    if (scope === "lesson" && cid && meta.lessonId) {
      const list = access.lockedLessons[cid] || access.lockedLessons[meta.courseId] || [];
      if (Array.isArray(list) && list.includes(meta.lessonId)) {
        return {
          ok: false,
          reason: "lesson",
          title: "Lección no disponible",
          message: normalizeMsg(access.lockCoursesMessage, "Esta lección está temporalmente bloqueada."),
          access
        };
      }
    }
  }

  if (scope === "mini" && access.lockMiniEditor) {
    return {
      ok: false,
      reason: "mini",
      title: "Mini editor en mantenimiento",
      message: normalizeMsg(access.editorsMessage, DEFAULT.editorsMessage),
      access
    };
  }

  if (scope === "live" && (access.lockLiveEditor || access.lockMiniEditor)) {
    // LIVE completo si se bloquea live; si solo mini, LIVE sigue (salvo lockLive)
    if (access.lockLiveEditor) {
      return {
        ok: false,
        reason: "live",
        title: "Editor LIVE en mantenimiento",
        message: normalizeMsg(access.editorsMessage, DEFAULT.editorsMessage),
        access
      };
    }
  }

  return { ok: true, access };
}

export function showAccessBlock({ title, message }) {
  let layer = document.getElementById("cv-access-block");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "cv-access-block";
    layer.innerHTML = `
      <div class="cv-access-block__panel">
        <p class="cv-access-block__eyebrow">CODEVERSE</p>
        <h1 class="cv-access-block__title"></h1>
        <p class="cv-access-block__msg"></p>
        <div class="cv-access-block__actions">
          <a class="btn btn--primary" href="index.html">Ir al inicio</a>
          <button type="button" class="btn btn--ghost" id="cv-access-retry">Reintentar</button>
        </div>
      </div>`;
    document.body.appendChild(layer);
    const style = document.createElement("style");
    style.textContent = `
      #cv-access-block {
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        padding: 24px;
        background: rgba(5,5,10,0.92);
        backdrop-filter: blur(10px);
      }
      .cv-access-block__panel {
        max-width: 440px; width: 100%;
        background: #12121a;
        border: 1px solid #2a2a3a;
        border-radius: 16px;
        padding: 28px 24px;
        text-align: center;
        box-shadow: 0 24px 64px rgba(0,0,0,.55);
      }
      .cv-access-block__eyebrow {
        font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
        color: #818cf8; margin-bottom: 10px;
      }
      .cv-access-block__title {
        font-size: 1.35rem; font-weight: 750; margin: 0 0 12px; color: #f0f0f5;
      }
      .cv-access-block__msg {
        color: #a0a0b0; line-height: 1.6; margin: 0 0 22px; font-size: .95rem;
      }
      .cv-access-block__actions {
        display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
      }
    `;
    document.head.appendChild(style);
    layer.querySelector("#cv-access-retry")?.addEventListener("click", () => {
      clearSiteAccessCache();
      window.location.reload();
    });
  }
  layer.querySelector(".cv-access-block__title").textContent = title || "Acceso restringido";
  layer.querySelector(".cv-access-block__msg").textContent = message || "";
  layer.hidden = false;
  document.documentElement.style.overflow = "hidden";
}

export function hideAccessBlock() {
  const layer = document.getElementById("cv-access-block");
  if (layer) layer.hidden = true;
  document.documentElement.style.overflow = "";
}

/**
 * Aplica el bloqueo si corresponde. Devuelve false si bloqueó.
 */
export async function enforceAccess(scope, meta = {}) {
  const result = await evaluateAccess(scope, meta);
  if (!result.ok) {
    showAccessBlock({ title: result.title, message: result.message });
    return false;
  }
  return true;
}

/**
 * Espera auth lista (o null) y luego aplica enforce.
 */
export function whenAuthReady() {
  return new Promise((resolve) => {
    if (hasValidAITunnelSession()) {
      resolve(null);
      return;
    }
    const unsub = onUserChanged((user) => {
      unsub();
      resolve(user || null);
    });
  });
}

export async function gatePage(scope, meta = {}) {
  await whenAuthReady();
  return enforceAccess(scope, meta);
}
