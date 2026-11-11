/* SPACE STRIKE 2.3.0 — Premium system
   Free game stays complete. Premium = cosmetics + QoL + exclusives.
   Payment can later hook to Stripe/PayPal; for now unlock via code or flag.
*/

const PREMIUM_KEY = "spaceStrikePremium";
const MP_LINK = "https://mpago.la/1D6UECL";
/** App ntfy → suscríbete al topic */
const NTFY_TOPIC = "spacestrike-premium-ricardo";
const OWNER_EMAIL = "ricardotorresgalvez005@gmail.com";
const OWNER_WHATSAPP = "525562260337";
const PREMIUM_CODE_KEY = "spaceStrikePremiumCode";

/** Official redeem codes (change/rotate in production) */
const VALID_CODES = [
    "STRIKE-PREMIUM",
    "MULTISOFT-VIP",
    "PILOTO-ELITE"
];

const PREMIUM_PERKS = {
    coinMultiplier: 1.5,      /* +50% credits earned */
    startingCoins: 300,       /* one-time grant on first unlock */
    exclusiveShips: ["phoenix", "voidrunner"],
    exclusiveSkins: true,
    noAdsFlag: true,          /* reserved for future ads */
    doubleDaily: true,
    badge: "PREMIUM"
};

function isPremium() {
    try {
        return localStorage.getItem(PREMIUM_KEY) === "1";
    } catch (e) {
        return false;
    }
}

function setPremium(on) {
    try {
        localStorage.setItem(PREMIUM_KEY, on ? "1" : "0");
    } catch (e) {}
}

function hasGrantedStarter() {
    try {
        return localStorage.getItem(PREMIUM_KEY + "_starter") === "1";
    } catch (e) {
        return false;
    }
}

function markStarterGranted() {
    try {
        localStorage.setItem(PREMIUM_KEY + "_starter", "1");
    } catch (e) {}
}

function redeemCode(code) {
    code = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
    var normalized = VALID_CODES.map(function (c) {
        return c.toUpperCase().replace(/\s+/g, "");
    });
    if (normalized.indexOf(code) < 0) {
        return { ok: false, reason: "invalid" };
    }
    if (isPremium()) {
        return { ok: true, already: true };
    }
    activatePremium();
    try {
        localStorage.setItem(PREMIUM_CODE_KEY, code);
    } catch (e) {}
    return { ok: true, already: false };
}

function activatePremium() {
    setPremium(true);
    /* Badge dorado en ranking al instante (sin superar récord) */
    try {
        if (window.SpaceStrikeGlobalLB && window.SpaceStrikeGlobalLB.markPremium) {
            window.SpaceStrikeGlobalLB.markPremium().catch(function () {});
        }
    } catch (eMark) {}

    /* Grant exclusive ships */
    if (window.SpaceStrikeShips) {
        var owned = window.SpaceStrikeShips.loadOwned();
        PREMIUM_PERKS.exclusiveShips.forEach(function (id) {
            if (owned.indexOf(id) < 0) owned.push(id);
        });
        if (window.SpaceStrikeShips.saveOwned) {
            /* ships.js may not export saveOwned — use localStorage */
        }
        try {
            localStorage.setItem("spaceStrikeShips", JSON.stringify(owned));
        } catch (e) {}
    }

    /* One-time coin grant */
    if (!hasGrantedStarter() && window.SpaceStrikeUpgrades) {
        var coins = window.SpaceStrikeUpgrades.loadCoins();
        window.SpaceStrikeUpgrades.saveCoins(coins + PREMIUM_PERKS.startingCoins);
        markStarterGranted();
    }
}

function coinMultiplier() {
    return isPremium() ? PREMIUM_PERKS.coinMultiplier : 1;
}

function getPremiumInfo() {
    return {
        active: isPremium(),
        perks: PREMIUM_PERKS,
        badge: isPremium() ? PREMIUM_PERKS.badge : null
    };
}

