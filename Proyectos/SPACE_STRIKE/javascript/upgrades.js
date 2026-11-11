/* ================================================================
   SPACE STRIKE
   UPGRADES & COINS
   Version: 2.0.0
================================================================ */

const COINS_KEY = "spaceStrikeCoins";
const UPGRADES_KEY = "spaceStrikeUpgrades";

const UPGRADE_CATALOG = {
    fireRate: {
        id: "fireRate",
        name: "CADENCIA",
        desc: "Dispara más rápido",
        maxLevel: 5,
        baseCost: 80,
        costScale: 1.45
    },
    resistance: {
        id: "resistance",
        name: "RESISTENCIA",
        desc: "+1 hull por nivel (más impactos)",
        maxLevel: 3,
        baseCost: 120,
        costScale: 1.6
    },
    shield: {
        id: "shield",
        name: "ESCUDO",
        desc: "Absorbe 1 impacto por carga",
        maxLevel: 3,
        baseCost: 100,
        costScale: 1.5
    },
    doubleCannon: {
        id: "doubleCannon",
        name: "CAÑONES DOBLES",
        desc: "Dos líneas de disparo",
        maxLevel: 1,
        baseCost: 250,
        costScale: 1
    },
    helper: {
        id: "helper",
        name: "AYUDANTE",
        desc: "Drone que dispara solo",
        maxLevel: 1,
        baseCost: 300,
        costScale: 1
    },
    moveSpeed: {
        id: "moveSpeed",
        name: "PROPULSIÓN",
        desc: "Nave más ágil",
        maxLevel: 4,
        baseCost: 70,
        costScale: 1.4
    },
    pierce: {
        id: "pierce",
        name: "PERFORACIÓN",
        desc: "Las balas atraviesan enemigos",
        maxLevel: 1,
        baseCost: 280,
        costScale: 1
    },
    multiShot: {
        id: "multiShot",
        name: "RAFAGA",
        desc: "Dispara 3 balas en abanico",
        maxLevel: 1,
        baseCost: 320,
        costScale: 1
    },
    damage: {
        id: "damage",
        name: "POTENCIA",
        desc: "+1 daño por disparo",
        maxLevel: 3,
        baseCost: 150,
        costScale: 1.55
    },
    magnet: {
        id: "magnet",
        name: "BONUS CRÉDITOS",
        desc: "+8% monedas ganadas por nivel",
        maxLevel: 3,
        baseCost: 90,
        costScale: 1.4
    },
    abilityEmp: {
        id: "abilityEmp",
        name: "HABILIDAD EMP",
        desc: "Congela a todos los enemigos ~1.2s. Actívala con el botón EMP o tecla 1.",
        maxLevel: 1,
        baseCost: 400,
        costScale: 1
    },
    abilityOverdrive: {
        id: "abilityOverdrive",
        name: "HABILIDAD OVERDRIVE",
        desc: "Más velocidad y cadencia ~3.5s. Botón OVER o tecla 2.",
        maxLevel: 1,
        baseCost: 450,
        costScale: 1
    },
    abilityNova: {
        id: "abilityNova",
        name: "HABILIDAD NOVA",
        desc: "Explosión que daña enemigos cercanos. Botón NOVA o tecla 3.",
        maxLevel: 1,
        baseCost: 500,
        costScale: 1
    },
    missileCount: {
        id: "missileCount",
        name: "MISILES ×N",
        desc: "Cantidad de misiles teledirigidos por salva (1→5). Ideal con Destructor.",
        maxLevel: 4,
        baseCost: 180,
        costScale: 1.55
    },
    missileDamage: {
        id: "missileDamage",
        name: "OJIVA",
        desc: "Más daño por misil y en el centro de la explosión.",
        maxLevel: 4,
        baseCost: 160,
        costScale: 1.5
    },
    missileBlast: {
        id: "missileBlast",
        name: "RADIO EXPLOSIÓN",
        desc: "Mayor área de daño. Enemigos cerca del centro reciben más daño.",
        maxLevel: 4,
        baseCost: 170,
        costScale: 1.5
    }
};

const DEFAULT_UPGRADES = {
    fireRate: 0,
    resistance: 0,
    shield: 0,
    doubleCannon: 0,
    helper: 0,
    moveSpeed: 0,
    pierce: 0,
    abilityEmp: 0,
    abilityOverdrive: 0,
    abilityNova: 0,
    multiShot: 0,
    damage: 0,
    magnet: 0,
    missileCount: 0,
    missileDamage: 0,
    missileBlast: 0
};

