/* SPACE STRIKE — Graphics quality (auto / low / medium / high) */
(function () {
    var KEY = "spaceStrikeGraphics";

    function detectTier() {
        var cores = (navigator.hardwareConcurrency || 4);
        var mem = navigator.deviceMemory || 4; /* GB, Chrome */
        var mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || "");
        var w = Math.min(screen.width || 400, screen.height || 400);
        if (mobile && (cores <= 4 || mem <= 2 || w < 400)) return "low";
        if (mobile && (cores <= 6 || mem <= 4)) return "medium";
        if (!mobile && cores >= 8 && mem >= 8) return "high";
        if (!mobile) return "medium";
        return "medium";
    }

    function loadPref() {
        try {
            var v = localStorage.getItem(KEY);
            if (v === "auto" || v === "low" || v === "medium" || v === "high") return v;
        } catch (e) {}
        return "auto";
    }

    function savePref(v) {
        try { localStorage.setItem(KEY, v); } catch (e) {}
    }

    function resolve() {
        var pref = loadPref();
        if (pref === "auto") return detectTier();
        return pref;
    }

    function applyToPerf(PERF) {
        if (!PERF) return resolve();
        var tier = resolve();
        PERF.graphicsTier = tier;
        if (tier === "low") {
            PERF.starCount = 28;
            PERF.maxParticles = 28;
            PERF.maxEnemies = 8;
            PERF.explosionScale = 0.3;
            PERF.shadows = false;
            PERF.shipDetail = 1;
        } else if (tier === "medium") {
            PERF.starCount = 55;
            PERF.maxParticles = 55;
            PERF.maxEnemies = 12;
            PERF.explosionScale = 0.5;
            PERF.shadows = true;
            PERF.shipDetail = 2;
        } else {
            PERF.starCount = 110;
            PERF.maxParticles = 130;
            PERF.maxEnemies = 20;
            PERF.explosionScale = 1;
            PERF.shadows = true;
            PERF.shipDetail = 3;
        }
        return tier;
    }

    window.SpaceStrikeGraphics = {
        load: loadPref,
        save: savePref,
        resolve: resolve,
        detect: detectTier,
        applyToPerf: applyToPerf
    };
})();
