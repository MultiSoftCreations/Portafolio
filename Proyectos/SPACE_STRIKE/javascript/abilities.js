/* SPACE STRIKE 2.0.0 — Special abilities with cooldown */

const ABILITY_DEFS = {
    emp: {
        id: "emp",
        name: "EMP",
        cooldown: 14,
        duration: 1.2,
        desc: "Congela enemigos ~1.2s (no te congela a ti)"
    },
    overdrive: {
        id: "overdrive",
        name: "OVERDRIVE",
        cooldown: 16,
        duration: 3.5,
        desc: "Más velocidad y cadencia"
    },
    nova: {
        id: "nova",
        name: "NOVA",
        cooldown: 20,
        duration: 0.3,
        desc: "Explosión que daña enemigos cercanos"
    }
};

const abilityState = {
    empCd: 0,
    overdriveCd: 0,
    novaCd: 0,
    empActive: 0,
    overdriveActive: 0
};

function ownsAbility(id) {
    try {
        if (window.SpaceStrikeUpgrades && window.SpaceStrikeUpgrades.loadUpgrades) {
            var u = window.SpaceStrikeUpgrades.loadUpgrades();
            if (id === "emp") return (u.abilityEmp || 0) >= 1;
            if (id === "overdrive") return (u.abilityOverdrive || 0) >= 1;
            if (id === "nova") return (u.abilityNova || 0) >= 1;
        }
    } catch (e) {}
    return false;
}

function abilityReady(id) {
    if (!ownsAbility(id)) return false;
    if (id === "emp") return abilityState.empCd <= 0;
    if (id === "overdrive") return abilityState.overdriveCd <= 0;
    if (id === "nova") return abilityState.novaCd <= 0;
    return false;
}

function updateAbilities(dt) {
    if (abilityState.empCd > 0) abilityState.empCd = Math.max(0, abilityState.empCd - dt);
    if (abilityState.overdriveCd > 0) abilityState.overdriveCd = Math.max(0, abilityState.overdriveCd - dt);
    if (abilityState.novaCd > 0) abilityState.novaCd = Math.max(0, abilityState.novaCd - dt);
    if (abilityState.empActive > 0) abilityState.empActive = Math.max(0, abilityState.empActive - dt);
    if (abilityState.overdriveActive > 0) abilityState.overdriveActive = Math.max(0, abilityState.overdriveActive - dt);
}

function tryActivateAbility(id, ctx) {
    /* ctx: { enemies, player, createExplosion, addScore, screenShake } */
    if (!abilityReady(id)) return false;
    const def = ABILITY_DEFS[id];
    if (!def) return false;

    if (id === "emp") {
        abilityState.empCd = def.cooldown;
        abilityState.empActive = def.duration;
        if (ctx.enemies) {
            ctx.enemies.forEach(function (e) {
                e.frozen = def.duration;
            });
        }
        return true;
    }

    if (id === "overdrive") {
        abilityState.overdriveCd = def.cooldown;
        abilityState.overdriveActive = def.duration;
        return true;
    }

    if (id === "nova") {
        abilityState.novaCd = def.cooldown;
        const px = ctx.player ? ctx.player.x : 0;
        const py = ctx.player ? ctx.player.y : 0;
        const radius = 130;
        if (ctx.enemies) {
            for (let i = ctx.enemies.length - 1; i >= 0; i--) {
                const e = ctx.enemies[i];
                const dx = e.x - px;
                const dy = e.y - py;
                if (Math.sqrt(dx * dx + dy * dy) < radius) {
                    e.health -= 3 + (ctx.player && ctx.player.bulletDamage ? ctx.player.bulletDamage : 1);
                    if (typeof ctx.createHitParticles === "function") {
                        ctx.createHitParticles(e.x, e.y);
                    }
                    if (e.health <= 0 && typeof ctx.destroyEnemy === "function") {
                        ctx.destroyEnemy(i, true);
                    }
                }
            }
        }
        if (typeof ctx.createExplosion === "function") {
            ctx.createExplosion(px, py, "player");
        }
        if (ctx.game) ctx.game.screenShake = Math.max(ctx.game.screenShake || 0, 12);
        return true;
    }
    return false;
}

function isEmpActive() {
    return abilityState.empActive > 0;
}

function isOverdriveActive() {
    return abilityState.overdriveActive > 0;
}

function resetAbilities() {
    abilityState.empCd = 0;
    abilityState.overdriveCd = 0;
    abilityState.novaCd = 0;
    abilityState.empActive = 0;
    abilityState.overdriveActive = 0;
}

function getAbilityUiState() {
    return {
        emp: { cd: abilityState.empCd, max: ABILITY_DEFS.emp.cooldown, active: abilityState.empActive > 0 },
        overdrive: { cd: abilityState.overdriveCd, max: ABILITY_DEFS.overdrive.cooldown, active: abilityState.overdriveActive > 0 },
        nova: { cd: abilityState.novaCd, max: ABILITY_DEFS.nova.cooldown, active: false }
    };
}

if (typeof window !== "undefined") {
    window.SpaceStrikeAbilities = {
        defs: ABILITY_DEFS,
        update: updateAbilities,
        tryActivate: tryActivateAbility,
        ready: abilityReady,
        owns: ownsAbility,
        isEmpActive: isEmpActive,
        isOverdriveActive: isOverdriveActive,
        reset: resetAbilities,
        ui: getAbilityUiState
    };
}
