/* SPACE STRIKE v3.0 — Boss banner / phase UI */
(function (global) {
    "use strict";

    var hideT = null;

    function ensureBanner() {
        var el = document.getElementById("bossBanner");
        if (el) return el;
        el = document.createElement("div");
        el.id = "bossBanner";
        el.className = "boss-banner hidden";
        el.innerHTML =
            '<div class="boss-banner-title">⚠ JEFE</div>' +
            '<div class="boss-banner-name" id="bossBannerName">OVERLORD</div>' +
            '<div class="boss-banner-sub" id="bossBannerSub"></div>';
        document.body.appendChild(el);
        return el;
    }

    function announce(name, sub, ms) {
        var el = ensureBanner();
        var n = document.getElementById("bossBannerName");
        var s = document.getElementById("bossBannerSub");
        if (n) n.textContent = name || "OVERLORD";
        if (s) s.textContent = sub || "";
        el.classList.remove("hidden", "boss-out");
        void el.offsetWidth;
        el.classList.add("boss-in");
        if (hideT) clearTimeout(hideT);
        hideT = setTimeout(function () {
            el.classList.remove("boss-in");
            el.classList.add("boss-out");
            setTimeout(function () {
                el.classList.add("hidden");
            }, 400);
        }, ms || 2800);
    }

    function phase(phaseNum) {
        announce("FASE " + phaseNum, "EL JEFE SE ENFURECE", 2200);
    }

    global.SpaceStrikeBossUI = {
        announce: announce,
        phase: phase
    };
})(typeof window !== "undefined" ? window : this);
