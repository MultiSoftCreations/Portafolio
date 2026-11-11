/* ================================================================
   SPACE STRIKE v3.0 — SaveManager
   Load / save / validate / migrate player progress.
   Uses PlayerData facade — does not break v2.x keys.
================================================================ */

(function (global) {
    "use strict";

    var SAVE_META_KEY = "spaceStrikeSaveMeta";
    var CURRENT_VERSION = 1;

    function readMeta() {
        try {
            var raw = localStorage.getItem(SAVE_META_KEY);
            if (!raw) return { version: CURRENT_VERSION, lastSave: 0 };
            return Object.assign({ version: 1, lastSave: 0 }, JSON.parse(raw));
        } catch (e) {
            return { version: CURRENT_VERSION, lastSave: 0 };
        }
    }

    function writeMeta(meta) {
        try {
            localStorage.setItem(SAVE_META_KEY, JSON.stringify(meta));
        } catch (e) {}
    }

    function load() {
        var PD = global.SpaceStrikePlayerData;
        if (!PD) {
            console.warn("[SaveManager] PlayerData missing");
            return null;
        }
        var data = PD.snapshot();
        data = migrate(data);
        return data;
    }

    function save() {
        var PD = global.SpaceStrikePlayerData;
        if (!PD) return { ok: false, reason: "no_player_data" };
        var snap = PD.snapshot();
        snap.version = CURRENT_VERSION;
        writeMeta({ version: CURRENT_VERSION, lastSave: Date.now() });
        /* Individual keys already persisted by PlayerData / legacy modules */
        try {
            if (global.SpaceStrikeAuth && typeof global.SpaceStrikeAuth.push === "function") {
                var p = global.SpaceStrikeAuth.push();
                if (p && p.then) p.catch(function () {});
            }
        } catch (e) {}
        return { ok: true, data: snap };
    }

    /**
     * Migrate older snapshots toward CURRENT_VERSION without wiping progress.
     */
    function migrate(data) {
        if (!data || typeof data !== "object") {
            data = { version: CURRENT_VERSION };
        }
        var v = Number(data.version) || 1;

        /* v1: ensure required fields exist */
        if (!Array.isArray(data.ownedShips) || !data.ownedShips.length) {
            data.ownedShips = ["interceptor"];
        }
        if (typeof data.coins !== "number" || data.coins < 0) data.coins = 0;
        if (!data.upgrades || typeof data.upgrades !== "object") data.upgrades = {};
        if (!data.equippedShip) data.equippedShip = "interceptor";
        if (typeof data.highScore !== "number") data.highScore = 0;

        /* Future: if (v < 2) { ... } */

        data.version = CURRENT_VERSION;
        return data;
    }

    function exportJson() {
        var data = load();
        return JSON.stringify(data || {}, null, 2);
    }

    function importJson(text) {
        try {
            var data = JSON.parse(text);
            data = migrate(data);
            var PD = global.SpaceStrikePlayerData;
            if (!PD) return { ok: false, reason: "no_player_data" };

            if (typeof data.coins === "number") PD.setCoins(data.coins);
            if (data.upgrades && global.SpaceStrikeUpgrades && global.SpaceStrikeUpgrades.saveUpgrades) {
                global.SpaceStrikeUpgrades.saveUpgrades(data.upgrades);
            }
            if (Array.isArray(data.ownedShips)) {
                try {
                    localStorage.setItem(PD.KEYS.ownedShips, JSON.stringify(data.ownedShips));
                } catch (e) {}
            }
            if (data.equippedShip) PD.setEquippedShip(data.equippedShip);
            if (typeof data.highScore === "number") {
                try {
                    localStorage.setItem(PD.KEYS.highScore, String(data.highScore));
                } catch (e2) {}
            }
            writeMeta({ version: CURRENT_VERSION, lastSave: Date.now(), imported: true });
            return { ok: true, data: data };
        } catch (e) {
            return { ok: false, reason: "invalid_json", error: String(e) };
        }
    }

    function getMeta() {
        return readMeta();
    }

    global.SpaceStrikeSaveManager = {
        CURRENT_VERSION: CURRENT_VERSION,
        load: load,
        save: save,
        migrate: migrate,
        exportJson: exportJson,
        importJson: importJson,
        getMeta: getMeta
    };
})(typeof window !== "undefined" ? window : this);