if (typeof window !== "undefined") {
    function apiBase() {
    try {
        return location.origin;
    } catch (e) {
        return "";
    }
}

function startCheckout() {
    var ref = "ss-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    try { localStorage.setItem("spaceStrikePendingPay", ref); } catch (e) {}
    return fetch(apiBase() + "/.netlify/functions/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: ref })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (data && data.ok && data.init_point) {
            location.href = data.init_point;
            return data;
        }
        throw new Error((data && data.error) || "No se pudo crear el pago");
    });
}

function confirmFromUrl() {
    var params = new URLSearchParams(location.search || "");
    var status = params.get("status") || params.get("collection_status") || params.get("mp");
    var paymentId = params.get("payment_id") || params.get("collection_id");
    if (!paymentId) {
        return Promise.resolve({ ok: false, reason: "no_payment" });
    }
    return fetch(apiBase() + "/.netlify/functions/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId })
    }).then(function (r) { return r.json(); }).then(function (data) {
        if (data && data.premium) {
            activatePremium();
            return { ok: true, status: data.status };
        }
        return { ok: false, status: data && data.status, error: data && data.error };
    });
}

function openMercadoPago() {
    try {
        /* Aviso al dueño del juego (ntfy app en el celular) */
        fetch("https://ntfy.sh/" + NTFY_TOPIC, {
            method: "POST",
            body: "Space Strike: alguien abrió el pago Premium ($49). Revisa Mercado Pago y genera un código."
        }).catch(function () {});
    } catch (e) {}
    window.open(MP_LINK, "_blank");
}

function notifyPaid(extra) {
    var pilot = "";
    var email = "";
    try {
        if (window.SpaceStrikePlayer && window.SpaceStrikePlayer.getName) {
            pilot = window.SpaceStrikePlayer.getName() || "";
        }
    } catch (e1) {}
    try {
        if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.user && window.SpaceStrikeAuth.user()) {
            email = window.SpaceStrikeAuth.user().email || "";
        }
    } catch (e2) {}
    if (!pilot) pilot = String(extra || "").trim() || "desconocido";

    var msg =
        "SPACE STRIKE PREMIUM — YA PAGUÉ\n" +
        "Piloto: " + pilot + "\n" +
        "Email: " + (email || "sin Google") + "\n" +
        "Monto: $49 MXN\n" +
        "Hora: " + new Date().toLocaleString("es-MX") + "\n" +
        "Acción: confirma en Mercado Pago y envía código de un uso.";

    /* 1) Push al celular (app ntfy, topic spacestrike-premium-ricardo) */
    try {
        fetch("https://ntfy.sh/" + NTFY_TOPIC, {
            method: "POST",
            headers: {
                "Title": "Space Strike — compra Premium",
                "Priority": "high",
                "Tags": "moneybag,star"
            },
            body: msg
        }).catch(function () {});
    } catch (e3) {}

    /* 2) WhatsApp a tu número */
    try {
        window.open(
            "https://wa.me/" + OWNER_WHATSAPP + "?text=" + encodeURIComponent(msg),
            "_blank"
        );
    } catch (e4) {}

    /* 3) Correo Gmail */
    try {
        setTimeout(function () {
            window.location.href =
                "mailto:" + OWNER_EMAIL +
                "?subject=" + encodeURIComponent("Space Strike Premium — YA PAGUÉ") +
                "&body=" + encodeURIComponent(msg);
        }, 700);
    } catch (e5) {}

    return { ok: true };
}

window.SpaceStrikePremium = {
        MP_LINK: MP_LINK,
        openPay: openMercadoPago,
        notifyPaid: notifyPaid,
        startCheckout: startCheckout,
        confirmFromUrl: confirmFromUrl,
        isPremium: isPremium,
        redeem: redeemCode,
        activate: activatePremium,
        coinMultiplier: coinMultiplier,
        info: getPremiumInfo,
        PERKS: PREMIUM_PERKS
    };
}
