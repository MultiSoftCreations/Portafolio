/* SPACE STRIKE 2.0.0 — Rank / XP */

const RANK_KEY = "spaceStrikeRank";

const RANKS = [
    { id: "recluta", name: "RECLUTA", xp: 0 },
    { id: "piloto", name: "PILOTO", xp: 500 },
    { id: "veterano", name: "VETERANO", xp: 2000 },
    { id: "ace", name: "ACE", xp: 5000 },
    { id: "comandante", name: "COMANDANTE", xp: 12000 }
];

function loadRankData() {
    try {
        const raw = localStorage.getItem(RANK_KEY);
        if (!raw) return { xp: 0 };
        const d = JSON.parse(raw);
        return { xp: Math.max(0, Number(d.xp) || 0) };
    } catch (e) {
        return { xp: 0 };
    }
}

function saveRankData(d) {
    try {
        localStorage.setItem(RANK_KEY, JSON.stringify(d));
    } catch (e) {}
}

function addXp(amount) {
    const d = loadRankData();
    d.xp += Math.max(0, Math.floor(amount));
    saveRankData(d);
    return d;
}

function getRank(xp) {
    let current = RANKS[0];
    for (let i = 0; i < RANKS.length; i++) {
        if (xp >= RANKS[i].xp) current = RANKS[i];
    }
    return current;
}

function getRankInfo() {
    const d = loadRankData();
    const rank = getRank(d.xp);
    let next = null;
    for (let i = 0; i < RANKS.length; i++) {
        if (RANKS[i].xp > d.xp) {
            next = RANKS[i];
            break;
        }
    }
    return {
        xp: d.xp,
        rank: rank,
        next: next,
        progress: next ? (d.xp - rank.xp) / Math.max(1, next.xp - rank.xp) : 1
    };
}

if (typeof window !== "undefined") {
    window.SpaceStrikeRank = {
        RANKS: RANKS,
        addXp: addXp,
        info: getRankInfo,
        load: loadRankData
    };
}
