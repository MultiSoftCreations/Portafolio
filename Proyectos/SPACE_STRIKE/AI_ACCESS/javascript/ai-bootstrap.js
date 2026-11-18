/**
 * SPACE STRIKE — AI / Local Review Mode
 * Carpeta: Proyectos/SPACE_STRIKE/AI_ACCESS/
 *
 * - Sin Google Auth obligatorio
 * - Progreso 100% local (localStorage)
 * - No sube progreso a la nube
 * - Códigos VIP / recompensas SÍ pueden validarse en Firestore (usedBy: "local")
 * - Pensado para que Grok, ChatGPT, Meta AI, etc. puedan abrir y jugar sin cuenta
 */
(function (global) {
    "use strict";

    global.SPACE_STRIKE_AI_MODE = true;
    global.SPACE_STRIKE_LOCAL_ONLY = true;

    var FAKE_UID = "ai-local-reviewer";
    var FAKE_EMAIL = "ai-review@local.space-strike";
    var DEFAULT_PILOT = "AI_REVIEWER";

    var fakeUser = {
        uid: FAKE_UID,
        email: FAKE_EMAIL,
        displayName: DEFAULT_PILOT,
        isAnonymous: true,
        isAiLocal: true
    };

    function ensureLocalPilot() {
        try {
            var P = global.SpaceStrikePlayer;
            if (P && typeof P.getName === "function" && !P.getName()) {
                if (typeof P.register === "function") {
                    var res = P.register(DEFAULT_PILOT);
                    if (res && res.ok) return;
                }
            }
            // Fallback directo a localStorage si el módulo aún no expone register
            var profileKey = "spaceStrikeProfile";
            var raw = localStorage.getItem(profileKey);
            if (!raw) {
                localStorage.setItem(
                    profileKey,
                    JSON.stringify({
                        name: DEFAULT_PILOT,
                        createdAt: Date.now(),
                        bestInfinite: 0,
                        bestWave: 0,
                        source: "ai-local"
                    })
                );
            }
            if (!localStorage.getItem("spaceStrikePilotName")) {
                localStorage.setItem("spaceStrikePilotName", DEFAULT_PILOT);
            }
        } catch (e) {
            console.warn("[AI_MODE] pilot", e);
        }
    }

    /**
     * Sustituye SpaceStrikeAuth por un stub local.
     * Firebase se sigue cargando solo para códigos VIP (premium-codes / reward-codes).
     */
    function installAuthStub() {
        var realInit = null;

        function localInit() {
            // Inicializa Firebase real en segundo plano solo para códigos
            if (realInit) return realInit();
            return Promise.resolve(true);
        }

        global.SpaceStrikeAuth = {
            init: function () {
                return localInit();
            },
            signInGoogle: function () {
                return Promise.resolve(fakeUser);
            },
            signOut: function () {
                return Promise.resolve();
            },
            user: function () {
                return fakeUser;
            },
            push: function () {
                // No subir nada en modo IA
                return Promise.resolve({ ok: false, reason: "ai-local-only" });
            },
            queuePush: function () {},
            pull: function () {
                return Promise.resolve({ ok: false, reason: "ai-local-only" });
            },
            isLoggedIn: function () {
                return true;
            },
            isAiMode: true
        };

        // Si auth.js real ya corrió, lo sobrescribimos igual
        // Guardamos init real por si premium-codes necesita Firestore
        var origDefine = Object.defineProperty;
        try {
            // Re-enganchar cuando auth.js termine
            var check = setInterval(function () {
                if (global.firebase && global.firebase.apps && global.firebase.apps.length) {
                    clearInterval(check);
                }
            }, 200);
            setTimeout(function () {
                clearInterval(check);
            }, 8000);
        } catch (e2) {}
    }

    function patchMenuGates() {
        // Asegura que las funciones del menú no pidan Google
        if (typeof global.ensureGoogleAuth === "function") {
            global.ensureGoogleAuth = function (callback) {
                ensureLocalPilot();
                if (typeof callback === "function") callback();
            };
        }
        if (typeof global.ensurePilotRegistered === "function") {
            global.ensurePilotRegistered = function (callback) {
                ensureLocalPilot();
                if (typeof callback === "function") callback();
            };
        }
        if (typeof global.isGoogleLoggedIn === "function") {
            global.isGoogleLoggedIn = function () {
                return true;
            };
        }
    }

    function patchNavigateTo() {
        // Desde AI_ACCESS/ las rutas html/ deben subir un nivel
        var orig = global.navigateTo;
        if (typeof orig !== "function") return;

        global.navigateTo = function (page) {
            if (typeof page === "string" && page.indexOf("html/") === 0) {
                page = "../" + page;
            }
            // Marcar modo AI en la URL para páginas hijas
            try {
                var u = new URL(page, global.location.href);
                u.searchParams.set("ai", "1");
                page = u.pathname + u.search + (u.hash || "");
                // pathname relativo
                if (page.indexOf("/Proyectos/") >= 0) {
                    // mantener relativo si se puede
                    var rel = page.split("/AI_ACCESS/")[0];
                }
            } catch (e) {
                if (page.indexOf("?") >= 0) page += "&ai=1";
                else page += "?ai=1";
            }
            return orig.call(this, page);
        };
    }

    function showAiBanner() {
        try {
            var bar = document.createElement("div");
            bar.id = "aiModeBanner";
            bar.setAttribute(
                "style",
                [
                    "position:fixed",
                    "top:0",
                    "left:0",
                    "right:0",
                    "z-index:99999",
                    "padding:6px 12px",
                    "font:12px/1.4 monospace",
                    "text-align:center",
                    "background:linear-gradient(90deg,#1a0a2e,#0d1b2a)",
                    "color:#c9b6ff",
                    "border-bottom:1px solid rgba(160,120,255,.4)",
                    "pointer-events:none"
                ].join(";")
            );
            bar.textContent =
                "◈ MODO IA / LOCAL REVIEW — Sin Google · Progreso local · Códigos VIP sí conectan a nube";
            document.body.appendChild(bar);
            document.body.style.paddingTop = "28px";
        } catch (e) {}
    }

    function hideGoogleButton() {
        try {
            var btn = document.getElementById("googleAuthButton");
            if (btn) {
                btn.style.display = "none";
            }
            var reg = document.getElementById("registerOverlay");
            if (reg) reg.classList.add("hidden");
        } catch (e) {}
    }

    function boot() {
        installAuthStub();
        ensureLocalPilot();

        // Parches después de que index.js defina las funciones
        var tries = 0;
        var t = setInterval(function () {
            tries++;
            patchMenuGates();
            if (typeof global.navigateTo === "function") {
                patchNavigateTo();
            }
            hideGoogleButton();
            ensureLocalPilot();
            if (tries > 40) clearInterval(t);
        }, 100);

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", function () {
                showAiBanner();
                hideGoogleButton();
                ensureLocalPilot();
            });
        } else {
            showAiBanner();
            hideGoogleButton();
            ensureLocalPilot();
        }

        // Exponer helper
        global.SpaceStrikeAiMode = {
            active: true,
            pilot: DEFAULT_PILOT,
            fakeUser: fakeUser,
            ensureLocalPilot: ensureLocalPilot
        };

        console.info("[SPACE STRIKE] AI_ACCESS mode activo — progreso local, códigos VIP en nube.");
    }

    boot();
})(typeof window !== "undefined" ? window : this);
