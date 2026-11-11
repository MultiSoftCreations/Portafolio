/* ================================================================
   SPACE STRIKE v3.0 — PlayerData
   Single facade over legacy localStorage keys.
   Does NOT wipe or rename keys — wraps existing v2.x storage.
================================================================ */

(function (global) {
    "use strict";

    var KEYS = {
        coins: "spaceStrikeCoins",
        upgrades: "spaceStrikeUpgrades",
        ownedShips: "spaceStrikeOwnedShips",
        equippedShip: "spaceStrikeEquippedShip",
        premium: "spaceStrikePremium",
        highScore: "spaceStrikeHighScore",
        pilotName: "spaceStrikePilotName",
        settings: "spaceStrikeSettings",
        adventureStars: "spaceStrikeAdventureStars",
        achievements: "spaceStrikeAchievements",
        shipsMeta: "spaceStrikeShipsMeta"
    };

    function safeParse(raw, fallback) {
        try {
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (e) {
            return fallback;
        }
    }

    function getCoins() {
        if (global.SpaceStrikeUpgrades && global.SpaceStrikeUpgrades.loadCoins) {
            return global.SpaceStrikeUpgrades.loadCoins();
        }
        try {
            var n = Number(localStorage.getItem(KEYS.coins) || 0);
            return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
        } catch (e) {
            return 0;
        }
    }

    function setCoins(amount) {
        amount = Math.max(0, Math.floor(Number(amount) || 0));
        if (global.SpaceStrikeUpgrades && global.SpaceStrikeUpgrades.saveCoins) {
            global.SpaceStrikeUpgrades.saveCoins(amount);
            return amount;
        }
        try {
            localStorage.setItem(KEYS.coins, String(amount));
        } catch (e) {}
        return amount;
    }

    function addCoins(delta) {
        return setCoins(getCoins() + Math.max(0, Math.floor(Number(delta) || 0)));
    }

    function getUpgrades() {
        if (global.SpaceStrikeUpgrades && global.SpaceStrikeUpgrades.loadUpgrades) {
            return global.SpaceStrikeUpgrades.loadUpgrades();
        }
        return safeParse(localStorage.getItem(KEYS.upgrades), {});
    }

    function setUpgrade(id, level) {
        var u = getUpgrades();
        u[id] = Math.max(0, Math.floor(Number(level) || 0));
        if (global.SpaceStrikeUpgrades && global.SpaceStrikeUpgrades.saveUpgrades) {
            global.SpaceStrikeUpgrades.saveUpgrades(u);
        } else {
            try {
                localStorage.setItem(KEYS.upgrades, JSON.stringify(u));
            } catch (e) {}
        }
        return u;
    }

    function getUpgrade(id) {
        var u = getUpgrades();
        return Math.max(0, Number(u[id]) || 0);
    }

    function getOwnedShips() {
        if (global.SpaceStrikeShips && global.SpaceStrikeShips.loadOwned) {
            return global.SpaceStrikeShips.loadOwned();
        }
        var arr = safeParse(localStorage.getItem(KEYS.ownedShips), ["interceptor"]);
        if (!Array.isArray(arr) || !arr.length) return ["interceptor"];
        return arr;
    }

    function hasShip(id) {
        id = String(id || "").toLowerCase();
        if (global.SpaceStrikeShips && global.SpaceStrikeShips.owns) {
            return !!global.SpaceStrikeShips.owns(id);
        }
        return getOwnedShips().indexOf(id) >= 0;
    }

    function unlockShip(id) {
        id = String(id || "").toLowerCase().trim();
        if (!id) return { ok: false, reason: "empty" };
        if (global.SpaceStrikeShips && global.SpaceStrikeShips.grant) {
            return global.SpaceStrikeShips.grant(id);
        }
        var owned = getOwnedShips();
        if (owned.indexOf(id) < 0) owned.push(id);
        try {
            localStorage.setItem(KEYS.ownedShips, JSON.stringify(owned));
        } catch (e) {}
        return { ok: true, owned: owned };
    }

    function getEquippedShip() {
        if (global.SpaceStrikeShips && global.SpaceStrikeShips.getEquippedId) {
            return global.SpaceStrikeShips.getEquippedId();
        }
        try {
            return localStorage.getItem(KEYS.equippedShip) || "interceptor";
        } catch (e) {
            return "interceptor";
        }
    }

    function setEquippedShip(id) {
        id = String(id || "interceptor").toLowerCase();
        if (global.SpaceStrikeShips && global.SpaceStrikeShips.setEquipped) {
            global.SpaceStrikeShips.setEquipped(id);
            return id;
        }
        try {
            localStorage.setItem(KEYS.equippedShip, id);
        } catch (e) {}
        return id;
    }

    function isPremium() {
        if (global.SpaceStrikePremium && global.SpaceStrikePremium.isPremium) {
            return !!global.SpaceStrikePremium.isPremium();
        }
        try {
            var raw = localStorage.getItem(KEYS.premium);
            if (!raw) return false;
            var p = JSON.parse(raw);
            return !!(p && p.active);
        } catch (e) {
            return false;
        }
    }

    function getHighScore() {
        try {
            var n = Number(localStorage.getItem(KEYS.highScore) || 0);
            return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
        } catch (e) {
            return 0;
        }
    }

    function setHighScore(score) {
        score = Math.max(0, Math.floor(Number(score) || 0));
        var cur = getHighScore();
        if (score <= cur) return cur;
        try {
            localStorage.setItem(KEYS.highScore, String(score));
        } catch (e) {}
        return score;
    }

    function getPilotName() {
        try {
            return localStorage.getItem(KEYS.pilotName) || "";
        } catch (e) {
            return "";
        }
    }

    function snapshot() {
        return {
            version: 1,
            coins: getCoins(),
            upgrades: getUpgrades(),
            ownedShips: getOwnedShips(),
            equippedShip: getEquippedShip(),
            premium: isPremium(),
            highScore: getHighScore(),
            pilotName: getPilotName(),
            settings: safeParse(localStorage.getItem(KEYS.settings), {}),
            adventureStars: safeParse(localStorage.getItem(KEYS.adventureStars), {}),
            achievements: safeParse(localStorage.getItem(KEYS.achievements), {}),
            xp: (function () {
                try { return Number(localStorage.getItem("spaceStrikeXP") || 0) || 0; } catch (e) { return 0; }
            })()
        };
    }

    global.SpaceStrikePlayerData = {
        KEYS: KEYS,
        getCoins: getCoins,
        setCoins: setCoins,
        addCoins: addCoins,
        getUpgrades: getUpgrades,
        getUpgrade: getUpgrade,
        setUpgrade: setUpgrade,
        getOwnedShips: getOwnedShips,
        hasShip: hasShip,
        unlockShip: unlockShip,
        getEquippedShip: getEquippedShip,
        setEquippedShip: setEquippedShip,
        isPremium: isPremium,
        getHighScore: getHighScore,
        setHighScore: setHighScore,
        getPilotName: getPilotName,
        snapshot: snapshot
    };
})(typeof window !== "undefined" ? window : this);
