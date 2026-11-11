/* SPACE STRIKE 2.0.0 — Random mid-mission events */

const EVENT_TYPES = [
    { id: "asteroid_field", label: "⚠ CAMPO DE ASTEROIDES", duration: 12 },
    { id: "elite_wave", label: "⚠ ÉLITE DETECTADA", duration: 8 },
    { id: "cargo", label: "✦ CARGAMENTO DETECTADO", duration: 6 }
];

const eventState = {
    active: null,
    timer: 0,
    cooldown: 25,
    nextIn: 20
};

function updateEvents(dt, ctx) {
    eventState.nextIn -= dt;
    if (eventState.active) {
        eventState.timer -= dt;
        if (eventState.timer <= 0) {
            eventState.active = null;
            if (ctx && ctx.systemStatus) {
                ctx.systemStatus.textContent = "SYSTEM ONLINE";
            }
        }
        return;
    }
    if (eventState.nextIn <= 0) {
        const roll = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
        eventState.active = roll.id;
        eventState.timer = roll.duration;
        eventState.nextIn = 28 + Math.random() * 20;
        if (ctx && ctx.systemStatus) {
            ctx.systemStatus.textContent = roll.label;
        }
        if (roll.id === "cargo" && ctx && typeof ctx.grantCoins === "function") {
            ctx.grantCoins(40 + Math.floor(Math.random() * 60));
        }
    }
}

function getActiveEvent() {
    return eventState.active;
}

function resetEvents() {
    eventState.active = null;
    eventState.timer = 0;
    eventState.nextIn = 18 + Math.random() * 10;
}

if (typeof window !== "undefined") {
    window.SpaceStrikeEvents = {
        update: updateEvents,
        active: getActiveEvent,
        reset: resetEvents
    };
}
