/* ================================================================
   SPACE STRIKE v3.0 — ComboSystem (UI + animations)
   Extracted from game.js. Handles display, tiers, appear/evolve/fade.
================================================================ */

(function (global) {
    "use strict";

    var lastShown = 0;
    var lastTier = 0;
    var hideTimer = null;

    function tierOf(combo) {
        if (combo >= 20) return 3;
        if (combo >= 10) return 2;
        if (combo >= 5) return 1;
        return 0;
    }

    function multLabel(combo) {
        if (combo >= 20) return "x5";
        if (combo >= 10) return "x3";
        if (combo >= 5) return "x2";
        return "";
    }

    function el() {
        return document.getElementById("comboDisplay");
    }

    function clearAnimClasses(node) {
        if (!node) return;
        node.classList.remove(
            "combo-appear",
            "combo-evolve",
            "combo-tick",
            "combo-fadeout",
            "tier-1",
            "tier-2",
            "tier-3"
        );
    }

    function show(combo) {
        var node = el();
        if (!node) return;

        var tier = tierOf(combo);
        if (tier < 1) {
            hide(true);
            return;
        }

        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        var wasHidden = node.classList.contains("hidden") || lastShown < 5;
        var evolved = tier > lastTier && lastTier >= 1;

        clearAnimClasses(node);
        node.classList.remove("hidden");
        node.classList.add("tier-" + tier);
        node.textContent = "COMBO " + combo + "  " + multLabel(combo);

        /* Force reflow so animation restarts */
        void node.offsetWidth;

        if (wasHidden) {
            node.classList.add("combo-appear");
        } else if (evolved) {
            node.classList.add("combo-evolve");
            if (global.SpaceStrikeAudio && global.SpaceStrikeAudio.play) {
                try {
                    global.SpaceStrikeAudio.play("reward");
                } catch (e) {}
            }
        } else {
            node.classList.add("combo-tick");
        }

        lastShown = combo;
        lastTier = tier;
    }

    function hide(instant) {
        var node = el();
        if (!node) return;

        if (hideTimer) {
            clearTimeout(hideTimer);
            hideTimer = null;
        }

        if (instant || node.classList.contains("hidden")) {
            clearAnimClasses(node);
            node.classList.add("hidden");
            lastShown = 0;
            lastTier = 0;
            return;
        }

        clearAnimClasses(node);
        node.classList.add("combo-fadeout");
        hideTimer = setTimeout(function () {
            node.classList.add("hidden");
            clearAnimClasses(node);
            lastShown = 0;
            lastTier = 0;
            hideTimer = null;
        }, 380);
    }

    /**
     * Sync from game state — call whenever combo changes.
     */
    function update(combo) {
        combo = Math.max(0, Math.floor(Number(combo) || 0));
        if (combo >= 5) {
            show(combo);
        } else {
            hide(false);
        }
    }

    function reset() {
        hide(true);
    }

    global.SpaceStrikeCombo = {
        update: update,
        show: show,
        hide: hide,
        reset: reset,
        tierOf: tierOf,
        multLabel: multLabel
    };
})(typeof window !== "undefined" ? window : this);
