/* SPACE STRIKE v3.2.0 — AdManager (all screens except gameplay) */
(function (global) {
    "use strict";

    var AD_SCRIPT_URL =
        "https://pl31580105.profitableratecpmnetwork.com/97/94/ec/9794ec0f69db8adcc0e48b6322ea66a8.js";
    var loaded = false;
    var SETTINGS_KEY = "spaceStrikeSettings";

    function readSettings() {
        try {
            var raw = localStorage.getItem(SETTINGS_KEY);
            return raw ? JSON.parse(raw) || {} : {};
        } catch (e) {
            return {};
        }
    }

    function isPremium() {
        try {
            if (global.SpaceStrikePremium && global.SpaceStrikePremium.isPremium) {
                return !!global.SpaceStrikePremium.isPremium();
            }
            var raw = localStorage.getItem("spaceStrikePremium");
            if (!raw) return false;
            if (raw === "1") return true;
            var p = JSON.parse(raw);
            return !!(p && (p.active || p === true));
        } catch (e) {
            return false;
        }
    }

    function isGameScreen() {
        try {
            var path = (location.pathname || "").toLowerCase();
            return path.indexOf("game.html") >= 0;
        } catch (e) {
            return false;
        }
    }

    function adsEnabled() {
        if (isGameScreen()) return false;
        if (isPremium()) return false;
        var s = readSettings();
        if (s.ads === false) return false;
        return true;
    }

    function loadNetworkScript() {
        if (loaded || !adsEnabled() || !AD_SCRIPT_URL) return false;
        try {
            var s = document.createElement("script");
            s.src = AD_SCRIPT_URL;
            s.async = true;
            s.setAttribute("data-ss-ads", "1");
            document.head.appendChild(s);
            loaded = true;
            return true;
        } catch (e) {
            return false;
        }
    }

    function setAdsEnabled(on) {
        var s = readSettings();
        s.ads = !!on;
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
        } catch (e) {}
        return s.ads;
    }

    function init() {
        if (isGameScreen()) return;
        setTimeout(loadNetworkScript, 900);
    }

    global.SpaceStrikeAds = {
        init: init,
        load: loadNetworkScript,
        adsEnabled: adsEnabled,
        setAdsEnabled: setAdsEnabled,
        isPremium: isPremium
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})(typeof window !== "undefined" ? window : this);
