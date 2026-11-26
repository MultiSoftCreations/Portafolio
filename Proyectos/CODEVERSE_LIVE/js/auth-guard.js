// CODEVERSE — Auth Guard + acceso / mantenimiento
// MultiSoftCreations

import { onUserChanged, hasValidAITunnelSession } from "./auth.js";
import { gatePage } from "./site-access.js";

/**
 * Protege la página actual.
 * - Si hay usuario logueado → OK
 * - Si hay sesión de AI Tunnel → OK (sin admin)
 * - Si no → redirige a login.html
 *
 * @param {object} options
 * @param {boolean} options.allowAI - Permitir acceso por túnel de IA (default true)
 * @param {string} options.accessScope - global|courses|course|lesson|mini|live
 * @param {object} options.accessMeta - { courseId, lessonId }
 */
export function requireAuth(options = { allowAI: true }) {
  return new Promise((resolve) => {
    if (options.allowAI && hasValidAITunnelSession()) {
      document.documentElement.dataset.aiTunnel = "1";
      const done = async () => {
        if (options.accessScope) {
          await gatePage(options.accessScope, options.accessMeta || {});
        }
        resolve({ type: "ai_tunnel" });
      };
      done();
      return;
    }

    const unsubscribe = onUserChanged(async (user) => {
      unsubscribe();
      if (user) {
        if (options.accessScope) {
          await gatePage(options.accessScope, options.accessMeta || {});
        }
        resolve({ type: "user", user });
      } else {
        const path = window.location.pathname || "";
        const parts = path.split("/").filter(Boolean);
        const current = parts[parts.length - 1] || "dashboard.html";
        // Si estamos en Cursos/..., conservar ruta relativa razonable
        let redirectTarget = current + (window.location.search || "");
        if (path.includes("/Cursos/")) {
          const idx = path.indexOf("/Cursos/");
          redirectTarget = path.slice(idx + 1) + (window.location.search || "");
        }
        const redirect = encodeURIComponent(redirectTarget);
        window.location.replace(`login.html?redirect=${redirect}`);
      }
    });
  });
}

export async function protectPage(options) {
  return requireAuth(options);
}