function loadCoins() {
    try {
        const n = Number(localStorage.getItem(COINS_KEY) || 0);
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    } catch (e) {
        return 0;
    }
}

function saveCoins(amount) {
    try {
        localStorage.setItem(COINS_KEY, String(Math.max(0, Math.floor(amount))));
    } catch (e) {}
    try { if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.queuePush) window.SpaceStrikeAuth.queuePush(); } catch (e2) {}
}

function addCoins(amount) {
    const next = loadCoins() + Math.max(0, Math.floor(amount));
    saveCoins(next);
    return next;
}

function loadUpgrades() {
    try {
        const raw = localStorage.getItem(UPGRADES_KEY);
        if (!raw) return Object.assign({}, DEFAULT_UPGRADES);
        const parsed = JSON.parse(raw);
        const out = Object.assign({}, DEFAULT_UPGRADES);
        Object.keys(DEFAULT_UPGRADES).forEach(function (k) {
            const v = Number(parsed[k] || 0);
            const max = UPGRADE_CATALOG[k] ? UPGRADE_CATALOG[k].maxLevel : 1;
            out[k] = Math.max(0, Math.min(max, Math.floor(v)));
        });
        return out;
    } catch (e) {
        return Object.assign({}, DEFAULT_UPGRADES);
    }
}

function saveUpgrades(upgrades) {
    try {
        localStorage.setItem(UPGRADES_KEY, JSON.stringify(upgrades));
    } catch (e) {}
    try { if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.queuePush) window.SpaceStrikeAuth.queuePush(); } catch (e2) {}
}

function getUpgradeCost(id, currentLevel) {
    const cat = UPGRADE_CATALOG[id];
    if (!cat) return 99999;
    if (currentLevel >= cat.maxLevel) return null;
    return Math.floor(cat.baseCost * Math.pow(cat.costScale, currentLevel));
}

function tryBuyUpgrade(id) {
    const upgrades = loadUpgrades();
    const cat = UPGRADE_CATALOG[id];
    if (!cat) return { ok: false, reason: "unknown" };
    const level = upgrades[id] || 0;
    if (level >= cat.maxLevel) return { ok: false, reason: "max" };
    const cost = getUpgradeCost(id, level);
    const coins = loadCoins();
    if (coins < cost) return { ok: false, reason: "coins", cost: cost, coins: coins };
    saveCoins(coins - cost);
    upgrades[id] = level + 1;
    saveUpgrades(upgrades);
    if (window.SpaceStrikeAchievements) window.SpaceStrikeAchievements.unlock("shopper");
    return { ok: true, upgrades: upgrades, coins: coins - cost, level: upgrades[id] };
}

/** Apply owned upgrades onto player + game config */
function applyUpgradesToPlayer(player, upgrades) {
    const u = upgrades || loadUpgrades();
    player.baseFireRate = 165;
    player.fireRate = Math.max(75, 165 - u.fireRate * 18);
    player.baseSpeed = 390;
    player.speed = 390 + u.moveSpeed * 35;
    player.maxHealth = 3 + u.resistance;
    player.health = player.maxHealth;
    player.shields = Math.max(0, Number(u.shield) || 0);
    player.doubleCannon = Number(u.doubleCannon) > 0;
    player.hasHelper = Number(u.helper) > 0;
    player.pierce = Number(u.pierce) > 0;
    player.multiShot = Number(u.multiShot) > 0;
    player.bulletDamage = 1 + Math.max(0, Number(u.damage) || 0);
    player.coinBonus = 1 + Math.max(0, Number(u.magnet) || 0) * 0.08;
    /* Misiles teledirigidos (Destructor + mejoras de tienda) */
    player.missileCountLv = Math.max(0, Number(u.missileCount) || 0);
    player.missileDamageLv = Math.max(0, Number(u.missileDamage) || 0);
    player.missileBlastLv = Math.max(0, Number(u.missileBlast) || 0);
    return u;
}

if (typeof window !== "undefined") {
    window.SpaceStrikeUpgrades = {
        catalog: UPGRADE_CATALOG,
        loadCoins: loadCoins,
        saveCoins: saveCoins,
        addCoins: addCoins,
        loadUpgrades: loadUpgrades,
        saveUpgrades: saveUpgrades,
        getCost: getUpgradeCost,
        buy: tryBuyUpgrade,
        applyToPlayer: applyUpgradesToPlayer
    };
}
