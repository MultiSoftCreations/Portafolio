/* ================================================================
   SPACE STRIKE v3.0 — Progression (XP + Ranks)
================================================================ */

(function (global) {
    "use strict";

    var XP_KEY = "spaceStrikeXP";
    var RANK_KEY = "spaceStrikeRankCache";

    var RANKS = [
        { id: 1, name: "CADETE", xp: 0 },
        { id: 2, name: "RECLUTA", xp: 150 },
        { id: 3, name: "PILOTO", xp: 400 },
        { id: 4, name: "OFICIAL", xp: 900 },
        { id: 5, name: "TENIENTE", xp: 1600 },
        { id: 6, name: "CAPITÁN", xp: 2800 },
        { id: 7, name: "COMANDANTE", xp: 4500 },
        { id: 8, name: "ÉLITE", xp: 7000 },
        { id: 9, name: "VETERANO", xp: 11000 },
        { id: 10, name: "LEYENDA", xp: 18000 }
    ];

    function loadXP() {
        try {
            var n = Number(localStorage.getItem(XP_KEY) || 0);
            return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
        } catch (e) {
            return 0;
        }
    }

    function saveXP(xp) {
        xp = Math.max(0, Math.floor(xp));
        try {
            localStorage.setItem(XP_KEY, String(xp));
        } catch (e) {}
        return xp;
    }

    function rankFromXP(xp) {
        var r = RANKS[0];
        for (var i = 0; i < RANKS.length; i++) {
            if (xp >= RANKS[i].xp) r = RANKS[i];
        }
        return r;
    }

    function nextRank(xp) {
        var cur = rankFromXP(xp);
        for (var i = 0; i < RANKS.length; i++) {
            if (RANKS[i].id === cur.id + 1) return RANKS[i];
        }
        return null;
    }

    function addXP(amount, reason) {
        amount = Math.max(0, Math.floor(Number(amount) || 0));
        if (!amount) return { xp: loadXP(), gained: 0, rankUp: false };
        var before = loadXP();
        var after = saveXP(before + amount);
        var rb = rankFromXP(before);
        var ra = rankFromXP(after);
        var rankUp = ra.id > rb.id;
        try {
            localStorage.setItem(
                RANK_KEY,
                JSON.stringify({ rank: ra, xp: after, at: Date.now() })
            );
        } catch (e) {}
        return {
            xp: after,
            gained: amount,
            rankUp: rankUp,
            rank: ra,
            prevRank: rb,
            reason: reason || ""
        };
    }

    /** XP rewards helpers */
    function xpForKill(enemy) {
        if (!enemy) return 2;
        if (enemy.isBoss || enemy.type === "boss") return 80;
        if (enemy.type === "elite") return 12;
        if (enemy.type === "tank") return 8;
        if (enemy.type === "shooter") return 5;
        return 3;
    }

    function xpForWave(wave) {
        return 15 + Math.floor((wave || 1) * 2);
    }

    function xpForAdventureLevel(level, stars) {
        return 40 + (level || 1) * 5 + (stars || 0) * 15;
    }

    function getSnapshot() {
        var xp = loadXP();
        var rank = rankFromXP(xp);
        var next = nextRank(xp);
        var progress = 1;
        if (next) {
            var span = next.xp - rank.xp;
            progress = span > 0 ? (xp - rank.xp) / span : 1;
        }
        return {
            xp: xp,
            rank: rank,
            next: next,
            progress: Math.max(0, Math.min(1, progress))
        };
    }

    global.SpaceStrikeProgression = {
        RANKS: RANKS,
        loadXP: loadXP,
        addXP: addXP,
        rankFromXP: rankFromXP,
        getSnapshot: getSnapshot,
        xpForKill: xpForKill,
        xpForWave: xpForWave,
        xpForAdventureLevel: xpForAdventureLevel
    };
})(typeof window !== "undefined" ? window : this);
