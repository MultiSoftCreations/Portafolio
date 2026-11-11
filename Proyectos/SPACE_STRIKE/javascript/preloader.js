/**
 * SPACE STRIKE — Asset Preloader (persistente)
 * Guarda texturas en Cache API del navegador (disco local).
 * Si ya están, no vuelve a bajarlas al cambiar de página.
 * Service worker opcional: sirve img/* desde caché offline.
 */
(function (global) {
    "use strict";

    /* Solo cambia esto cuando agregues/quites archivos de verdad */
    var CACHE_NAME = "ss-textures-v3313";
    var MANIFEST_KEY = "ss_tex_manifest_v3313";
    var SESSION_READY_KEY = "ss_tex_session_ready";

    var ASSETS = [
        "img/marca.png",
        "img/texturas-especiales/evento-navidad/especial-navidad.png",
        "img/texturas-especiales/evento-navidad/interceptor.png",
        "img/texturas-especiales/evento-navidad/assault.png",
        "img/texturas-especiales/evento-navidad/tank.png",
        "img/texturas-especiales/evento-navidad/spectre.png",
        "img/texturas-especiales/evento-navidad/destroyer.png",
        "img/texturas-especiales/evento-navidad/phoenix.png",
        "img/texturas-especiales/evento-navidad/voidrunner.png",
        "img/texturas-especiales/evento-navidad/vt03.png",
        "img/texturas-especiales/evento-navidad/nebula.png",
        "img/texturas-especiales/evento-navidad/rpd.png",
        "img/texturas-especiales/evento-navidad/rpd-drone.png",

        "img/bosses/overlord.png",
        "img/bosses/overlord-muertos.png",
        "img/ui/rpd-badge.png",
        "img/ships/assault.png",
        "img/ships/cempasuchil.png",
        "img/ships/interceptor.png",
        "img/ships/nebula.png",
        "img/ships/rogue.png",
        "img/ships/rpd-drone.png",
        "img/ships/rpd.png",
        "img/ships/spectre.png",
        "img/ships/t-wind.png",
        "img/ships/tank.png",
        "img/ships/phoenix.png",
        "img/ships/voidrunner.png",
        "img/ships/vt03.png",
        "img/ships/vt03/core.png",
        "img/ships/vt03/phase1.png",
        "img/ships/vt03/wing-l.png",
        "img/ships/vt03/wing-r.png",
        "img/texturas-especiales/assault.png",
        "img/texturas-especiales/cempasuchil-eterno.png",
        "img/texturas-especiales/interceptor.png",
        "img/texturas-especiales/nave-especial.png",
        "img/texturas-especiales/rpd-drone.png",
        "img/texturas-especiales/rpd-leon.png",
        "img/texturas-especiales/spectre.png",
        "img/texturas-especiales/tank.png",
        "img/texturas-especiales/vt03-core.png",
        "img/texturas-especiales/vt03-phase1.png",
        "img/texturas-especiales/vt03-wing-l.png",
        "img/texturas-especiales/vt03-wing-r.png",
        "img/texturas-especiales/skins/horror_jason.png",
        "img/texturas-especiales/skins/horror_chucky.png",
        "img/texturas-especiales/skins/horror_freddy.png",
        "img/texturas-especiales/skins/horror_rpd_drone.png",
        "img/texturas-especiales/skins/horror_rpd.png",
        "img/texturas-especiales/skins/horror_jason_mil.png",
        "img/texturas-especiales/skins/horror_jason_02.png",
        "img/texturas-especiales/skins/horror_freddy_hat.png",
        "img/texturas-especiales/skins/horror_freddy_claw.png",
        "img/texturas-especiales/skins/horror_delta.png",
        "img/texturas-especiales/skins/horror_freddy_heavy.png",
        "img/texturas-especiales/skins/horror_freddy_delta.png",
        "img/texturas-especiales/evento-muertos/assault.png",
        "img/texturas-especiales/evento-muertos/interceptor.png",
        "img/texturas-especiales/evento-muertos/tank.png",
        "img/texturas-especiales/evento-muertos/spectre.png",
        "img/texturas-especiales/evento-muertos/destroyer.png",
        "img/texturas-especiales/evento-muertos/vt03.png",
        "img/texturas-especiales/evento-muertos/phoenix.png",
        "img/texturas-especiales/evento-muertos/voidrunner.png"
    ];

    var state = {
        ready: false,
        total: ASSETS.length,
        done: 0,
        failed: [],
        started: false
    };

    function rootPrefix() {
        var path = (location.pathname || "").replace(/\\/g, "/");
        if (/\/html\//i.test(path)) return "../";
        return "";
    }

    /** URL absoluta — clave para que Cache API funcione entre páginas */
    function absUrl(rel) {
        try {
            return new URL(rootPrefix() + rel, location.href).href;
        } catch (e) {
            return rootPrefix() + rel;
        }
    }

    function ensureOverlay() {
        var el = document.getElementById("ss-preload");
        if (el) return el;
        el = document.createElement("div");
        el.id = "ss-preload";
        el.innerHTML =
            '<div class="ss-preload-box">' +
            '<div class="ss-preload-title">SPACE STRIKE</div>' +
            '<div class="ss-preload-sub">CARGANDO RECURSOS</div>' +
            '<div class="ss-preload-bar"><div class="ss-preload-fill" id="ss-preload-fill"></div></div>' +
            '<div class="ss-preload-pct" id="ss-preload-pct">0%</div>' +
            '<div class="ss-preload-msg" id="ss-preload-msg">Preparando texturas…</div>' +
            "</div>";
        document.body.appendChild(el);
        if (!document.getElementById("ss-preload-style")) {
            var st = document.createElement("style");
            st.id = "ss-preload-style";
            st.textContent =
                "#ss-preload{position:fixed;inset:0;z-index:99999;background:#030407;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;}" +
                "#ss-preload.ss-done{opacity:0;pointer-events:none;transition:opacity .28s ease;}" +
                ".ss-preload-box{width:min(320px,86vw);text-align:center;}" +
                ".ss-preload-title{font-size:22px;letter-spacing:6px;color:#e8e4ff;font-weight:700;}" +
                ".ss-preload-sub{margin-top:8px;font-size:11px;letter-spacing:3px;color:rgba(160,150,220,.7);}" +
                ".ss-preload-bar{margin:22px 0 10px;height:6px;border-radius:4px;background:rgba(80,70,140,.25);overflow:hidden;}" +
                ".ss-preload-fill{height:100%;width:0%;background:linear-gradient(90deg,#6a5cff,#c4b5ff);transition:width .12s linear;}" +
                ".ss-preload-pct{font-size:13px;color:#c4b5ff;letter-spacing:2px;}" +
                ".ss-preload-msg{margin-top:10px;font-size:11px;color:rgba(180,170,220,.55);min-height:16px;}" +
                "body.ss-loading .menu,body.ss-loading main{pointer-events:none;opacity:.35;}";
            document.head.appendChild(st);
        }
        return el;
    }

    function setProgress(done, total, msg) {
        state.done = done;
        var pct = total ? Math.min(100, Math.round((done / total) * 100)) : 100;
        var fill = document.getElementById("ss-preload-fill");
        var pctEl = document.getElementById("ss-preload-pct");
        var msgEl = document.getElementById("ss-preload-msg");
        if (fill) fill.style.width = pct + "%";
        if (pctEl) pctEl.textContent = pct + "%";
        if (msgEl && msg) msgEl.textContent = msg;
    }

    function openCache() {
        if (!("caches" in global)) return Promise.resolve(null);
        return caches.open(CACHE_NAME).catch(function () {
            return null;
        });
    }

    /** ¿Está este asset ya guardado en disco (Cache API)? */
    function isCached(url) {
        return openCache().then(function (cache) {
            if (!cache) return false;
            return cache.match(url).then(function (r) {
                return !!(r && r.ok);
            });
        }).catch(function () {
            return false;
        });
    }

    /** Descarga y guarda en Cache API (persistente entre visitas) */
    function fetchAndCache(url) {
        return openCache().then(function (cache) {
            return fetch(url, { credentials: "same-origin", cache: "reload" })
                .then(function (res) {
                    if (!res || !res.ok) throw new Error("HTTP " + (res && res.status));
                    if (cache) {
                        try {
                            cache.put(url, res.clone());
                        } catch (e) {}
                    }
                    return true;
                });
        });
    }

    /** Precarga en memoria (Image) usando red o caché HTTP */
    function warmImage(url) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () {
                resolve(true);
            };
            img.onerror = function () {
                resolve(false);
            };
            img.src = url;
        });
    }

    function ensureOne(rel, onProgress) {
        var url = absUrl(rel);
        return isCached(url).then(function (hit) {
            if (hit) {
                return warmImage(url).then(function () {
                    return { ok: true, cached: true, url: url };
                });
            }
            return fetchAndCache(url)
                .then(function () {
                    return warmImage(url).then(function (ok) {
                        return { ok: ok, cached: false, url: url };
                    });
                })
                .catch(function () {
                    return warmImage(url).then(function (ok) {
                        return { ok: ok, cached: false, url: url };
                    });
                });
        });
    }

    function preloadAll(onProgress) {
        var total = ASSETS.length;
        var done = 0;
        var failed = [];
        var CONCURRENCY = 5;
        var i = 0;
        var active = 0;

        return new Promise(function (resolve) {
            function next() {
                if (i >= total && active === 0) {
                    resolve({ failed: failed, total: total });
                    return;
                }
                while (active < CONCURRENCY && i < total) {
                    (function (rel) {
                        active++;
                        ensureOne(rel).then(function (res) {
                            if (!res.ok) failed.push(rel);
                            done++;
                            active--;
                            if (onProgress) {
                                onProgress(
                                    done,
                                    total,
                                    (res.cached ? "Caché · " : "Descarga · ") + (rel.split("/").pop() || "")
                                );
                            }
                            next();
                        });
                    })(ASSETS[i++]);
                }
            }
            next();
        });
    }

    /** Cuántos assets ya están en Cache API (rápido) */
    function countCached() {
        var urls = ASSETS.map(absUrl);
        return openCache().then(function (cache) {
            if (!cache) return 0;
            return Promise.all(
                urls.map(function (u) {
                    return cache.match(u).then(function (r) {
                        return r && r.ok ? 1 : 0;
                    });
                })
            ).then(function (arr) {
                return arr.reduce(function (a, b) {
                    return a + b;
                }, 0);
            });
        }).catch(function () {
            return 0;
        });
    }

    function finish(overlay, fromCache) {
        state.ready = true;
        try {
            localStorage.setItem(MANIFEST_KEY, CACHE_NAME + "|" + ASSETS.length);
            sessionStorage.setItem(SESSION_READY_KEY, "1");
        } catch (e) {}
        document.body.classList.remove("ss-loading");
        if (overlay) {
            if (fromCache) {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            } else {
                overlay.classList.add("ss-done");
                setTimeout(function () {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                }, 300);
            }
        }
        try {
            document.dispatchEvent(new CustomEvent("ss-assets-ready"));
        } catch (e2) {}
        if (typeof global.onSpaceStrikeAssetsReady === "function") {
            try {
                global.onSpaceStrikeAssetsReady();
            } catch (e3) {}
        }
    }

    function registerAssetSW() {
        if (!("serviceWorker" in navigator)) return;
        var swUrl = rootPrefix() + "sw-assets.js";
        try {
            navigator.serviceWorker.register(swUrl, { scope: rootPrefix() || "./" }).catch(function () {});
        } catch (e) {}
    }

    function start(opts) {
        opts = opts || {};
        if (state.started) {
            return state.ready ? Promise.resolve() : waitReady();
        }
        state.started = true;
        registerAssetSW();

        /* Misma sesión: ya se cargó todo → no mostrar pantalla */
        try {
            if (sessionStorage.getItem(SESSION_READY_KEY) === "1") {
                var m = localStorage.getItem(MANIFEST_KEY);
                if (m === CACHE_NAME + "|" + ASSETS.length) {
                    state.ready = true;
                    document.body.classList.remove("ss-loading");
                    try {
                        document.dispatchEvent(new CustomEvent("ss-assets-ready"));
                    } catch (e) {}
                    return Promise.resolve();
                }
            }
        } catch (e0) {}

        document.body.classList.add("ss-loading");
        var overlay = ensureOverlay();

        return countCached().then(function (nCached) {
            var allCached = nCached >= ASSETS.length;
            if (allCached) {
                setProgress(ASSETS.length, ASSETS.length, "Texturas en dispositivo");
                /* calentar un poco en paralelo sin bloquear mucho */
                return preloadAll(function (done, total, msg) {
                    setProgress(done, total, msg);
                }).then(function () {
                    finish(overlay, true);
                });
            }

            setProgress(nCached, ASSETS.length, "Guardando texturas en el dispositivo…");
            return preloadAll(function (done, total, msg) {
                setProgress(done, total, msg);
            }).then(function (res) {
                state.failed = res.failed || [];
                if (state.failed.length) {
                    setProgress(res.total, res.total, "Listo · " + state.failed.length + " opcionales fallaron");
                } else {
                    setProgress(res.total, res.total, "Guardado en este dispositivo");
                }
                setTimeout(function () {
                    finish(overlay, false);
                }, 150);
            });
        });
    }

    function waitReady() {
        if (state.ready) return Promise.resolve();
        return new Promise(function (resolve) {
            document.addEventListener(
                "ss-assets-ready",
                function () {
                    resolve();
                },
                { once: true }
            );
        });
    }

    function isReady() {
        return !!state.ready;
    }

    function guardClick(fn) {
        return function (ev) {
            if (!state.ready) {
                if (ev && ev.preventDefault) ev.preventDefault();
                start();
                return;
            }
            return fn.apply(this, arguments);
        };
    }

    /** Borrar caché de texturas (útil si actualizas assets a la fuerza) */
    function clearTextureCache() {
        try {
            sessionStorage.removeItem(SESSION_READY_KEY);
            localStorage.removeItem(MANIFEST_KEY);
        } catch (e) {}
        if (!("caches" in global)) return Promise.resolve();
        return caches.delete(CACHE_NAME);
    }

    global.SpaceStrikePreloader = {
        start: start,
        waitReady: waitReady,
        isReady: isReady,
        guardClick: guardClick,
        clearTextureCache: clearTextureCache,
        assets: ASSETS,
        CACHE_NAME: CACHE_NAME
    };

    function boot() {
        start();
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})(typeof window !== "undefined" ? window : this);
