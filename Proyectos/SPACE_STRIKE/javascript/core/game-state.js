/* ================================================================
   SPACE STRIKE v3.0 — GameState
   Single source of truth for high-level flow states.
   Compatible with legacy flags (game.running, game.paused, etc.)
================================================================ */

(function (global) {
    "use strict";

    var STATES = {
        MENU: "MENU",
        PLAYING: "PLAYING",
        PAUSED: "PAUSED",
        GAME_OVER: "GAME_OVER",
        LEVEL_COMPLETE: "LEVEL_COMPLETE",
        SHOP: "SHOP",
        BOSS: "BOSS",
        VICTORY: "VICTORY",
        LOADING: "LOADING"
    };

    var current = STATES.MENU;
    var previous = null;
    var listeners = [];

    function get() {
        return current;
    }

    function getPrevious() {
        return previous;
    }

    function set(next) {
        if (!STATES[next] && Object.keys(STATES).indexOf(next) < 0) {
            /* allow string values from STATES map */
            var valid = false;
            for (var k in STATES) {
                if (STATES[k] === next) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                console.warn("[GameState] unknown state", next);
                return current;
            }
        }
        if (current === next) return current;
        previous = current;
        current = next;
        for (var i = 0; i < listeners.length; i++) {
            try {
                listeners[i](current, previous);
            } catch (e) {
                console.warn("[GameState] listener error", e);
            }
        }
        return current;
    }

    function is() {
        for (var i = 0; i < arguments.length; i++) {
            if (current === arguments[i]) return true;
        }
        return false;
    }

    function onChange(fn) {
        if (typeof fn === "function") listeners.push(fn);
        return function off() {
            listeners = listeners.filter(function (f) {
                return f !== fn;
            });
        };
    }

    /**
     * Sync from legacy game object used by game.js
     * Does not own gameplay — only mirrors flags.
     */
    function syncFromLegacy(game) {
        if (!game) return current;
        if (game.gameOver) return set(STATES.GAME_OVER);
        if (game.levelTransition) return set(STATES.LEVEL_COMPLETE);
        if (game.paused) return set(STATES.PAUSED);
        if (game.bossActive) return set(STATES.BOSS);
        if (game.running) return set(STATES.PLAYING);
        return current;
    }

    global.SpaceStrikeGameState = {
        STATES: STATES,
        get: get,
        getPrevious: getPrevious,
        set: set,
        is: is,
        onChange: onChange,
        syncFromLegacy: syncFromLegacy
    };
})(typeof window !== "undefined" ? window : this);
