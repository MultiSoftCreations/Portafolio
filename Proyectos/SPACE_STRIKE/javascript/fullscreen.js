/* SPACE STRIKE — Global fullscreen preference */
(function () {
    var KEY = "spaceStrikeFullscreen";

    function loadPref() {
        try {
            var v = localStorage.getItem(KEY);
            if (v === null || v === undefined) return true; /* default ON */
            return v === "1" || v === "true";
        } catch (e) {
            return true;
        }
    }

    function savePref(on) {
        try {
            localStorage.setItem(KEY, on ? "1" : "0");
        } catch (e) {}
    }

    function isFs() {
        return !!(document.fullscreenElement || document.webkitFullscreenElement);
    }

    function enterFs() {
        var el = document.documentElement;
        var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if (req) {
            try {
                var p = req.call(el);
                if (p && p.catch) p.catch(function () {});
            } catch (e) {}
        }
    }

    function exitFs() {
        var ex = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if (ex) {
            try {
                var p = ex.call(document);
                if (p && p.catch) p.catch(function () {});
            } catch (e) {}
        }
    }

    function applyPref() {
        if (loadPref()) {
            if (!isFs()) enterFs();
        } else {
            if (isFs()) exitFs();
        }
        updateButtons();
    }

    function toggle() {
        var next = !loadPref();
        savePref(next);
        if (next) enterFs();
        else exitFs();
        updateButtons();
    }

    function updateButtons() {
        var on = loadPref();
        document.querySelectorAll("[data-fs-toggle]").forEach(function (btn) {
            btn.textContent = on ? "⛶ SALIR PC" : "⛶ PANTALLA COMPLETA";
            btn.setAttribute("aria-pressed", on ? "true" : "false");
            btn.classList.toggle("fs-on", on);
            btn.classList.toggle("fs-off", !on);
        });
    }

    function ensureButton() {
        if (document.querySelector("[data-fs-toggle]")) return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-fs-toggle", "1");
        btn.className = "fs-toggle-btn";
        btn.title = "Pantalla completa";
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggle();
        });
        document.body.appendChild(btn);
        updateButtons();
    }

    function init() {
        ensureButton();
        updateButtons();
        /* Default on: try enter; browsers may require gesture — retry on first tap */
        if (loadPref() && !isFs()) {
            enterFs();
            var once = function () {
                if (loadPref() && !isFs()) enterFs();
                document.removeEventListener("pointerdown", once, true);
            };
            document.addEventListener("pointerdown", once, true);
        }
        document.addEventListener("fullscreenchange", updateButtons);
        document.addEventListener("webkitfullscreenchange", updateButtons);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.SpaceStrikeFullscreen = {
        load: loadPref,
        save: savePref,
        toggle: toggle,
        apply: applyPref,
        isFullscreen: isFs
    };
})();
