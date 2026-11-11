/* SPACE STRIKE v3.0 — Enemy type definitions (single source) */
(function (global) {
    "use strict";

    var enemyTypes = {
        basic: { width: 38, height: 32, health: 1, speed: 90, points: 100, shoot: false },
        fast: { width: 30, height: 27, health: 1, speed: 180, points: 150, shoot: false },
        shooter: { width: 44, height: 38, health: 2, speed: 75, points: 200, shoot: true },
        elite: { width: 54, height: 45, health: 4, speed: 60, points: 500, shoot: true },
        tank: { width: 52, height: 42, health: 6, speed: 48, points: 350, shoot: false },
        boss: { width: 128, height: 110, health: 100, speed: 28, points: 5000, shoot: true }
    };

    function selectForInfinite(level) {
        var roll = Math.random();
        if (level >= 8 && roll < 0.07) return "elite";
        if (level >= 6 && roll < 0.18) return "tank";
        if (level >= 3 && roll < 0.32) return "shooter";
        if (level >= 2 && roll < 0.55) return "fast";
        return "basic";
    }

    global.SpaceStrikeEnemyData = {
        types: enemyTypes,
        selectForInfinite: selectForInfinite
    };
})(typeof window !== "undefined" ? window : this);
