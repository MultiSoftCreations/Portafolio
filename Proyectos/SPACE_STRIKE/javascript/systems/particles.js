/* ================================================================
   SPACE STRIKE v3.0 — ParticleSystem
   Extracted from game.js (non-breaking). Reusable pool.
================================================================ */

(function (global) {
    "use strict";

    var list = [];
    var floaters = [];

    function rnd(min, max) {
        return min + Math.random() * (max - min);
    }

    function maxParticles() {
        if (global.PERF && typeof global.PERF.maxParticles === "number") {
            return Math.max(20, global.PERF.maxParticles);
        }
        return 120;
    }

    function explosionScale() {
        if (global.PERF && typeof global.PERF.explosionScale === "number") {
            return global.PERF.explosionScale;
        }
        return 1;
    }

    function create(x, y, options) {
        options = options || {};
        var max = maxParticles();
        if (list.length >= max) {
            list.splice(0, Math.ceil(max * 0.25));
        }
        var life = options.life != null ? options.life : rnd(0.25, 0.7);
        list.push({
            x: x,
            y: y,
            vx: options.vx != null ? options.vx : rnd(-100, 100),
            vy: options.vy != null ? options.vy : rnd(-100, 100),
            life: life,
            maxLife: life,
            size: options.size != null ? options.size : rnd(1, 3),
            gravity: options.gravity != null ? options.gravity : 0,
            alpha: options.alpha != null ? options.alpha : 1,
            type: options.type || "normal",
            color: options.color || null
        });
    }

    function explosion(x, y, type) {
        type = type || "basic";
        var scale = explosionScale();
        var count = Math.floor(14 * scale);
        if (type === "elite") count = Math.floor(22 * scale);
        if (type === "player") count = Math.floor(28 * scale);
        if (type === "boss") count = Math.floor(40 * scale);
        count = Math.max(4, count);

        for (var i = 0; i < count; i++) {
            var angle = rnd(0, Math.PI * 2);
            var speed = rnd(40, type === "player" ? 300 : 220);
            create(x, y, {
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: rnd(0.25, 0.75),
                size: rnd(1, type === "elite" ? 5 : 3),
                gravity: rnd(0, 30),
                color: type === "boss" ? "#ff6b35" : type === "elite" ? "#c4b5ff" : null
            });
        }
    }

    function hit(x, y) {
        for (var i = 0; i < 5; i++) {
            create(x, y, {
                vx: rnd(-90, 90),
                vy: rnd(-90, 90),
                life: rnd(0.1, 0.3),
                size: rnd(1, 2.5)
            });
        }
    }

    function muzzle(x, y) {
        for (var i = 0; i < 4; i++) {
            create(x, y, {
                vx: rnd(-35, 35),
                vy: rnd(-120, -60),
                life: rnd(0.08, 0.18),
                size: rnd(1, 2.5),
                color: "#9ec9ff"
            });
        }
    }

    function update(dt) {
        updateFloaters(dt);
        for (var i = list.length - 1; i >= 0; i--) {
            var p = list[i];
            p.life -= dt;
            if (p.life <= 0) {
                list.splice(i, 1);
                continue;
            }
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += (p.gravity || 0) * dt;
        }
    }

    function draw(ctx) {
        if (!ctx) return;
        for (var i = 0; i < list.length; i++) {
            var p = list[i];
            var alpha = p.maxLife > 0 ? p.life / p.maxLife : 0;
            ctx.globalAlpha = Math.max(0, Math.min(1, alpha * (p.alpha != null ? p.alpha : 1)));
            ctx.fillStyle = p.color || "#bdeaff";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        drawFloaters(ctx);
    }

    function clear() {
        list.length = 0;
        floaters.length = 0;
    }

    function floatText(x, y, text, color) {
        floaters.push({
            x: x,
            y: y,
            text: String(text),
            color: color || "#bdeaff",
            life: 0.7,
            maxLife: 0.7,
            vy: -48
        });
    }

    function updateFloaters(dt) {
        for (var i = floaters.length - 1; i >= 0; i--) {
            var f = floaters[i];
            f.life -= dt;
            f.y += f.vy * dt;
            if (f.life <= 0) floaters.splice(i, 1);
        }
    }

    function drawFloaters(ctx) {
        if (!ctx) return;
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px Segoe UI, Arial, sans-serif";
        for (var i = 0; i < floaters.length; i++) {
            var f = floaters[i];
            var a = f.maxLife > 0 ? f.life / f.maxLife : 0;
            ctx.globalAlpha = Math.max(0, Math.min(1, a));
            ctx.fillStyle = f.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = f.color;
            ctx.fillText(f.text, f.x, f.y);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    function getList() {
        return list;
    }

    global.SpaceStrikeParticles = {
        create: create,
        explosion: explosion,
        hit: hit,
        muzzle: muzzle,
        update: update,
        draw: draw,
        clear: clear,
        getList: getList,
        floatText: floatText
    };
})(typeof window !== "undefined" ? window : this);
