/* One-time premium codes via Firestore — admin generate, always single-use */
(function () {
    var COL = "premiumCodes";
    var ADMIN_EMAILS = [
        "ricardotorresgalvez005@gmail.com",
        "yocepliliamurguia@gmail.com"
    ];

    function getDb() {
        if (window.firebase && firebase.apps && firebase.apps.length) {
            return firebase.firestore();
        }
        return null;
    }

    function ensureFirebase() {
        if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.init) {
            return window.SpaceStrikeAuth.init();
        }
        if (window.SpaceStrikeGlobalLB && window.SpaceStrikeGlobalLB.init) {
            return window.SpaceStrikeGlobalLB.init();
        }
        return Promise.resolve(!!getDb());
    }

    function getAdminEmail() {
        try {
            var u = window.SpaceStrikeAuth && window.SpaceStrikeAuth.user && window.SpaceStrikeAuth.user();
            if (u && u.email) return String(u.email).toLowerCase().trim();
        } catch (e) {}
        try {
            if (window.firebase && firebase.auth && firebase.auth().currentUser) {
                return String(firebase.auth().currentUser.email || "").toLowerCase().trim();
            }
        } catch (e2) {}
        return "";
    }

    function isAdmin() {
        try {
            if (window.SpaceStrikeAdmin && typeof window.SpaceStrikeAdmin.isAdmin === "function") {
                return !!window.SpaceStrikeAdmin.isAdmin();
            }
        } catch (e) {}
        var email = getAdminEmail();
        if (!email) return false;
        return ADMIN_EMAILS.some(function (a) {
            return email === String(a).toLowerCase().trim();
        });
    }
    function isOwner() {
        try {
            if (window.SpaceStrikeAdmin && typeof window.SpaceStrikeAdmin.isOwner === "function") {
                return !!window.SpaceStrikeAdmin.isOwner();
            }
        } catch (e) {}
        return getAdminEmail() === "ricardotorresgalvez005@gmail.com";
    }

    function normalizeCode(code) {
        return String(code || "").trim().toUpperCase().replace(/\s+/g, "");
    }

    function randomCode(prefix) {
        var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var s = "";
        for (var i = 0; i < 8; i++) {
            s += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        var pre = normalizeCode(prefix || "VIP");
        if (pre.length > 8) pre = pre.slice(0, 8);
        return pre + "-" + s;
    }

    function redeemCode(code) {
        code = normalizeCode(code);
        if (code.length < 6) {
            return Promise.resolve({ ok: false, error: "Código demasiado corto" });
        }

        /* Legacy static codes */
        if (window.SpaceStrikePremium && window.SpaceStrikePremium.redeem) {
            var legacy = window.SpaceStrikePremium.redeem(code);
            if (legacy && legacy.ok) {
                if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.push) {
                    try { window.SpaceStrikeAuth.push(); } catch (e) {}
                }
                /* Apply ranking badge immediately */
                if (window.SpaceStrikeGlobalLB && window.SpaceStrikeGlobalLB.markPremium) {
                    try {
                        window.SpaceStrikeGlobalLB.markPremium().catch(function () {});
                    } catch (e2) {}
                }
                return Promise.resolve(legacy);
            }
        }

        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin conexión a la nube" };

            var ref = db.collection(COL).doc(code);
            return db
                .runTransaction(function (tx) {
                    return tx.get(ref).then(function (snap) {
                        if (!snap.exists) throw new Error("Código inválido");
                        var d = snap.data() || {};
                        if (d.used === true) throw new Error("Código ya usado");
                        var uid = null;
                        try {
                            if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.user()) {
                                uid = window.SpaceStrikeAuth.user().uid;
                            }
                        } catch (e) {}
                        tx.update(ref, {
                            used: true,
                            usedAt: Date.now(),
                            usedBy: uid || "local"
                        });
                        return true;
                    });
                })
                .then(function () {
                    if (window.SpaceStrikePremium && window.SpaceStrikePremium.activate) {
                        window.SpaceStrikePremium.activate();
                    } else {
                        localStorage.setItem("spaceStrikePremium", "1");
                    }
                    if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.push) {
                        try { window.SpaceStrikeAuth.push(); } catch (e3) {}
                    }
                    if (window.SpaceStrikeGlobalLB && window.SpaceStrikeGlobalLB.markPremium) {
                        return window.SpaceStrikeGlobalLB.markPremium().then(function () {
                            return { ok: true, message: "¡Premium activado! Badge dorado en ranking." };
                        });
                    }
                    return { ok: true, message: "¡Premium activado!" };
                })
                .catch(function (err) {
                    return { ok: false, error: String(err.message || err) };
                });
        });
    }

    /** Admin only — always single-use */
    function createCode(opts) {
        opts = opts || {};
        if (!isAdmin()) {
            return Promise.resolve({ ok: false, error: "No autorizado" });
        }
        var code = opts.code ? normalizeCode(opts.code) : randomCode(opts.prefix || "VIP");
        if (code.length < 6) {
            return Promise.resolve({ ok: false, error: "Código inválido" });
        }

        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase" };
            var ref = db.collection(COL).doc(code);
            return ref.get().then(function (snap) {
                if (snap.exists) {
                    code = randomCode(opts.prefix || "VIP");
                    ref = db.collection(COL).doc(code);
                }
                var data = {
                    used: false,
                    createdAt: Date.now(),
                    createdBy: getAdminEmail(),
                    singleUse: true
                };
                return ref.set(data).then(function () {
                    return { ok: true, code: code };
                });
            });
        }).catch(function (err) {
            return { ok: false, error: String(err.message || err) };
        });
    }

    function shipCatalog() {
        return (window.SpaceStrikeShips && window.SpaceStrikeShips.catalog) || {};
    }

    function sanitizeLevels(levels) {
        var out = {};
        if (!levels || typeof levels !== "object") return out;
        Object.keys(levels).forEach(function (key) {
            var id = Number(key);
            var stars = Math.max(0, Math.min(3, Math.floor(Number(levels[key]) || 0)));
            if (Number.isFinite(id) && id >= 1 && id <= 500 && stars > 0) {
                out[String(Math.floor(id))] = stars;
            }
        });
        return out;
    }

    function sanitizeShips(list) {
        var catalog = shipCatalog();
        var out = [];
        if (Array.isArray(list)) {
            list.forEach(function (id) {
                id = String(id || "").toLowerCase().trim();
                if (id && catalog[id] && out.indexOf(id) < 0) out.push(id);
            });
        }
        if (out.indexOf("interceptor") < 0) out.unshift("interceptor");
        return out;
    }

    function scoreDocId(name) {
        name = String(name || "").trim();
        var id = "";
        if (window.SpaceStrikeGlobalLB && window.SpaceStrikeGlobalLB.nameToId) {
            id = window.SpaceStrikeGlobalLB.nameToId(name) || "";
        }
        if (!id) id = name.toLowerCase().replace(/[^a-z0-9_\-]/g, "_").slice(0, 32);
        return id;
    }

    /** Admin: list game users from the users collection, with their ranking row. */
    function listRegisteredUsers() {
        if (!isAdmin()) {
            return Promise.resolve({ ok: false, error: "No autorizado", rows: [] });
        }
        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase", rows: [] };

            return Promise.all([
                db.collection("users").limit(300).get(),
                db.collection("scores").limit(300).get()
            ]).then(function (parts) {
                var userRows = {};
                var scoreRows = {};
                parts[0].forEach(function (doc) {
                    var d = doc.data() || {};
                    var profile = d.profile || {};
                    var name = String(profile.name || d.name || "").trim();
                    userRows[doc.id] = {
                        uid: doc.id,
                        email: d.email || "",
                        name: name || doc.id,
                        score: Number(d.highScore) || 0,
                        wave: Number(profile.bestWave) || 0,
                        premium: !!d.premium,
                        ships: sanitizeShips(d.ships || []),
                        levels: sanitizeLevels(d.adventure && d.adventure.levels),
                        updatedAt: Number(d.updatedAt) || 0
                    };
                });
                parts[1].forEach(function (doc) {
                    var d = doc.data() || {};
                    var name = String(d.name || "").trim();
                    scoreRows[name.toLowerCase()] = {
                        id: doc.id,
                        score: Number(d.score) || 0,
                        wave: Number(d.wave) || 0,
                        premium: !!d.premium,
                        date: Number(d.date) || 0
                    };
                });

                var rows = Object.keys(userRows).map(function (uid) {
                    var r = userRows[uid];
                    var sc = scoreRows[String(r.name).toLowerCase()];
                    if (sc) {
                        r.score = Math.max(r.score, sc.score);
                        r.wave = Math.max(r.wave, sc.wave);
                        r.premium = r.premium || sc.premium;
                    }
                    return r;
                });

                /* Include legacy ranking pilots that have no users/{uid} document. */
                Object.keys(scoreRows).forEach(function (key) {
                    var sc = scoreRows[key];
                    var exists = rows.some(function (r) { return String(r.name).toLowerCase() === key; });
                    if (!exists) {
                        rows.push({
                            uid: "",
                            email: "",
                            name: key,
                            score: sc.score,
                            wave: sc.wave,
                            premium: sc.premium,
                            ships: [],
                            levels: {},
                            updatedAt: sc.date,
                            legacy: true
                        });
                    }
                });

                rows.sort(function (a, b) {
                    return (b.score - a.score) || String(a.name).localeCompare(String(b.name));
                });
                return { ok: true, rows: rows };
            }).catch(function (err) {
                return { ok: false, error: String(err.message || err), rows: [] };
            });
        });
    }

    /** Admin: read one complete game profile for manual recovery/editing. */
    function getUserData(uid) {
        if (!isAdmin()) return Promise.resolve({ ok: false, error: "No autorizado" });
        uid = String(uid || "").trim();
        if (!uid) return Promise.resolve({ ok: false, error: "UID inválido" });
        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase" };
            return db.collection("users").doc(uid).get().then(function (snap) {
                if (!snap.exists) return { ok: false, error: "Usuario no encontrado" };
                var data = snap.data() || {};
                var profile = data.profile || {};
                var name = String(profile.name || data.name || "").trim();
                var scoreId = scoreDocId(name);
                return db.collection("scores").doc(scoreId).get().then(function (scoreSnap) {
                    var score = scoreSnap.exists ? (scoreSnap.data() || {}) : {};
                    var ships = sanitizeShips(data.ships || []);
                    var equipped = String(data.equipped || "interceptor").toLowerCase().trim();
                    if (ships.indexOf(equipped) < 0) equipped = "interceptor";
                    return {
                        ok: true,
                        user: {
                            uid: uid,
                            email: data.email || "",
                            name: name,
                            coins: Math.max(0, Math.floor(Number(data.coins) || 0)),
                            xp: Math.max(0, Math.floor(Number(data.xp) || 0)),
                            premium: !!data.premium,
                            highScore: Math.max(0, Math.floor(Number(data.highScore) || 0), Math.floor(Number(score.score) || 0)),
                            bestWave: Math.max(0, Math.floor(Number(profile.bestWave) || 0), Math.floor(Number(score.wave) || 0)),
                            levels: sanitizeLevels(data.adventure && data.adventure.levels),
                            ships: ships,
                            equipped: equipped,
                            profile: profile,
                            adventure: data.adventure || { levels: {} },
                            upgrades: data.upgrades || {},
                            rank: data.rank || null,
                            vipXp: Math.max(0, Math.floor(Number(data.vipXp) || 0)),
                            achievements: data.achievements || {},
                            settings: data.settings || {},
                            scoreDocId: scoreId,
                            scoreExists: scoreSnap.exists
                        }
                    };
                });
            });
        }).catch(function (err) {
            return { ok: false, error: String(err.message || err) };
        });
    }

    /** Admin: manually repair progression/inventory/ranking data for a player. */
    function updateUserData(uid, patch) {
        if (!isAdmin()) return Promise.resolve({ ok: false, error: "No autorizado" });
        uid = String(uid || "").trim();
        patch = patch || {};
        if (!uid) return Promise.resolve({ ok: false, error: "UID inválido" });

        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase" };
            var userRef = db.collection("users").doc(uid);
            return userRef.get().then(function (snap) {
                if (!snap.exists) throw new Error("Usuario no encontrado");
                var old = snap.data() || {};
                var profile = Object.assign({}, old.profile || {});
                var name = String(profile.name || old.name || "").trim();
                if (!name) throw new Error("El usuario no tiene nombre de piloto");

                var ships = sanitizeShips(patch.ships);
                var equipped = String(patch.equipped || "interceptor").toLowerCase().trim();
                if (ships.indexOf(equipped) < 0) equipped = "interceptor";
                var levels = sanitizeLevels(patch.levels);
                var highScore = Math.max(0, Math.min(50000000, Math.floor(Number(patch.highScore) || 0)));
                var bestWave = Math.max(0, Math.min(1000000, Math.floor(Number(patch.bestWave) || 0)));
                var coins = Math.max(0, Math.min(1000000000, Math.floor(Number(patch.coins) || 0)));
                var xp = Math.max(0, Math.min(1000000000, Math.floor(Number(patch.xp) || 0)));
                var premium = !!patch.premium;

                profile.bestInfinite = highScore;
                profile.bestWave = bestWave;

                var adventure = Object.assign({}, old.adventure || {}, { levels: levels });
                var userPayload = {
                    profile: profile,
                    coins: coins,
                    ships: ships,
                    equipped: equipped,
                    premium: premium,
                    adventure: adventure,
                    highScore: highScore,
                    xp: xp,
                    updatedAt: Date.now(),
                    source: "admin-recovery"
                };

                var scoreId = scoreDocId(name);
                var scoreRef = db.collection("scores").doc(scoreId);
                var scorePayload = {
                    name: name,
                    score: highScore,
                    wave: bestWave,
                    premium: premium,
                    date: Date.now()
                };

                return Promise.all([
                    userRef.set(userPayload, { merge: true }),
                    scoreRef.set(scorePayload, { merge: true })
                ]).then(function () {
                    return { ok: true, uid: uid, name: name, score: highScore, wave: bestWave, ships: ships, equipped: equipped };
                });
            });
        }).catch(function (err) {
            return { ok: false, error: String(err.message || err) };
        });
    }

    /** Admin: delete game data for a player. This does NOT delete the Google/Firebase account. */
    function deleteUserData(uid) {
        if (!isAdmin()) return Promise.resolve({ ok: false, error: "No autorizado" });
        uid = String(uid || "").trim();
        if (!uid) return Promise.resolve({ ok: false, error: "UID inválido" });
        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase" };
            var userRef = db.collection("users").doc(uid);
            return userRef.get().then(function (snap) {
                if (!snap.exists) throw new Error("Usuario no encontrado");
                var data = snap.data() || {};
                var profile = data.profile || {};
                var name = String(profile.name || data.name || "").trim();
                var scoreId = scoreDocId(name);
                var batch = db.batch();
                batch.delete(userRef);
                if (scoreId) batch.delete(db.collection("scores").doc(scoreId));
                return batch.commit().then(function () {
                    return { ok: true, uid: uid, name: name, deletedGameData: true, authAccountDeleted: false };
                });
            });
        }).catch(function (err) {
            return { ok: false, error: String(err.message || err) };
        });
    }

    /** Admin: set premium flag on a pilot in scores without beating score */
    function setUserPremium(name, on) {
        if (!isAdmin()) {
            return Promise.resolve({ ok: false, error: "No autorizado" });
        }
        name = String(name || "").trim();
        if (name.length < 7) {
            return Promise.resolve({ ok: false, error: "Nombre inválido" });
        }
        return ensureFirebase().then(function () {
            var db = getDb();
            if (!db) return { ok: false, error: "Sin Firebase" };
            var docId = scoreDocId(name);
            var ref = db.collection("scores").doc(docId);
            return ref.set({ premium: !!on, name: name }, { merge: true }).then(function () {
                return { ok: true };
            });
        }).catch(function (err) {
            return { ok: false, error: String(err.message || err) };
        });
    }

    window.SpaceStrikeCodes = {
        redeem: redeemCode,
        createCode: createCode,
        generate: function (count, prefix) {
            /* compat: generate N single-use codes (admin) */
            if (!isAdmin()) return Promise.resolve({ ok: false, error: "No autorizado", codes: [] });
            count = Math.min(20, Math.max(1, count || 1));
            var chain = Promise.resolve({ ok: true, codes: [] });
            var all = [];
            for (var i = 0; i < count; i++) {
                chain = chain.then(function () {
                    return createCode({ prefix: prefix || "VIP" }).then(function (res) {
                        if (res && res.ok) all.push(res.code);
                        return { ok: true, codes: all };
                    });
                });
            }
            return chain;
        },
        listUsers: listRegisteredUsers,
        getUserData: getUserData,
        updateUserData: updateUserData,
        deleteUserData: deleteUserData,
        setUserPremium: setUserPremium,
        isAdmin: isAdmin,
        isOwner: isOwner,
        getAdminEmail: getAdminEmail,
        ADMIN_EMAILS: ADMIN_EMAILS,
        ADMIN_EMAIL: ADMIN_EMAILS[0]
    };
})();
