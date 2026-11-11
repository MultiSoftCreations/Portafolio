/* SPACE STRIKE 2.4.0 — Google Auth + cloud progress (Firebase) */
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

    var auth = null;
    var db = null;
    var user = null;
    var initPromise = null;

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
            s.onerror = function () { reject(new Error("script " + src)); };
            document.head.appendChild(s);
        });
    }

    function init() {
        if (initPromise) return initPromise;
        initPromise = loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js")
            .then(function () {
                return loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js");
            })
            .then(function () {
                return loadScript("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js");
            })
            .then(function () {
                if (!window.firebase) throw new Error("Firebase missing");
                if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
                auth = firebase.auth();
                db = firebase.firestore();
                auth.onAuthStateChanged(function (u) {
                    user = u;
                    if (u) {
                        pullCloud().catch(function () {});
                    }
                    if (typeof window.__onSpaceAuthChange === "function") {
                        window.__onSpaceAuthChange(u);
                    }
                });
                return true;
            })
            .catch(function (err) {
                console.warn("[Auth]", err);
                return false;
            });
        return initPromise;
    }

    function signInGoogle() {
        return init().then(function (ok) {
            if (!ok || !auth) throw new Error("Auth no disponible");
            var provider = new firebase.auth.GoogleAuthProvider();
            return auth.signInWithPopup(provider).catch(function (err) {
                /* mobile fallback */
                return auth.signInWithRedirect(provider);
            });
        });
    }

    function signOut() {
        if (!auth) return Promise.resolve();
        return auth.signOut();
    }

    function currentUser() {
        return user || (auth && auth.currentUser) || null;
    }

    function collectLocalProgress() {
        function safeParse(key, fallback) {
            try {
                var r = localStorage.getItem(key);
                return r ? JSON.parse(r) : fallback;
            } catch (e) {
                return fallback;
            }
        }
        var premRaw = localStorage.getItem("spaceStrikePremium");
        var premiumFlag = false;
        try {
            if (premRaw === "1") premiumFlag = true;
            else if (premRaw) {
                var pp = JSON.parse(premRaw);
                premiumFlag = !!(pp && (pp.active || pp === true));
            }
        } catch (eP) {}
        return {
            profile: safeParse("spaceStrikeProfile", null),
            coins: Number(localStorage.getItem("spaceStrikeCoins") || 0),
            upgrades: safeParse("spaceStrikeUpgrades", {}),
            ships: (window.SpaceStrikeShips && window.SpaceStrikeShips.loadOwned)
                ? window.SpaceStrikeShips.loadOwned()
                : safeParse("spaceStrikeShips", ["interceptor"]),
            equipped: (window.SpaceStrikeShips && window.SpaceStrikeShips.getEquippedId)
                ? window.SpaceStrikeShips.getEquippedId()
                : (localStorage.getItem("spaceStrikeEquippedShip") || "interceptor"),
            premium: premiumFlag,
            adventure: safeParse("spaceStrikeAdventure", { levels: {} }),
            ownedSkins: (window.SpaceStrikeSkins && window.SpaceStrikeSkins.loadOwned) ? window.SpaceStrikeSkins.loadOwned() : [],
            equippedSkin: (window.SpaceStrikeSkins && window.SpaceStrikeSkins.getEquipped) ? window.SpaceStrikeSkins.getEquipped() : "",
            highScore: Number(localStorage.getItem("spaceStrikeHighScore") || 0),
            rank: safeParse("spaceStrikeRank", null),
            xp: Number(localStorage.getItem("spaceStrikeXP") || 0),
            vipXp: Number(localStorage.getItem("spaceStrikeVipXP") || 0),
            achievements: safeParse("spaceStrikeAchievements", {}),
            settings: safeParse("spaceStrikeSettings", {}),
            source: "local-backup",
            updatedAt: Date.now()
        };
    }

    function applyCloudProgress(data) {
        if (!data) return;
        try {
            if (data.profile) localStorage.setItem("spaceStrikeProfile", JSON.stringify(data.profile));
            if (typeof data.coins === "number") localStorage.setItem("spaceStrikeCoins", String(data.coins));
            if (data.upgrades) localStorage.setItem("spaceStrikeUpgrades", JSON.stringify(data.upgrades));
            if (data.ships || data.equipped) {
                if (window.SpaceStrikeShips && window.SpaceStrikeShips.applyFromCloud) {
                    window.SpaceStrikeShips.applyFromCloud(data.ships || [], data.equipped);
                } else {
                    if (data.ships) {
                        var uni = Array.from(new Set([].concat(
                            (function () { try { return JSON.parse(localStorage.getItem("spaceStrikeShips") || "[]"); } catch (e) { return []; } })(),
                            data.ships
                        )));
                        if (uni.indexOf("interceptor") < 0) uni.unshift("interceptor");
                        localStorage.setItem("spaceStrikeShips", JSON.stringify(uni));
                    }
                    if (data.equipped) localStorage.setItem("spaceStrikeEquippedShip", data.equipped);
                }
            }
            if (data.premium) localStorage.setItem("spaceStrikePremium", "1");
            if (data.adventure) localStorage.setItem("spaceStrikeAdventure", JSON.stringify(data.adventure));
            if (typeof data.highScore === "number") {
                var local = Number(localStorage.getItem("spaceStrikeHighScore") || 0);
                if (data.highScore > local) {
                    try {
                if (data.ownedSkins && window.SpaceStrikeSkins) window.SpaceStrikeSkins.mergeFromCloud(data);
            } catch (eSk) {}
            localStorage.setItem("spaceStrikeHighScore", String(data.highScore));
                }
            }
            if (data.rank) localStorage.setItem("spaceStrikeRank", JSON.stringify(data.rank));
        } catch (e) {
            console.warn("[Auth] apply cloud", e);
        }
    }

    
    /** Online + cloud OK: clear offline backup only (runtime still mirrors cloud in localStorage as cache). */
    function purgeLocalCacheAfterCloud() {
        try {
            if (!navigator.onLine) return;
            localStorage.removeItem("spaceStrikeOfflineBackup");
        } catch (e2) {}
    }

    function writeOfflineBackup(data) {
        try {
            localStorage.setItem(
                "spaceStrikeOfflineBackup",
                JSON.stringify({ at: Date.now(), data: data || collectLocalProgress() })
            );
        } catch (e) {}
    }

    function pushCloud() {
        var u = currentUser();
        if (!u || !db) return Promise.resolve({ ok: false, reason: "nologin" });
        var data = collectLocalProgress();
        data.email = u.email || null;
        data.uid = u.uid;
        return db.collection("users").doc(u.uid).set(data, { merge: true }).then(function () {
            return { ok: true };
        }).catch(function (err) {
            console.warn("[Auth] push", err);
            return { ok: false, error: String(err.message || err) };
        });
    }

    function pullCloud() {
        var u = currentUser();
        if (!u || !db) return Promise.resolve({ ok: false });
        return db.collection("users").doc(u.uid).get().then(function (snap) {
            if (!snap.exists) {
                return pushCloud();
            }
            var cloud = snap.data() || {};
            var local = collectLocalProgress();
            /* merge: take max coins, premium OR, best scores */
            var merged = {
                profile: cloud.profile || local.profile,
                coins: Math.max(Number(cloud.coins) || 0, Number(local.coins) || 0),
                upgrades: Object.assign({}, local.upgrades || {}, cloud.upgrades || {}),
                ships: Array.from(new Set([].concat(local.ships || [], cloud.ships || []))),
                equipped: (function () {
                    var shipsM = Array.from(new Set([].concat(cloud.ships || [], local.ships || [])));
                    /*
                       Equipped ship is a local-first setting.
                       The device where the player just equipped a ship must not
                       be overwritten by an older Firebase value. Cloud is only
                       used when there is no valid local selection.
                    */
                    var eq = "interceptor";
                    if (local.equipped && shipsM.indexOf(local.equipped) >= 0) {
                        eq = local.equipped;
                    } else if (cloud.equipped && shipsM.indexOf(cloud.equipped) >= 0) {
                        eq = cloud.equipped;
                    } else if (shipsM.indexOf("interceptor") >= 0) {
                        eq = "interceptor";
                    }
                    return eq;
                })(),
                premium: !!(cloud.premium || local.premium),
                adventure: (cloud.adventure && cloud.adventure.levels) ? cloud.adventure : local.adventure,
                highScore: Math.max(Number(cloud.highScore) || 0, Number(local.highScore) || 0),
                rank: cloud.rank || local.rank,
                updatedAt: Date.now(),
                email: u.email,
                uid: u.uid
            };
            /* prefer higher upgrade levels */
            if (cloud.upgrades && local.upgrades) {
                Object.keys(cloud.upgrades).forEach(function (k) {
                    merged.upgrades[k] = Math.max(Number(cloud.upgrades[k]) || 0, Number(local.upgrades[k]) || 0);
                });
            }
            applyCloudProgress(merged);
            return db.collection("users").doc(u.uid).set(merged, { merge: true }).then(function(r){ try { purgeLocalCacheAfterCloud(); } catch(eP){} return r; }).then(function () {
                return { ok: true, merged: true };
            });
        });
    }

    /* auto-push every 45s if logged in */
    setInterval(function () {
        if (currentUser()) pushCloud();
    }, 20000);

    /* Public helper: modules call after local change → cloud */
    function queuePush() {
        if (!currentUser()) return;
        try { pushCloud(); } catch (e) {}
    }

    window.addEventListener("beforeunload", function () {
        if (currentUser()) pushCloud();
    });

    window.SpaceStrikeAuth = {
        init: init,
        signInGoogle: signInGoogle,
        signOut: signOut,
        user: currentUser,
        push: pushCloud,
        queuePush: queuePush,
        pull: pullCloud,
        isLoggedIn: function () { return !!currentUser(); }
    };

    init();
})();
