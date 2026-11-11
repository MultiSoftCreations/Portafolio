/* SPACE STRIKE 2.1.3 — Global leaderboard (1 entry per pilot, best score) */
(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyAvphMu9hP94TxCWbhiyAHZJtUHiwBrU1Y",
        authDomain: "space-strike-2b542.firebaseapp.com",
        projectId: "space-strike-2b542",
        storageBucket: "space-strike-2b542.firebasestorage.app",
        messagingSenderId: "274515632428",
        appId: "1:274515632428:web:c72fb66c2df01929128c89",
        measurementId: "G-96LB3982K3"
    };

    var db = null;
    var ready = false;
    var initPromise = null;
    var lastError = "";

    function loadScript(src) {
        return new Promise(function (resolve, reject) {
            if (document.querySelector('script[src="' + src + '"]')) {
                resolve();
                return;
            }
            var s = document.createElement("script");
            s.src = src;
            s.async = true;
            s.onload = function () { resolve(); };
            s.onerror = function () { reject(new Error("No se pudo cargar " + src)); };
            document.head.appendChild(s);
        });
    }

    function init() {
        if (initPromise) return initPromise;
        initPromise = loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js")
            .then(function () {
                return loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js");
            })
            .then(function () {
                if (!window.firebase) throw new Error("Firebase no disponible");
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                db = firebase.firestore();
                ready = true;
                lastError = "";
                return true;
            })
            .catch(function (err) {
                lastError = String(err && err.message || err);
                console.warn("[SpaceStrike] Firebase init failed", err);
                ready = false;
                return false;
            });
        return initPromise;
    }

    /** Stable doc id from pilot name (unique per name, case-insensitive) */
    function nameToId(name) {
        return String(name || "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_\-]/g, "_")
            .slice(0, 32);
    }

    function resolveName(name) {
        name = String(name || "").trim().replace(/\s+/g, "");
        if (name.length >= 7 && name.length <= 12) return name;
        try {
            if (window.SpaceStrikePlayer && typeof window.SpaceStrikePlayer.getName === "function") {
                name = String(window.SpaceStrikePlayer.getName() || "").trim();
            }
        } catch (e) {}
        if (name.length >= 7 && name.length <= 12) return name;
        try {
            var raw = localStorage.getItem("spaceStrikeProfile");
            if (raw) {
                var p = JSON.parse(raw);
                if (p && p.name) name = String(p.name).trim();
            }
        } catch (e) {}
        return name;
    }

    /**
     * One document per pilot name.
     * - If no entry: create
     * - If new score is higher: update
     * - If new score is lower or equal: keep existing (no write)
     */
    function isPlayerPremium() {
        try {
            if (window.SpaceStrikePremium && window.SpaceStrikePremium.isPremium) {
                return !!window.SpaceStrikePremium.isPremium();
            }
            return localStorage.getItem("spaceStrikePremium") === "1";
        } catch (e) {
            return false;
        }
    }

    function submitScore(name, score, wave) {
        name = resolveName(name);
        score = Math.floor(Number(score) || 0);
        wave = Math.floor(Number(wave) || 1);

        if (name.length < 7 || name.length <= 6 || name.length > 12) {
            lastError = "Nombre inválido (7-12 caracteres). Regístrate en el menú.";
            return Promise.resolve({ ok: false, reason: "name", error: lastError });
        }
        if (score <= 0) {
            lastError = "Score 0 no se sube";
            return Promise.resolve({ ok: false, reason: "score" });
        }

        var docId = nameToId(name);
        if (!docId) {
            lastError = "Nombre inválido";
            return Promise.resolve({ ok: false, reason: "name", error: lastError });
        }

        return init().then(function (ok) {
            if (!ok || !db) {
                lastError = lastError || "Firebase offline";
                return { ok: false, reason: "offline", error: lastError };
            }

            var ref = db.collection("scores").doc(docId);
            return ref.get().then(function (snap) {
                var payload = {
                    name: name,
                    score: score,
                    wave: wave,
                    date: Date.now(),
                    premium: isPlayerPremium()
                };

                if (!snap.exists) {
                    return ref.set(payload).then(function () {
                        lastError = "";
                        return { ok: true, action: "created" };
                    });
                }

                var prev = snap.data() || {};
                var prevScore = Number(prev.score) || 0;
                if (score > prevScore || (payload.premium && !prev.premium)) {
                    return ref.set(payload, { merge: true }).then(function () {
                        lastError = "";
                        return { ok: true, action: score > prevScore ? "updated" : "premium_flag", previous: prevScore };
                    });
                }

                /* Not a personal best — keep cloud record */
                lastError = "";
                return { ok: true, action: "kept", previous: prevScore };
            }).catch(function (err) {
                lastError = String(err && err.message || err);
                console.warn("[SpaceStrike] submit failed", err);
                return { ok: false, reason: "error", error: lastError };
            });
        });
    }

    function fetchTop(limit) {
        limit = limit || 20;
        return init().then(function (ok) {
            if (!ok || !db) return [];
            return db.collection("scores")
                .orderBy("score", "desc")
                .limit(limit)
                .get()
                .then(function (snap) {
                    var rows = [];
                    snap.forEach(function (doc) {
                        var d = doc.data() || {};
                        rows.push({
                            id: doc.id,
                            name: d.name || "———",
                            score: Number(d.score) || 0,
                            wave: Number(d.wave) || 1,
                            date: d.date || 0,
                            premium: !!d.premium
                        });
                    });
                    lastError = "";
                    return rows;
                })
                .catch(function (err) {
                    lastError = String(err && err.message || err);
                    console.warn("[SpaceStrike] fetch failed", err);
                    return db.collection("scores").limit(80).get().then(function (snap) {
                        var rows = [];
                        snap.forEach(function (doc) {
                            var d = doc.data() || {};
                            rows.push({
                                id: doc.id,
                                name: d.name || "———",
                                score: Number(d.score) || 0,
                                wave: Number(d.wave) || 1,
                                date: d.date || 0
                            });
                        });
                        rows.sort(function (a, b) {
                            return b.score - a.score || b.wave - a.wave;
                        });
                        return rows.slice(0, limit);
                    }).catch(function (err2) {
                        lastError = String(err2 && err2.message || err2);
                        return [];
                    });
                });
        });
    }


    /**
     * Set premium badge on ranking for current pilot WITHOUT needing a higher score.
     */
    function markPremium(nameOpt) {
        var name = resolveName(nameOpt);
        if (name.length < 7 || name.length > 12) {
            try {
                if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.getName) {
                    name = resolveName(window.SpaceStrikePlayer.getName());
                }
            } catch (e) {}
        }
        if (name.length < 7 || name.length > 12) {
            return Promise.resolve({ ok: false, reason: "name" });
        }
        var docId = nameToId(name);
        if (!docId) return Promise.resolve({ ok: false, reason: "name" });

        return init().then(function (ok) {
            if (!ok || !db) return { ok: false, reason: "offline" };
            var ref = db.collection("scores").doc(docId);
            return ref.get().then(function (snap) {
                var payload = { premium: true, name: name };
                if (!snap.exists) {
                    /* create minimal row so badge can show */
                    payload.score = 0;
                    payload.wave = 1;
                    payload.date = Date.now();
                }
                return ref.set(payload, { merge: true }).then(function () {
                    return { ok: true };
                });
            });
        }).catch(function (err) {
            console.warn("[SpaceStrike] markPremium", err);
            return { ok: false, error: String(err && err.message || err) };
        });
    }


    /**
     * Push the best local infinite score for the current pilot to global.
     * Fixes cases where local high score never reached Firebase (crash, offline, old version).
     */
    function syncLocalBest() {
        var name = resolveName("");
        if (name.length < 7 || name.length > 12) {
            lastError = "Registra un piloto (7-12 caracteres) en el menú";
            return Promise.resolve({ ok: false, reason: "name", error: lastError });
        }

        var best = 0;
        var bestWave = 1;

        try {
            var hs = Number(localStorage.getItem("spaceStrikeHighScore") || 0);
            if (Number.isFinite(hs) && hs > best) best = Math.floor(hs);
            var off = Number(localStorage.getItem("spaceStrikeOfflineHighScore") || 0);
            if (Number.isFinite(off) && off > best) best = Math.floor(off);
        } catch (e0) {}

        try {
            if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.loadProfile) {
                var pr = window.SpaceStrikePlayer.loadProfile();
                if (pr) {
                    if (pr.bestInfinite && pr.bestInfinite > best) best = Math.floor(pr.bestInfinite);
                    if (pr.bestWave) bestWave = Math.max(bestWave, Math.floor(pr.bestWave));
                }
            }
        } catch (e1) {}

        try {
            var board = [];
            if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.loadLeaderboard) {
                board = window.SpaceStrikePlayer.loadLeaderboard() || [];
            } else {
                board = JSON.parse(localStorage.getItem("spaceStrikeLeaderboard") || "[]");
            }
            var key = name.toLowerCase();
            (board || []).forEach(function (row) {
                if (!row) return;
                if (String(row.name || "").toLowerCase() !== key) return;
                var sc = Math.floor(Number(row.score) || 0);
                if (sc > best) best = sc;
                var w = Math.floor(Number(row.wave || row.level) || 0);
                if (w > bestWave) bestWave = w;
            });
        } catch (e2) {}

        if (best <= 0) {
            lastError = "No hay score local para subir";
            return Promise.resolve({ ok: false, reason: "score", error: lastError, score: 0 });
        }

        return submitScore(name, best, bestWave).then(function (res) {
            if (res && res.ok) {
                try {
                    if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.clearLocalRankingTraces) {
                        window.SpaceStrikePlayer.clearLocalRankingTraces();
                    } else {
                        localStorage.removeItem("spaceStrikeLeaderboard");
                        localStorage.removeItem("spaceStrikeOfflineBoard");
                        localStorage.removeItem("spaceStrikeOfflineHighScore");
                    }
                } catch (eClr) {}
                return Object.assign({ score: best, wave: bestWave, name: name }, res);
            }
            return res || { ok: false, reason: "error" };
        });
    }

    
    /**
     * ADMIN ONLY — delete every document in scores collection (global ranking wipe).
     * Batched (max 400 ops per commit).
     */
    function resetGlobalRanking() {
        return init().then(function (ok) {
            if (!ok || !db) {
                return { ok: false, error: "Firebase no disponible" };
            }
            var email = "";
            try {
                if (window.SpaceStrikeCodes && window.SpaceStrikeCodes.isAdmin) {
                    if (!window.SpaceStrikeCodes.isAdmin()) {
                        return { ok: false, error: "No autorizado (solo admin)" };
                    }
                } else if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.user) {
                    var u = window.SpaceStrikeAuth.user();
                    email = (u && u.email) ? String(u.email).toLowerCase() : "";
                    var admins = ["ricardotorresgalvez005@gmail.com", "yocepliliamurguia@gmail.com"];
                    if (admins.indexOf(email) < 0) {
                        return { ok: false, error: "No autorizado (solo admin)" };
                    }
                } else {
                    return { ok: false, error: "Inicia sesión como admin" };
                }
            } catch (e) {
                return { ok: false, error: String(e && e.message || e) };
            }

            return db.collection("scores").get().then(function (snap) {
                var docs = [];
                snap.forEach(function (doc) { docs.push(doc.ref); });
                if (!docs.length) {
                    return { ok: true, deleted: 0, message: "Ranking ya estaba vacío" };
                }
                var deleted = 0;
                function commitChunk(start) {
                    if (start >= docs.length) {
                        return Promise.resolve({ ok: true, deleted: deleted });
                    }
                    var batch = db.batch();
                    var end = Math.min(start + 400, docs.length);
                    for (var i = start; i < end; i++) {
                        batch.delete(docs[i]);
                        deleted++;
                    }
                    return batch.commit().then(function () {
                        return commitChunk(end);
                    });
                }
                return commitChunk(0);
            }).then(function (res) {
                /* also clear local high score cache of this device */
                try {
                    localStorage.setItem("spaceStrikeHighScore", "0");
                    localStorage.setItem("spaceStrikeLeaderboard", "[]");
                } catch (e2) {}
                return res;
            });
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    /**
     * ADMIN — set highScore=0 on all users docs (so cloud progress doesn't re-inflate ranking).
     */
    function resetAllUsersHighScores() {
        return init().then(function (ok) {
            if (!ok || !db) return { ok: false, error: "Firebase no disponible" };
            try {
                if (window.SpaceStrikeCodes && window.SpaceStrikeCodes.isAdmin && !window.SpaceStrikeCodes.isAdmin()) {
                    return { ok: false, error: "No autorizado (solo admin)" };
                }
            } catch (e) {}
            return db.collection("users").get().then(function (snap) {
                var refs = [];
                snap.forEach(function (doc) { refs.push(doc.ref); });
                var updated = 0;
                function chunk(start) {
                    if (start >= refs.length) return Promise.resolve({ ok: true, updated: updated });
                    var batch = db.batch();
                    var end = Math.min(start + 400, refs.length);
                    for (var i = start; i < end; i++) {
                        batch.set(refs[i], { highScore: 0, rankingResetAt: Date.now() }, { merge: true });
                        updated++;
                    }
                    return batch.commit().then(function () { return chunk(end); });
                }
                return chunk(0);
            });
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    function wipeRankingAndScores() {
        return resetGlobalRanking().then(function (a) {
            if (!a || !a.ok) return a;
            return resetAllUsersHighScores().then(function (b) {
                return {
                    ok: !!(b && b.ok),
                    deleted: a.deleted || 0,
                    usersReset: (b && b.updated) || 0,
                    error: b && b.error,
                    message: "Ranking borrado (" + (a.deleted || 0) + " entradas). High scores de usuarios en 0 (" + ((b && b.updated) || 0) + ")."
                };
            });
        });
    }


    function clearLocalRankingIfOnline() {
        try {
            if (navigator.onLine === false) return;
            if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.clearLocalRankingTraces) {
                window.SpaceStrikePlayer.clearLocalRankingTraces();
            } else {
                localStorage.removeItem("spaceStrikeLeaderboard");
                localStorage.removeItem("spaceStrikeOfflineBoard");
                localStorage.removeItem("spaceStrikeOfflineHighScore");
            }
        } catch (e) {}
    }

    function onReconnectSync() {
        if (navigator.onLine === false) return;
        syncLocalBest().then(function () {
            clearLocalRankingIfOnline();
        }).catch(function () {
            clearLocalRankingIfOnline();
        });
    }

    if (typeof window !== "undefined") {
        window.addEventListener("online", function () { onReconnectSync(); });
        setTimeout(function () {
            if (navigator.onLine !== false) onReconnectSync();
        }, 2500);
    }

window.SpaceStrikeGlobalLB = {
        resetGlobalRanking: resetGlobalRanking,
        resetAllUsersHighScores: resetAllUsersHighScores,
        wipeRankingAndScores: wipeRankingAndScores,
        init: init,
        submit: submitScore,
        top: fetchTop,
        syncLocalBest: syncLocalBest,
        clearLocalRankingIfOnline: clearLocalRankingIfOnline,
        markPremium: markPremium,
        nameToId: nameToId,
        isReady: function () { return ready; },
        lastError: function () { return lastError; }
    };
})();

