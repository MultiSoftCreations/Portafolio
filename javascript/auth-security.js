/**
 * Seguridad de acceso (portafolio / comentarios)
 * - Retraso anti fuerza bruta (~1 s)
 * - Contador de fallos por correo (local)
 * - CAPTCHA simple tras 3 fallos
 * - Bloqueo 15 min tras 5 fallos
 *
 * Nota: Firebase Auth NUNCA guarda la contraseña en texto plano.
 * La cifra/hashea en sus servidores (scrypt). El valor solo viaja por HTTPS
 * y se borra del DOM tras el intento. No conviene "pre-hashear" en cliente
 * porque rompería el login de Firebase Auth.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "msc_auth_guard_v1";
  const DELAY_MS = 1000;
  const CAPTCHA_AFTER = 3;
  const LOCK_AFTER = 5;
  const LOCK_MS = 15 * 60 * 1000;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function keyFor(email) {
    return String(email || "").trim().toLowerCase();
  }

  function getState(email) {
    const k = keyFor(email);
    const all = load();
    const s = all[k] || { fails: 0, lockedUntil: 0 };
    if (s.lockedUntil && Date.now() > s.lockedUntil) {
      s.fails = 0;
      s.lockedUntil = 0;
      all[k] = s;
      save(all);
    }
    return s;
  }

  function setState(email, s) {
    const all = load();
    all[keyFor(email)] = s;
    save(all);
  }

  function isLocked(email) {
    const s = getState(email);
    if (s.lockedUntil && Date.now() < s.lockedUntil) {
      const mins = Math.ceil((s.lockedUntil - Date.now()) / 60000);
      return { locked: true, minutes: mins };
    }
    return { locked: false, minutes: 0 };
  }

  function needsCaptcha(email) {
    return getState(email).fails >= CAPTCHA_AFTER;
  }

  function recordFailure(email) {
    const s = getState(email);
    s.fails = (s.fails || 0) + 1;
    if (s.fails >= LOCK_AFTER) {
      s.lockedUntil = Date.now() + LOCK_MS;
    }
    setState(email, s);
    return s;
  }

  function recordSuccess(email) {
    setState(email, { fails: 0, lockedUntil: 0 });
  }

  function delay(ms) {
    return new Promise((r) => setTimeout(r, ms || DELAY_MS));
  }

  /** CAPTCHA aritmético simple (sin servicios externos) */
  function makeCaptcha() {
    const a = 2 + Math.floor(Math.random() * 8);
    const b = 1 + Math.floor(Math.random() * 9);
    return { question: `${a} + ${b}`, answer: String(a + b) };
  }

  function clearPasswordFields(form) {
    if (!form) return;
    form.querySelectorAll('input[type="password"]').forEach((el) => {
      el.value = "";
    });
  }

  /**
   * Envuelve un intento de login.
   * @returns {{ ok: boolean, error?: string, captchaRequired?: boolean, locked?: boolean }}
   */
  async function guardLogin(email, password, captchaAnswer, expectedCaptcha, doLogin) {
    const lock = isLocked(email);
    if (lock.locked) {
      return {
        ok: false,
        locked: true,
        error: `Cuenta bloqueada temporalmente por intentos fallidos. Espera ${lock.minutes} min.`,
      };
    }

    if (needsCaptcha(email)) {
      if (!expectedCaptcha || String(captchaAnswer || "").trim() !== String(expectedCaptcha)) {
        return {
          ok: false,
          captchaRequired: true,
          error: "Completa el CAPTCHA correctamente para continuar.",
        };
      }
    }

    // Retraso fijo anti fuerza bruta (también en éxito)
    await delay(DELAY_MS);

    try {
      await doLogin(email, password);
      recordSuccess(email);
      return { ok: true };
    } catch (ex) {
      const s = recordFailure(email);
      let error = "No se pudo iniciar sesión.";
      if (ex && ex.code === "auth/too-many-requests") {
        error = "Demasiados intentos. Espera un momento.";
      }
      if (s.fails >= LOCK_AFTER) {
        return {
          ok: false,
          locked: true,
          error: "Demasiados intentos fallidos. Cuenta bloqueada 15 minutos.",
        };
      }
      if (s.fails >= CAPTCHA_AFTER) {
        return {
          ok: false,
          captchaRequired: true,
          error: error + " Se requiere CAPTCHA.",
        };
      }
      return { ok: false, error, captchaRequired: needsCaptcha(email) };
    }
  }

  global.MscAuthSecurity = {
    DELAY_MS,
    CAPTCHA_AFTER,
    LOCK_AFTER,
    isLocked,
    needsCaptcha,
    recordFailure,
    recordSuccess,
    delay,
    makeCaptcha,
    clearPasswordFields,
    guardLogin,
  };
})(typeof window !== "undefined" ? window : globalThis);
