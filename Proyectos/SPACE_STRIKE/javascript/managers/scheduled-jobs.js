/* SPACE STRIKE — Scheduled resets (owner creates; any client can process when due) */
(function (global) {
    "use strict";

    var COL = "scheduledJobs";

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

    function isOwner() {
        return global.SpaceStrikeAdmin && global.SpaceStrikeAdmin.isOwner && global.SpaceStrikeAdmin.isOwner();
    }

    /**
     * @param {object} opts
     *  - runAt: Date or ms
     *  - scope: 'all' | 'ranking' | 'user'
     *  - targetUid / targetEmail / targetPilot (for scope user)
     *  - note
     */
    function scheduleReset(opts) {
        opts = opts || {};
        if (!isOwner()) {
            return Promise.resolve({ ok: false, error: "Solo el dueño puede programar reinicios" });
        }
        var runAt = opts.runAt instanceof Date ? opts.runAt.getTime() : Number(opts.runAt);
        if (!runAt || runAt < Date.now() - 60000) {
            return Promise.resolve({ ok: false, error: "Fecha/hora inválida (debe ser futura)" });
        }
        var scope = opts.scope || "all";
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, error: "Sin Firebase" };
            var email = "";
            try {
                var u = global.SpaceStrikeAuth.user();
                email = (u && u.email) || "";
            } catch (e) {}
            var doc = {
                scope: scope,
                targetUid: opts.targetUid || "",
                targetEmail: (opts.targetEmail || "").toLowerCase(),
                targetPilot: opts.targetPilot || "",
                runAt: runAt,
                note: String(opts.note || "").slice(0, 200),
                done: false,
                createdAt: Date.now(),
                createdBy: email
            };
            return db
                .collection(COL)
                .add(doc)
                .then(function (ref) {
                    return { ok: true, id: ref.id, job: doc };
                });
        }).catch(function (err) {
            return { ok: false, error: String(err && err.message || err) };
        });
    }

    function listJobs(includeDone) {
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, jobs: [] };
            return db
                .collection(COL)
                .orderBy("runAt", "asc")
                .limit(40)
                .get()
                .then(function (snap) {
                    var jobs = [];
                    snap.forEach(function (doc) {
                        var d = doc.data() || {};
                        if (!includeDone && d.done) return;
                        jobs.push(Object.assign({ id: doc.id }, d));
                    });
                    return { ok: true, jobs: jobs };
                });
        });
    }

    function processDueJobs() {
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, processed: 0 };
            var now = Date.now();
            return db
                .collection(COL)
                .where("done", "==", false)
                .where("runAt", "<=", now)
                .limit(10)
                .get()
                .then(function (snap) {
                    var chain = Promise.resolve();
                    var count = 0;
                    snap.forEach(function (doc) {
                        chain = chain.then(function () {
                            return executeJob(doc).then(function () {
                                count++;
                            });
                        });
                    });
                    return chain.then(function () {
                        return { ok: true, processed: count };
                    });
                })
                .catch(function (err) {
                    /* index missing: fallback scan */
                    return db
                        .collection(COL)
                        .where("done", "==", false)
                        .limit(20)
                        .get()
                        .then(function (snap) {
                            var chain = Promise.resolve();
                            var count = 0;
                            snap.forEach(function (doc) {
                                var d = doc.data() || {};
                                if (Number(d.runAt) > now) return;
                                chain = chain.then(function () {
                                    return executeJob(doc).then(function () {
                                        count++;
                                    });
                                });
                            });
                            return chain.then(function () {
                                return { ok: true, processed: count };
                            });
                        });
                });
        });
    }

    function executeJob(doc) {
        var db = getDb();
        var d = doc.data() || {};
        var scope = d.scope || "all";
        var p = Promise.resolve({ ok: true });

        if (scope === "all") {
            if (global.SpaceStrikeAdmin && global.SpaceStrikeAdmin.totalWipe) {
                /* totalWipe checks isOwner — job may run on any device; use internal wipe */
                p = ownerBypassWipe(db, false);
            } else {
                p = ownerBypassWipe(db, false);
            }
        } else if (scope === "ranking") {
            p = wipeScoresOnly(db);
        } else if (scope === "user") {
            p = wipeOneUser(db, d);
        }

        return p
            .then(function (res) {
                return doc.ref.set(
                    {
                        done: true,
                        processedAt: Date.now(),
                        result: res || {}
                    },
                    { merge: true }
                );
            })
            .catch(function (err) {
                return doc.ref.set(
                    {
                        done: true,
                        processedAt: Date.now(),
                        result: { ok: false, error: String(err && err.message || err) }
                    },
                    { merge: true }
                );
            });
    }

    function batchDelete(db, col) {
        return db.collection(col).get().then(function (snap) {
            var refs = [];
            snap.forEach(function (doc) {
                refs.push(doc.ref);
            });
            var n = 0;
            function chunk(i) {
                if (i >= refs.length) return Promise.resolve(n);
                var batch = db.batch();
                var end = Math.min(i + 400, refs.length);
                for (var j = i; j < end; j++) {
                    batch.delete(refs[j]);
                    n++;
                }
                return batch.commit().then(function () {
                    return chunk(end);
                });
            }
            return chunk(0);
        });
    }

    function ownerBypassWipe(db, wipeCodes) {
        return batchDelete(db, "scores").then(function (s) {
            return batchDelete(db, "users").then(function (u) {
                var p = Promise.resolve(0);
                if (wipeCodes) {
                    p = batchDelete(db, "premiumCodes").then(function () {
                        return batchDelete(db, "rewardCodes");
                    });
                }
                return p.then(function () {
                    return { ok: true, scores: s, users: u };
                });
            });
        });
    }

    function wipeScoresOnly(db) {
        return batchDelete(db, "scores").then(function (n) {
            return { ok: true, deleted: n };
        });
    }

    function wipeOneUser(db, d) {
        if (d.targetUid) {
            return db
                .collection("users")
                .doc(d.targetUid)
                .delete()
                .then(function () {
                    return { ok: true, deletedUid: d.targetUid };
                })
                .catch(function (err) {
                    return { ok: false, error: String(err && err.message || err) };
                });
        }
        /* search by email field */
        var email = (d.targetEmail || "").toLowerCase();
        if (!email) return Promise.resolve({ ok: false, error: "Sin target" });
        return db
            .collection("users")
            .where("email", "==", email)
            .limit(5)
            .get()
            .then(function (snap) {
                var batch = db.batch();
                var n = 0;
                snap.forEach(function (doc) {
                    batch.delete(doc.ref);
                    n++;
                });
                if (!n) return { ok: false, error: "Usuario no encontrado" };
                return batch.commit().then(function () {
                    return { ok: true, deleted: n };
                });
            });
    }

    function cancelJob(id) {
        if (!isOwner()) return Promise.resolve({ ok: false, error: "Solo dueño" });
        return ensureFirebase().then(function (ok) {
            var db = getDb();
            if (!ok || !db) return { ok: false, error: "Sin Firebase" };
            return db
                .collection(COL)
                .doc(id)
                .set({ done: true, cancelled: true, processedAt: Date.now() }, { merge: true })
                .then(function () {
                    return { ok: true };
                });
        });
    }

    global.SpaceStrikeJobs = {
        scheduleReset: scheduleReset,
        listJobs: listJobs,
        processDueJobs: processDueJobs,
        cancelJob: cancelJob
    };

    function boot() {
        setTimeout(function () {
            processDueJobs().then(function (r) {
                if (r && r.processed) console.log("[Jobs] processed", r.processed);
            });
        }, 4000);
        /* check every 2 min while page open */
        setInterval(function () {
            processDueJobs();
        }, 120000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})(typeof window !== "undefined" ? window : this);
