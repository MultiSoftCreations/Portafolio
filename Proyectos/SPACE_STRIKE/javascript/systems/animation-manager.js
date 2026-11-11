/* ================================================================
   SPACE STRIKE v3.0 — AnimationManager
   Lightweight UI / feedback animations (remaster).
================================================================ */

(function (global) {
    "use strict";

    function prefersReducedMotion() {
        try {
            return global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch (e) {
            return false;
        }
    }

    function fadeIn(el, ms) {
        if (!el) return;
        ms = ms || 400;
        if (prefersReducedMotion()) {
            el.style.opacity = "1";
            return;
        }
        el.style.opacity = "0";
        el.style.transform = "scale(0.96) translateY(8px)";
        el.style.transition = "opacity " + ms + "ms cubic-bezier(0.22,1,0.36,1), transform " + ms + "ms cubic-bezier(0.22,1,0.36,1)";
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.style.opacity = "1";
                el.style.transform = "scale(1) translateY(0)";
            });
        });
    }

    function pulse(el, ms) {
        if (!el || prefersReducedMotion()) return;
        ms = ms || 220;
        el.style.transition = "transform " + ms + "ms ease";
        el.style.transform = "scale(1.04)";
        setTimeout(function () {
            el.style.transform = "scale(1)";
        }, ms);
    }

    function press(el) {
        if (!el || prefersReducedMotion()) return;
        el.style.transition = "transform 0.12s ease";
        el.style.transform = "scale(0.97)";
        setTimeout(function () {
            el.style.transform = "";
        }, 120);
    }

    function bindPressable(selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            (function (el) {
                el.addEventListener("pointerdown", function () {
                    press(el);
                });
            })(nodes[i]);
        }
    }

    function flashScreen(color, ms) {
        if (prefersReducedMotion()) return;
        ms = ms || 180;
        var div = document.createElement("div");
        div.style.cssText =
            "position:fixed;inset:0;z-index:99999;pointer-events:none;background:" +
            (color || "rgba(255,77,109,0.25)") +
            ";opacity:1;transition:opacity " +
            ms +
            "ms ease;";
        document.body.appendChild(div);
        requestAnimationFrame(function () {
            div.style.opacity = "0";
        });
        setTimeout(function () {
            if (div.parentNode) div.parentNode.removeChild(div);
        }, ms + 40);
    }

    function initMenu() {
        fadeIn(document.querySelector(".menu"), 480);
        bindPressable(".menu-button, .ss-btn-press");
    }

    global.SpaceStrikeAnim = {
        fadeIn: fadeIn,
        pulse: pulse,
        press: press,
        bindPressable: bindPressable,
        flashScreen: flashScreen,
        initMenu: initMenu,
        prefersReducedMotion: prefersReducedMotion
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            if (document.querySelector(".menu")) initMenu();
        });
    } else if (document.querySelector(".menu")) {
        initMenu();
    }
})(typeof window !== "undefined" ? window : this);
