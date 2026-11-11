/* SPACE STRIKE 2.0.0 — Achievements */

const ACHIEVEMENTS_KEY = "spaceStrikeAchievements";

const ACHIEVEMENT_DEFS = [
    { id: "first_blood", name: "FIRST BLOOD", desc: "Destruye tu primer enemigo" },
    { id: "ace_pilot", name: "ACE PILOT", desc: "Consigue combo x10" },
    { id: "survivor", name: "SURVIVOR", desc: "Completa un sector sin daño" },
    { id: "boss_hunter", name: "BOSS HUNTER", desc: "Derrota 5 jefes" },
    { id: "wave_20", name: "DEEP SPACE", desc: "Alcanza oleada 20 en infinito" },
    { id: "combo_20", name: "UNSTOPPABLE", desc: "Consigue combo x20" },
    { id: "shopper", name: "ENGINEER", desc: "Compra cualquier mejora" },
    { id: "recruit", name: "RECLUTA", desc: "Registra tu piloto" }
];

function loadAchievements() {
    try {
        const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
        const data = raw ? JSON.parse(raw) : {};
        return data && typeof data === "object" ? data : {};
    } catch (e) {
        return {};
    }
}

function saveAchievements(data) {
    try {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(data));
    } catch (e) {}
}

function unlockAchievement(id) {
    const data = loadAchievements();
    if (data[id]) return false;
    data[id] = Date.now();
    saveAchievements(data);
    return true;
}

function hasAchievement(id) {
    return !!loadAchievements()[id];
}

function listAchievements() {
    const data = loadAchievements();
    return ACHIEVEMENT_DEFS.map(function (a) {
        return {
            id: a.id,
            name: a.name,
            desc: a.desc,
            unlocked: !!data[a.id],
            at: data[a.id] || null
        };
    });
}

if (typeof window !== "undefined") {
    window.SpaceStrikeAchievements = {
        defs: ACHIEVEMENT_DEFS,
        unlock: unlockAchievement,
        has: hasAchievement,
        list: listAchievements,
        load: loadAchievements
    };
}
