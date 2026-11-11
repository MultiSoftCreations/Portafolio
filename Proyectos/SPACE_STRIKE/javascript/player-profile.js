/* SPACE STRIKE — Player profile & local leaderboard v1.3.0 */

const PROFILE_KEY = "spaceStrikeProfile";
const LEADERBOARD_KEY = "spaceStrikeLeaderboard";
const USED_NAMES_KEY = "spaceStrikeUsedNames";

const NAME_MIN = 7;
const NAME_MAX = 12;
const NAME_RE = /^[A-Za-z0-9_\-áéíóúÁÉÍÓÚñÑ]+$/;

function normalizeName(name) {
    return String(name || "").trim();
}

function validatePlayerName(name) {
    const n = normalizeName(name);
    if (n.length < NAME_MIN) {
        return { ok: false, error: "Mínimo " + NAME_MIN + " caracteres." };
    }
    if (n.length > NAME_MAX) {
        return { ok: false, error: "Máximo " + NAME_MAX + " caracteres." };
    }
    if (!NAME_RE.test(n)) {
        return { ok: false, error: "Solo letras, números, _ y -." };
    }
    return { ok: true, name: n };
}

function getUsedNames() {
    try {
        const raw = localStorage.getItem(USED_NAMES_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.map(function (s) { return String(s).toLowerCase(); }) : [];
    } catch (e) {
        return [];
    }
}

function registerUsedName(name) {
    const list = getUsedNames();
    const key = name.toLowerCase();
    if (list.indexOf(key) === -1) {
        list.push(key);
        try {
            localStorage.setItem(USED_NAMES_KEY, JSON.stringify(list));
        } catch (e) {}
    }
}

function isNameTaken(name, currentName) {
    const key = name.toLowerCase();
    if (currentName && key === String(currentName).toLowerCase()) {
        return false;
    }
    return getUsedNames().indexOf(key) !== -1;
}

function loadProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (!raw) return null;
        const p = JSON.parse(raw);
        if (!p || !p.name) return null;
        return p;
    } catch (e) {
        return null;
    }
}

function saveProfile(profile) {
    try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {}
}

function registerPlayer(name) {
    const v = validatePlayerName(name);
    if (!v.ok) return v;
    if (isNameTaken(v.name, null)) {
        return { ok: false, error: "Ese nombre ya está en uso en este dispositivo." };
    }
    const profile = {
        name: v.name,
        createdAt: Date.now(),
        bestInfinite: 0,
        bestWave: 0
    };
    saveProfile(profile);
    registerUsedName(v.name);
    if (window.SpaceStrikeAchievements) window.SpaceStrikeAchievements.unlock("recruit");
    return { ok: true, profile: profile };
}

function getPlayerName() {
    const p = loadProfile();
    return p ? p.name : null;
}

function loadLeaderboard() {
    try {
        const raw = localStorage.getItem(LEADERBOARD_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}

function saveLeaderboard(list) {
    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list.slice(0, 20)));
    } catch (e) {}
}

/** Ranking local SOLO si no hay internet (buffer offline). Con red no se escribe. */
function isOnline() {
    try { return navigator.onLine !== false; } catch (e) { return true; }
}

function clearLocalRankingTraces() {
    try {
        localStorage.removeItem(LEADERBOARD_KEY);
        localStorage.removeItem("spaceStrikeOfflineBoard");
        localStorage.removeItem("spaceStrikeOfflineHighScore");
        /* highScore en local solo espejo de nube: se limpia ranking list, no el número de HUD si viene de cloud */
    } catch (e) {}
}

/** Submit infinite mode score for ranking */
function submitScore(score, wave) {
    const profile = loadProfile();
    if (!profile) return { ok: false, error: "Sin perfil" };

    score = Math.max(0, Math.floor(score));
    wave = Math.max(0, Math.floor(wave || 0));

    if (score > (profile.bestInfinite || 0)) {
        profile.bestInfinite = score;
        profile.bestWave = Math.max(profile.bestWave || 0, wave);
        saveProfile(profile);
    }

    /* Online: no ranking local permanente */
    if (isOnline()) {
        clearLocalRankingTraces();
        return { ok: true, board: [], offline: false };
    }

    /* Offline: buffer temporal para subir al recuperar red */
    try {
        localStorage.setItem("spaceStrikeOfflineHighScore", String(Math.max(
            score,
            Number(localStorage.getItem("spaceStrikeOfflineHighScore") || 0)
        )));
    } catch (e0) {}

    const list = loadLeaderboard();
    list.push({
        name: profile.name,
        score: score,
        wave: wave,
        at: Date.now()
    });

    list.sort(function (a, b) {
        return b.score - a.score || b.wave - a.wave;
    });

    const seen = {};
    const unique = [];
    for (let i = 0; i < list.length; i++) {
        const key = String(list[i].name).toLowerCase();
        if (seen[key]) continue;
        seen[key] = true;
        unique.push(list[i]);
    }

    saveLeaderboard(unique);
    try {
        localStorage.setItem("spaceStrikeOfflineBoard", JSON.stringify(unique.slice(0, 20)));
    } catch (e1) {}
    return { ok: true, board: unique, offline: true };
}

if (typeof window !== "undefined") {
    window.SpaceStrikePlayer = {
        NAME_MIN: NAME_MIN,
        NAME_MAX: NAME_MAX,
        validate: validatePlayerName,
        loadProfile: loadProfile,
        register: registerPlayer,
        getName: getPlayerName,
        loadLeaderboard: loadLeaderboard,
        getLeaderboard: loadLeaderboard,
        submitScore: submitScore,
        clearLocalRankingTraces: clearLocalRankingTraces,
        isOnline: isOnline
    };
}
