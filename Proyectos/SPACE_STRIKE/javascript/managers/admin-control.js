/* ================================================================
   SPACE STRIKE — Super Admin Control (OWNER ONLY for wipe + admin mgmt)
   Owner: ricardotorresgalvez005@gmail.com
   - Only owner can total-wipe all cloud progress
   - Only owner can add/remove other admins (stored in Firestore config/admins)
   - Other admins can use lighter tools (codes) via isAdmin()
================================================================ */

(function (global) {
    "use strict";

    var OWNER_EMAIL = "ricardotorresgalvez005@gmail.com";
    var CONFIG_DOC = "admins";
    var CONFIG_COL = "config";
    /* Seed until cloud loads (owner can change list in UI) */
    var seedAdmins = [
        "ricardotorresgalvez005@gmail.com",
        "yocepliliamurguia@gmail.com"
    ];
    var cachedAdmins = seedAdmins.slice();
    var loaded = false;

    function norm(email) {
        return String(email || "").toLowerCase().trim();
    }

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

    function currentEmail() {
        try {
            if (global.SpaceStrikeAuth && global.SpaceStrikeAuth.user) {
                var u = global.SpaceStrikeAuth.user();
                if (u && u.email) return norm(u.email);
            }
        } catch (e) {}
        try {
            if (global.firebase && firebase.auth && firebase.auth().currentUser) {
                return norm(firebase.auth().currentUser.email);
            }
        } catch (e2) {}
        return "";
    }

    function isOwner() {
        return currentEmail() === OWNER_EMAIL;
    }

    function isAdmin() {
        var email = currentEmail();
        if (!email) return false;
        if (email === OWNER_EMAIL) return true;
        return cachedAdmins.some(function (a) {
            return norm(a) === email;
        });
    }

    function loadAdmins() {
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) {
                loaded = true;
                return { ok: false, admins: cachedAdmins.slice(), error: "Sin Firebase" };
            }
            return db
                .collection(CONFIG_COL)
                .doc(CONFIG_DOC)
                .get()
                .then(function (snap) {
                    if (snap.exists) {
                        var data = snap.data() || {};
                        var list = Array.isArray(data.emails) ? data.emails : [];
                        list = list.map(norm).filter(Boolean);
                        if (list.indexOf(OWNER_EMAIL) < 0) list.unshift(OWNER_EMAIL);
                        cachedAdmins = list;
                    } else {
                        /* first time: seed */
                        cachedAdmins = seedAdmins.map(norm);
                        return db
                            .collection(CONFIG_COL)
                            .doc(CONFIG_DOC)
                            .set({
                                emails: cachedAdmins,
                                owner: OWNER_EMAIL,
                                updatedAt: Date.now()
                            })
                            .then(function () {
                                loaded = true;
                                return { ok: true, admins: cachedAdmins.slice(), seeded: true };
                            });
                    }
                    loaded = true;
                    return { ok: true, admins: cachedAdmins.slice() };
                });
        }).catch(function (err) {
            loaded = true;
            return { ok: false, admins: cachedAdmins.slice(), error: String(err && err.message || err) };
        });
    }

    function saveAdmins(list) {
        if (!isOwner()) {
            return Promise.resolve({ ok: false, error: "Solo el dueño puede editar admins" });
        }
        list = (list || []).map(norm).filter(Boolean);
        if (list.indexOf(OWNER_EMAIL) < 0) list.unshift(OWNER_EMAIL);
        /* unique */
        var seen = {};
        list = list.filter(function (e) {
            if (seen[e]) return false;
            seen[e] = true;
            return true;
        });
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, error: "Sin Firebase" };
            return db
                .collection(CONFIG_COL)
                .doc(CONFIG_DOC)
                .set({
                    emails: list,
                    owner: OWNER_EMAIL,
                    updatedAt: Date.now(),
                    updatedBy: currentEmail()
                }, { merge: true })
                .then(function () {
                    cachedAdmins = list;
                    return { ok: true, admins: list.slice() };
                });
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    function addAdmin(email) {
        if (!isOwner()) {
            return Promise.resolve({ ok: false, error: "Solo el dueño puede agregar admins" });
        }
        email = norm(email);
        if (!email || email.indexOf("@") < 0) {
            return Promise.resolve({ ok: false, error: "Email inválido" });
        }
        return loadAdmins().then(function () {
            var list = cachedAdmins.slice();
            if (list.indexOf(email) >= 0) {
                return { ok: true, admins: list, message: "Ya era admin" };
            }
            list.push(email);
            return saveAdmins(list);
        });
    }

    function removeAdmin(email) {
        if (!isOwner()) {
            return Promise.resolve({ ok: false, error: "Solo el dueño puede quitar admins" });
        }
        email = norm(email);
        if (email === OWNER_EMAIL) {
            return Promise.resolve({ ok: false, error: "No puedes quitar al dueño" });
        }
        return loadAdmins().then(function () {
            var list = cachedAdmins.filter(function (a) {
                return norm(a) !== email;
            });
            return saveAdmins(list);
        });
    }

    function batchDeleteCollection(db, colName) {
        return db.collection(colName).get().then(function (snap) {
            var refs = [];
            snap.forEach(function (doc) {
                refs.push(doc.ref);
            });
            var deleted = 0;
            function chunk(start) {
                if (start >= refs.length) {
                    return Promise.resolve(deleted);
                }
                var batch = db.batch();
                var end = Math.min(start + 400, refs.length);
                for (var i = start; i < end; i++) {
                    batch.delete(refs[i]);
                    deleted++;
                }
                return batch.commit().then(function () {
                    return chunk(end);
                });
            }
            return chunk(0);
        });
    }

    /**
     * TOTAL WIPE — OWNER ONLY.
     * Deletes: scores, users, and optional extra collections.
     * Does NOT delete config/admins (keeps your admin list).
     * Does NOT delete premiumCodes / reward codes by default (set wipeCodes=true).
     */
    function totalWipe(opts) {
        opts = opts || {};
        if (!isOwner()) {
            return Promise.resolve({
                ok: false,
                error: "PROHIBIDO: solo el dueño (ricardotorresgalvez005@gmail.com) puede hacer wipe total"
            });
        }
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) {
                return { ok: false, error: "Sin Firebase" };
            }
            var report = { scores: 0, users: 0, codes: 0, rewards: 0 };

            var chain = batchDeleteCollection(db, "scores").then(function (n) {
                report.scores = n;
                return batchDeleteCollection(db, "users");
            }).then(function (n) {
                report.users = n;
                if (opts.wipeCodes) {
                    return batchDeleteCollection(db, "premiumCodes").then(function (n2) {
                        report.codes = n2;
                        return batchDeleteCollection(db, "rewardCodes");
                    }).then(function (n3) {
                        report.rewards = n3;
                    });
                }
            }).then(function () {
                /* local wipe on this device */
                try {
                    var keys = [];
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (k && k.indexOf("spaceStrike") === 0) keys.push(k);
                    }
                    keys.forEach(function (k) {
                        try {
                            localStorage.removeItem(k);
                        } catch (e) {}
                    });
                } catch (e2) {}
                return {
                    ok: true,
                    report: report,
                    message:
                        "WIPE TOTAL OK. scores=" +
                        report.scores +
                        " users=" +
                        report.users +
                        (opts.wipeCodes
                            ? " codes=" + report.codes + " rewards=" + report.rewards
                            : " (códigos premium/recompensa conservados)")
                };
            });

            return chain;
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    /* boot: load admins when possible */
    function init() {
        return loadAdmins();
    }

    global.SpaceStrikeAdmin = {
        OWNER_EMAIL: OWNER_EMAIL,
        init: init,
        loadAdmins: loadAdmins,
        getAdmins: function () {
            return cachedAdmins.slice();
        },
        isOwner: isOwner,
        isAdmin: isAdmin,
        addAdmin: addAdmin,
        removeAdmin: removeAdmin,
        saveAdmins: saveAdmins,
        totalWipe: totalWipe
    };

    /* Patch existing isAdmin helpers when ready */
    function patchIsAdmin() {
        if (global.SpaceStrikeCodes) {
            global.SpaceStrikeCodes.isAdmin = isAdmin;
            global.SpaceStrikeCodes.isOwner = isOwner;
        }
        if (global.SpaceStrikeRewards) {
            global.SpaceStrikeRewards.isAdmin = isAdmin;
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            init().then(patchIsAdmin);
            setTimeout(patchIsAdmin, 1500);
        });
    } else {
        init().then(patchIsAdmin);
        setTimeout(patchIsAdmin, 1500);
    }
})(typeof window !== "undefined" ? window : this);
