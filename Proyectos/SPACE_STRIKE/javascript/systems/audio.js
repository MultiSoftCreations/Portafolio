/* ================================================================
   SPACE STRIKE v3.0 — AudioManager
   Web Audio tones (no external files). Extracted from game.js.
================================================================ */

(function (global) {
    "use strict";

    var audioCtx = null;
    var musicNodes = null;

    function settings() {
        if (global.gameSettings) return global.gameSettings;
        try {
            var raw = localStorage.getItem("spaceStrikeSettings");
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return { sound: true, music: true, vibration: true };
    }

    function ensureContext() {
        if (audioCtx) return audioCtx;
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return null;
        try {
            audioCtx = new AC();
        } catch (e) {
            return null;
        }
        return audioCtx;
    }

    function resume() {
        var ctx = ensureContext();
        if (ctx && ctx.state === "suspended") {
            ctx.resume().catch(function () {});
        }
    }

    function playTone(freq, duration, type, volume) {
        var s = settings();
        if (s.sound === false) return;
        var ctx = ensureContext();
        if (!ctx) return;
        resume();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = type || "square";
        osc.frequency.value = freq;
        var now = ctx.currentTime;
        var vol = volume == null ? 0.08 : volume;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.02);
    }

    function play(name) {
        var s = settings();
        if (s.sound === false) return;

        if (name === "shoot") {
            playTone(880, 0.06, "square", 0.05);
            return;
        }
        if (name === "hit") {
            playTone(220, 0.08, "sawtooth", 0.06);
            return;
        }
        if (name === "explosion") {
            playTone(90, 0.25, "sawtooth", 0.1);
            playTone(55, 0.3, "triangle", 0.08);
            return;
        }
        if (name === "damage") {
            playTone(120, 0.2, "square", 0.1);
            playTone(80, 0.25, "sawtooth", 0.08);
            return;
        }
        if (name === "level") {
            playTone(523, 0.12, "triangle", 0.08);
            setTimeout(function () {
                playTone(659, 0.12, "triangle", 0.08);
            }, 100);
            setTimeout(function () {
                playTone(784, 0.18, "triangle", 0.09);
            }, 200);
            return;
        }
        if (name === "gameover") {
            playTone(200, 0.3, "sawtooth", 0.1);
            setTimeout(function () {
                playTone(120, 0.4, "triangle", 0.1);
            }, 200);
        }
        if (name === "ui") {
            playTone(660, 0.05, "sine", 0.04);
        }
        if (name === "reward") {
            playTone(523, 0.1, "triangle", 0.07);
            setTimeout(function () {
                playTone(784, 0.15, "triangle", 0.08);
            }, 90);
        }
    }

    function startMusic() {
        var s = settings();
        if (s.music === false) {
            stopMusic();
            return;
        }
        var ctx = ensureContext();
        if (!ctx) return;
        resume();
        if (musicNodes) return;

        try {
            var osc1 = ctx.createOscillator();
            var osc2 = ctx.createOscillator();
            var gain = ctx.createGain();
            osc1.type = "sine";
            osc2.type = "triangle";
            osc1.frequency.value = 55;
            osc2.frequency.value = 82.5;
            gain.gain.value = 0.02;
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc1.start();
            osc2.start();
            musicNodes = { osc1: osc1, osc2: osc2, gain: gain };
        } catch (e) {
            musicNodes = null;
        }
    }

    function stopMusic() {
        if (!musicNodes) return;
        try {
            musicNodes.osc1.stop();
            musicNodes.osc2.stop();
        } catch (e) {}
        musicNodes = null;
    }

    function setMuted(muted) {
        var s = settings();
        s.sound = !muted;
        if (global.gameSettings) global.gameSettings.sound = !muted;
    }

    global.SpaceStrikeAudio = {
        play: play,
        playTone: playTone,
        startMusic: startMusic,
        stopMusic: stopMusic,
        resume: resume,
        setMuted: setMuted,
        ensureContext: ensureContext
    };
})(typeof window !== "undefined" ? window : this);
