// CODEVERSE — Auth Guard
// Protege páginas: exige login de usuario O sesión válida de AI Tunnel
// MultiSoftCreations

import { onUserChanged, hasValidAITunnelSession } from "./auth.js";

/**
 * Protege la página actual.
 * - Si hay usuario logueado → OK
 * - Si hay sesión de AI Tunnel → OK (sin admin)
 * - Si no → redirige a login.html
 *
 * @param {object} options
 * @param {boolean} options.allowAI - Permitir acceso por túnel de IA (default true)
 */
export function requireAuth(options = { allowAI: true }) {
  return new Promise((resolve) => {
    // Si ya hay sesión de IA válida y está permitido
    if (options.allowAI && hasValidAITunnelSession()) {
      document.documentElement.dataset.aiTunnel = "1";
      resolve({ type: "ai_tunnel" });
      return;
    }

    const unsubscribe = onUserChanged((user) => {
      unsubscribe();
      if (user) {
        resolve({ type: "user", user });
      } else {
        // Guardar a dónde quería ir
        const current = window.location.pathname.split("/").pop() || "dashboard.html";
        const search = window.location.search || "";
        const redirect = encodeURIComponent(current + search);
        window.location.replace(`login.html?redirect=${redirect}`);
      }
    });
  });
}

/**
 * Versión que se puede llamar al inicio de un script de página
 */
export async function protectPage(options) {
  return requireAuth(options);
}
