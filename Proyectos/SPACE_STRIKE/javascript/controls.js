/* ================================================================
   SPACE STRIKE — TOUCH CONTROLS LAYOUT
   Version: 1.3.3
================================================================ */

const CONTROLS_KEY = "spaceStrikeControls";

const DEFAULT_CONTROLS = {
    joystickSize: 125,
    joystickLeft: 30,
    joystickBottom: 35,
    fireSize: 105,
    fireRight: 35,
    fireBottom: 42,
    opacity: 0.95
};

function loadControls() {
    try {
        const raw = localStorage.getItem(CONTROLS_KEY);
        if (!raw) return Object.assign({}, DEFAULT_CONTROLS);
        const p = JSON.parse(raw);
        return {
            joystickSize: clampNum(p.joystickSize, 80, 180, 125),
            joystickLeft: clampNum(p.joystickLeft, 4, 40, 30),
            joystickBottom: clampNum(p.joystickBottom, 8, 50, 35),
            fireSize: clampNum(p.fireSize, 70, 160, 105),
            fireRight: clampNum(p.fireRight, 4, 40, 35),
            fireBottom: clampNum(p.fireBottom, 8, 50, 42),
            opacity: clampNum(p.opacity, 0.4, 1, 0.95)
        };
    } catch (e) {
        return Object.assign({}, DEFAULT_CONTROLS);
    }
}

function saveControls(cfg) {
    try {
        localStorage.setItem(CONTROLS_KEY, JSON.stringify(cfg));
    } catch (e) {}
}

function clampNum(v, min, max, fallback) {
    const n = Number(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function applyControlsLayout(joystickEl, stickEl, fireEl) {
    const c = loadControls();
    if (joystickEl) {
        joystickEl.style.width = c.joystickSize + "px";
        joystickEl.style.height = c.joystickSize + "px";
        joystickEl.style.left = c.joystickLeft + "px";
        joystickEl.style.bottom = c.joystickBottom + "px";
        joystickEl.style.opacity = String(c.opacity);
    }
    if (stickEl) {
        const stick = Math.max(32, Math.floor(c.joystickSize * 0.42));
        stickEl.style.width = stick + "px";
        stickEl.style.height = stick + "px";
    }
    if (fireEl) {
        fireEl.style.width = c.fireSize + "px";
        fireEl.style.height = c.fireSize + "px";
        fireEl.style.right = c.fireRight + "px";
        fireEl.style.bottom = c.fireBottom + "px";
        fireEl.style.opacity = String(c.opacity);
        fireEl.style.fontSize = Math.max(10, Math.floor(c.fireSize * 0.12)) + "px";
    }
    return c;
}

if (typeof window !== "undefined") {
    window.SpaceStrikeControls = {
        defaults: DEFAULT_CONTROLS,
        load: loadControls,
        save: saveControls,
        apply: applyControlsLayout
    };
}
