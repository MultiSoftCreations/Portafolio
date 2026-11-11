/* SPACE STRIKE — Cloud announcements + FCM (works when app closed) */
(function (global) {
    "use strict";

    var COL = "announcements";
    var TOKENS_COL = "fcmTokens";
    var SEEN_KEY = "spaceStrikeAnnouncementsSeen";
    var PERM_ASKED_KEY = "spaceStrikeNotifPermAsked";
    /* Firebase Console → Project settings → Cloud Messaging → Web Push certificates */
    var VAPID_KEY = global.SPACE_STRIKE_VAPID_KEY || "";
    var SEND_URL = "/.netlify/functions/send-fcm";
    /* GitHub Pages fallback: set full Netlify function URL if hosting on GH Pages */
    var SEND_URL_FALLBACK = global.SPACE_STRIKE_FCM_URL || "";

    var unsub = null;
    var messaging = null;

    function getDb() {
        try {
            if (global.firebase && firebase.apps && firebase.apps.length) {
                return firebase.firestore();
            }
        } catch (e) {}
        return null;
    }

    function ensureFirebase() {
        if (global.SpaceStrikeAuth && global.SpaceStrikeAuth.init) {
            return global.SpaceStrikeAuth.init().then(function () {
                return !!getDb();
            });
        }
        return Promise.resolve(!!getDb());
    }

    function loadSeen() {
        try {
            return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]") || [];
        } catch (e) {
            return [];
        }
    }

    function markSeen(id) {
        var s = loadSeen();
        if (s.indexOf(id) < 0) {
            s.push(id);
            if (s.length > 80) s = s.slice(-80);
            try {
                localStorage.setItem(SEEN_KEY, JSON.stringify(s));
            } catch (e) {}
        }
    }

    function notifSupported() {
        return typeof Notification !== "undefined";
    }

    function permissionState() {
        if (!notifSupported()) return "unsupported";
        return Notification.permission;
    }

    function requestPermissionWithExplain() {
        return new Promise(function (resolve) {
            if (!notifSupported()) {
                resolve({ ok: false, permission: "unsupported" });
                return;
            }
            if (Notification.permission === "granted") {
                resolve({ ok: true, permission: "granted" });
                return;
            }
            if (Notification.permission === "denied") {
                resolve({ ok: false, permission: "denied" });
                return;
            }
            var msg =
                "SPACE STRIKE quiere enviarte notificaciones.\n\n" +
                "Sirven para:\n" +
                "• Noticias y actualizaciones\n" +
                "• Eventos especiales\n" +
                "• Códigos de uso limitado / recompensas\n" +
                "• Avisos importantes\n\n" +
                "Funcionan aunque cierres la página (si el sistema lo permite).\n\n" +
                "¿Permitir notificaciones?";
            if (!confirm(msg)) {
                try {
                    localStorage.setItem(PERM_ASKED_KEY, "1");
                } catch (e) {}
                resolve({ ok: false, permission: "dismissed" });
                return;
            }
            Notification.requestPermission().then(function (perm) {
                try {
                    localStorage.setItem(PERM_ASKED_KEY, "1");
                } catch (e2) {}
                resolve({ ok: perm === "granted", permission: perm });
            }).catch(function () {
                resolve({ ok: false, permission: "error" });
            });
        });
    }

    function loadMessagingScript() {
        return new Promise(function (resolve, reject) {
            if (global.firebase && firebase.messaging) {
                resolve();
                return;
            }
            var s = document.createElement("script");
            s.src = "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js";
            s.onload = function () {
                resolve();
            };
            s.onerror = function () {
                reject(new Error("messaging script"));
            };
            document.head.appendChild(s);
        });
    }

    function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) return Promise.resolve(null);
        var swUrl = "firebase-messaging-sw.js";
        try {
            if (location.pathname.indexOf("/html/") >= 0) swUrl = "../firebase-messaging-sw.js";
        } catch (e) {}
        return navigator.serviceWorker.register(swUrl).catch(function (err) {
            console.warn("[FCM] SW register", err);
            return null;
        });
    }

    function saveToken(token) {
        var db = getDb();
        if (!db || !token) return Promise.resolve();
        var uid = "anon";
        try {
            if (global.SpaceStrikeAuth && global.SpaceStrikeAuth.user) {
                var u = global.SpaceStrikeAuth.user();
                if (u && u.uid) uid = u.uid;
            }
        } catch (e) {}
        var id = uid + "_" + String(token).slice(-24);
        return db
            .collection(TOKENS_COL)
            .doc(id)
            .set(
                {
                    token: token,
                    uid: uid,
                    updatedAt: Date.now(),
                    ua: (navigator.userAgent || "").slice(0, 180)
                },
                { merge: true }
            )
            .catch(function (err) {
                console.warn("[FCM] save token", err);
            });
    }

    function subscribeFcm() {
        if (!VAPID_KEY) {
            console.warn("[FCM] Define window.SPACE_STRIKE_VAPID_KEY (clave Web Push de Firebase)");
            return Promise.resolve({ ok: false, error: "Sin VAPID key" });
        }
        return ensureFirebase()
            .then(function () {
                return loadMessagingScript();
            })
            .then(function () {
                return registerServiceWorker();
            })
            .then(function () {
                if (!firebase.messaging) throw new Error("messaging API missing");
                messaging = firebase.messaging();
                return messaging.getToken({ vapidKey: VAPID_KEY });
            })
            .then(function (token) {
                if (!token) return { ok: false, error: "Sin token" };
                return saveToken(token).then(function () {
                    return { ok: true, token: token };
                });
            })
            .catch(function (err) {
                console.warn("[FCM] subscribe", err);
                return { ok: false, error: String(err && err.message || err) };
            });
    }

    function collectAllTokens() {
        var db = getDb();
        if (!db) return Promise.resolve([]);
        return db
            .collection(TOKENS_COL)
            .limit(500)
            .get()
            .then(function (snap) {
                var tokens = [];
                var seen = {};
                snap.forEach(function (doc) {
                    var t = (doc.data() || {}).token;
                    if (t && !seen[t]) {
                        seen[t] = true;
                        tokens.push(t);
                    }
                });
                return tokens;
            })
            .catch(function () {
                return [];
            });
    }

    function sendFcmToAll(title, body, type) {
        return collectAllTokens().then(function (tokens) {
            if (!tokens.length) {
                return { ok: false, error: "No hay dispositivos suscritos aún", sent: 0 };
            }
            var url = SEND_URL_FALLBACK || SEND_URL;
            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title, body: body, type: type || "news", tokens: tokens })
            })
                .then(function (r) {
                    return r.json().catch(function () {
                        return { ok: false, error: "Respuesta inválida" };
                    });
                })
                .catch(function (err) {
                    return {
                        ok: false,
                        error:
                            String(err && err.message || err) +
                            " — Si usas GitHub Pages, configura SPACE_STRIKE_FCM_URL a tu función Netlify"
                    };
                });
        });
    }

    function showBrowserNotification(title, body, tag) {
        if (!notifSupported() || Notification.permission !== "granted") return false;
        try {
            var n = new Notification(title || "SPACE STRIKE", {
                body: body || "",
                tag: tag || "ss-announcement",
                icon: "img/marca.png"
            });
            n.onclick = function () {
                try {
                    window.focus();
                    n.close();
                } catch (e) {}
            };
            return true;
        } catch (e2) {
            return false;
        }
    }

    function showInGameBanner(title, body) {
        try {
            var el = document.getElementById("ssCloudNotice");
            if (!el) {
                el = document.createElement("div");
                el.id = "ssCloudNotice";
                el.style.cssText =
                    "position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:99999;" +
                    "max-width:min(420px,92vw);padding:12px 14px;border-radius:8px;" +
                    "background:rgba(8,18,36,0.95);border:1px solid rgba(100,180,255,0.45);" +
                    "color:#e8f4ff;font:12px/1.4 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,0.45);";
                document.body.appendChild(el);
            }
            el.innerHTML =
                "<div style='font-weight:800;letter-spacing:1px;margin-bottom:4px'>" +
                (title || "AVISO") +
                "</div><div style='opacity:0.9'>" +
                (body || "") +
                "</div>" +
                "<button type='button' style='margin-top:8px;width:100%;padding:8px;border-radius:5px;border:1px solid rgba(90,170,255,0.35);background:#0a2038;color:#dcecff;font-weight:700;cursor:pointer'>CERRAR</button>";
            el.querySelector("button").onclick = function () {
                el.remove();
            };
            setTimeout(function () {
                try {
                    if (el && el.parentNode) el.remove();
                } catch (e) {}
            }, 14000);
        } catch (e3) {}
    }

    function handleAnnouncement(doc) {
        var id = doc.id;
        var data = doc.data() || {};
        var seen = loadSeen();
        if (seen.indexOf(id) >= 0) return;
        markSeen(id);
        var title = data.title || "SPACE STRIKE";
        var body = data.body || data.message || "";
        showInGameBanner(title, body);
        showBrowserNotification(title, body, "ss-" + id);
    }

    function listen() {
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false };
            if (unsub) {
                try {
                    unsub();
                } catch (e) {}
            }
            unsub = db
                .collection(COL)
                .orderBy("createdAt", "desc")
                .limit(15)
                .onSnapshot(
                    function (snap) {
                        snap.docChanges().forEach(function (change) {
                            if (change.type === "added") handleAnnouncement(change.doc);
                        });
                    },
                    function (err) {
                        console.warn("[SS announcements]", err);
                    }
                );
            return { ok: true };
        });
    }

    function publish(title, body, type) {
        var isAdm =
            (global.SpaceStrikeAdmin && global.SpaceStrikeAdmin.isAdmin && global.SpaceStrikeAdmin.isAdmin()) ||
            (global.SpaceStrikeCodes && global.SpaceStrikeCodes.isAdmin && global.SpaceStrikeCodes.isAdmin());
        if (!isAdm) {
            return Promise.resolve({ ok: false, error: "Solo admins pueden enviar notificaciones" });
        }
        title = String(title || "").trim();
        body = String(body || "").trim();
        if (!title || !body) {
            return Promise.resolve({ ok: false, error: "Título y mensaje requeridos" });
        }
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, error: "Sin Firebase" };
            var email = "";
            try {
                if (global.SpaceStrikeAuth && global.SpaceStrikeAuth.user) {
                    var u = global.SpaceStrikeAuth.user();
                    email = (u && u.email) || "";
                }
            } catch (e) {}
            return db
                .collection(COL)
                .add({
                    title: title.slice(0, 80),
                    body: body.slice(0, 500),
                    type: type || "news",
                    createdAt: Date.now(),
                    by: email
                })
                .then(function (ref) {
                    /* also try FCM push to closed apps */
                    return sendFcmToAll(title, body, type).then(function (fcm) {
                        return { ok: true, id: ref.id, fcm: fcm };
                    });
                });
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    function listRecent(limit) {
        limit = limit || 20;
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, items: [] };
            return db
                .collection(COL)
                .orderBy("createdAt", "desc")
                .limit(limit)
                .get()
                .then(function (snap) {
                    var items = [];
                    snap.forEach(function (doc) {
                        var d = doc.data() || {};
                        items.push({
                            id: doc.id,
                            title: d.title,
                            body: d.body,
                            type: d.type,
                            createdAt: d.createdAt,
                            by: d.by
                        });
                    });
                    return { ok: true, items: items };
                });
        });
    }

    function boot() {
        requestPermissionWithExplain().then(function (r) {
            if (r && r.ok) subscribeFcm();
        });
        listen();
    }

    global.SpaceStrikePush = {
        requestPermissionWithExplain: requestPermissionWithExplain,
        permissionState: permissionState,
        subscribeFcm: subscribeFcm,
        listen: listen,
        publish: publish,
        listRecent: listRecent,
        sendFcmToAll: sendFcmToAll,
        showBrowserNotification: showBrowserNotification
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            setTimeout(boot, 600);
        });
    } else {
        setTimeout(boot, 600);
    }
})(typeof window !== "undefined" ? window : this);
