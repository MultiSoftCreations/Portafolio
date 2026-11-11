/* SPACE STRIKE — Special texture skins (cosmetic, permanent unlock via codes) */
(function () {
    var OWNED_KEY = "spaceStrikeOwnedSkins";
    var EQUIPPED_KEY = "spaceStrikeEquippedSkin";

    var SKIN_CATALOG = {
        horror_jason: {
            id: "horror_jason",
            name: "JASON · VIERNES 13",
            desc: "Skin de combate con máscaras hockey. Montable en Assalto / Interceptor.",
            ships: ["assault", "interceptor", "phoenix", "voidrunner"],
            sprite: "../img/texturas-especiales/skins/horror_jason.png",
            event: "horror_pack"
        },
        horror_chucky: {
            id: "horror_chucky",
            name: "CHUCKY · MUÑECO",
            desc: "Skin roja con caras de muñeco. Assalto / Interceptor.",
            ships: ["assault", "interceptor", "phoenix", "voidrunner"],
            sprite: "../img/texturas-especiales/skins/horror_chucky.png",
            event: "horror_pack"
        },
        horror_freddy: {
            id: "horror_freddy",
            name: "FREDDY · ALAS",
            desc: "Rostros de pesadilla en las alas. Assalto / Spectre.",
            ships: ["assault", "spectre", "phoenix"],
            sprite: "../img/texturas-especiales/skins/horror_freddy.png",
            event: "horror_pack"
        },
        horror_rpd_drone: {
            id: "horror_rpd_drone",
            name: "DRON FANTASMA",
            desc: "Dron temático de evento (visual en naves acorazadas).",
            ships: ["destroyer", "vt03", "tank"],
            sprite: "../img/texturas-especiales/skins/horror_rpd_drone.png",
            event: "horror_pack",
            drone: true
        },
        horror_rpd: {
            id: "horror_rpd",
            name: "R.P.D. TACTICAL HORROR",
            desc: "Casco militar R.P.D. con sangre. Solo R.P.D. LEON.",
            ships: ["destroyer", "vt03", "tank"],
            sprite: "../img/texturas-especiales/skins/horror_rpd.png",
            event: "horror_pack"
        },
        horror_jason_mil: {
            id: "horror_jason_mil",
            name: "JASON MILITAR",
            desc: "Caza militar con máscaras. Tanque / Assalto.",
            ships: ["tank", "assault", "vt03"],
            sprite: "../img/texturas-especiales/skins/horror_jason_mil.png",
            event: "horror_pack"
        },
        horror_jason_02: {
            id: "horror_jason_02",
            name: "JASON 02/20",
            desc: "Caza pesado numerado. Assalto / Tanque.",
            ships: ["assault", "tank", "voidrunner"],
            sprite: "../img/texturas-especiales/skins/horror_jason_02.png",
            event: "horror_pack"
        },
        horror_freddy_hat: {
            id: "horror_freddy_hat",
            name: "FREDDY SOMBRERO",
            desc: "Pesadilla con sombrero y garras. Tanque / Destructor.",
            ships: ["tank", "destroyer", "vt03"],
            sprite: "../img/texturas-especiales/skins/horror_freddy_hat.png",
            event: "horror_pack"
        },
        horror_freddy_claw: {
            id: "horror_freddy_claw",
            name: "FREDDY GARRA",
            desc: "Guante de garras doradas. R.P.D. / Tanque.",
            ships: ["tank", "destroyer", "phoenix"],
            sprite: "../img/texturas-especiales/skins/horror_freddy_claw.png",
            event: "horror_pack"
        },
        horror_delta: {
            id: "horror_delta",
            name: "DELTA JASON",
            desc: "Ala delta con máscaras. Spectre / Interceptor.",
            ships: ["spectre", "interceptor", "voidrunner"],
            sprite: "../img/texturas-especiales/skins/horror_delta.png",
            event: "horror_pack"
        },
        horror_freddy_heavy: {
            id: "horror_freddy_heavy",
            name: "FREDDY HEAVY",
            desc: "Acorazado de pesadilla. Tanque / Destructor.",
            ships: ["tank", "destroyer", "vt03"],
            sprite: "../img/texturas-especiales/skins/horror_freddy_heavy.png",
            event: "horror_pack"
        },
        horror_freddy_delta: {
            id: "horror_freddy_delta",
            name: "FREDDY DELTA",
            desc: "Caza delta con garras en motores. Spectre / Assalto.",
            ships: ["spectre", "assault", "phoenix"],
            sprite: "../img/texturas-especiales/skins/horror_freddy_delta.png",
            event: "horror_pack"
        },

        /* === Evento Día de Muertos — solo naves comunes + premium (NO especiales) === */
        muertos_assault: {
            id: "muertos_assault",
            name: "ASALTO CEMPASÚCHIL",
            desc: "Asalto en tonos de ofrenda. Solo naves no especiales.",
            ships: ["assault", "phoenix"],
            sprite: "../img/texturas-especiales/evento-muertos/assault.png",
            event: "dia_muertos"
        },
        muertos_interceptor: {
            id: "muertos_interceptor",
            name: "INTERCEPTOR OFRENDA",
            desc: "Interceptor temático Día de Muertos.",
            ships: ["interceptor", "voidrunner"],
            sprite: "../img/texturas-especiales/evento-muertos/interceptor.png",
            event: "dia_muertos"
        },
        muertos_tank: {
            id: "muertos_tank",
            name: "TANQUE CALAVERA",
            desc: "Tanque en colores de altar.",
            ships: ["tank", "vt03"],
            sprite: "../img/texturas-especiales/evento-muertos/tank.png",
            event: "dia_muertos"
        },
        muertos_spectre: {
            id: "muertos_spectre",
            name: "SPECTRE VELADA",
            desc: "Spectre en púrpura y cempasúchil.",
            ships: ["spectre", "voidrunner"],
            sprite: "../img/texturas-especiales/evento-muertos/spectre.png",
            event: "dia_muertos"
        },
        muertos_destroyer: {
            id: "muertos_destroyer",
            name: "DESTRUCTOR ALTAREÑO",
            desc: "Destructor temático del evento.",
            ships: ["destroyer", "vt03", "phoenix"],
            sprite: "../img/texturas-especiales/evento-muertos/destroyer.png",
            event: "dia_muertos"
        },
        muertos_vt03: {
            id: "muertos_vt03",
            name: "VT-03 NOCHE DE MUERTOS",
            desc: "Skin premium VT-03 del evento.",
            ships: ["vt03"],
            sprite: "../img/texturas-especiales/evento-muertos/vt03.png",
            event: "dia_muertos"
        },
        muertos_phoenix: {
            id: "muertos_phoenix",
            name: "PHOENIX OFRENDA",
            desc: "Skin premium Phoenix del evento.",
            ships: ["phoenix"],
            sprite: "../img/texturas-especiales/evento-muertos/phoenix.png",
            event: "dia_muertos"
        },
        muertos_voidrunner: {
            id: "muertos_voidrunner",
            name: "VOID RUNNER VELATORIO",
            desc: "Skin premium Void Runner del evento.",
            ships: ["voidrunner"],
            sprite: "../img/texturas-especiales/evento-muertos/voidrunner.png",
            event: "dia_muertos"
        },


        /* === Evento Navidad — skins por nave + especial === */
        navidad_interceptor: {
            id: "navidad_interceptor",
            name: "INTERCEPTOR NOEL",
            desc: "Skin navideña del Interceptor.",
            ships: ["interceptor"],
            sprite: "../img/texturas-especiales/evento-navidad/interceptor.png",
            event: "navidad"
        },
        navidad_assault: {
            id: "navidad_assault",
            name: "ASALTO NOEL",
            desc: "Skin navideña del Asalto.",
            ships: ["assault"],
            sprite: "../img/texturas-especiales/evento-navidad/assault.png",
            event: "navidad"
        },
        navidad_tank: {
            id: "navidad_tank",
            name: "TANQUE NOEL",
            desc: "Skin navideña del Tanque.",
            ships: ["tank"],
            sprite: "../img/texturas-especiales/evento-navidad/tank.png",
            event: "navidad"
        },
        navidad_spectre: {
            id: "navidad_spectre",
            name: "SPECTRE NOEL",
            desc: "Skin navideña del Spectre.",
            ships: ["spectre"],
            sprite: "../img/texturas-especiales/evento-navidad/spectre.png",
            event: "navidad"
        },
        navidad_destroyer: {
            id: "navidad_destroyer",
            name: "DESTRUCTOR NOEL",
            desc: "Skin navideña del Destructor.",
            ships: ["destroyer"],
            sprite: "../img/texturas-especiales/evento-navidad/destroyer.png",
            event: "navidad"
        },
        navidad_phoenix: {
            id: "navidad_phoenix",
            name: "PHOENIX NOEL",
            desc: "Skin navideña premium Phoenix.",
            ships: ["phoenix"],
            sprite: "../img/texturas-especiales/evento-navidad/phoenix.png",
            event: "navidad"
        },
        navidad_voidrunner: {
            id: "navidad_voidrunner",
            name: "VOID RUNNER NOEL",
            desc: "Skin navideña premium Void Runner.",
            ships: ["voidrunner"],
            sprite: "../img/texturas-especiales/evento-navidad/voidrunner.png",
            event: "navidad"
        },
        navidad_vt03: {
            id: "navidad_vt03",
            name: "VT-03 NOEL",
            desc: "Skin navideña premium VT-03.",
            ships: ["vt03"],
            sprite: "../img/texturas-especiales/evento-navidad/vt03.png",
            event: "navidad"
        },
        navidad_nebula: {
            id: "navidad_nebula",
            name: "NEBULA NOEL",
            desc: "Skin navideña exclusiva Nebula.",
            ships: ["nebula"],
            sprite: "../img/texturas-especiales/evento-navidad/nebula.png",
            event: "navidad"
        },
        navidad_rpd: {
            id: "navidad_rpd",
            name: "R.P.D. NOEL",
            desc: "Skin navideña exclusiva R.P.D. Leon.",
            ships: ["rpd"],
            sprite: "../img/texturas-especiales/evento-navidad/rpd.png",
            event: "navidad"
        },
        navidad_rpd_drone: {
            id: "navidad_rpd_drone",
            name: "DRON NOEL",
            desc: "Textura de drone navideño (R.P.D.).",
            ships: ["rpd"],
            sprite: "../img/texturas-especiales/evento-navidad/rpd-drone.png",
            event: "navidad",
            drone: true
        },

    };


    function loadOwned() {
        try {
            var raw = localStorage.getItem(OWNED_KEY);
            var arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    function saveOwned(list) {
        try { localStorage.setItem(OWNED_KEY, JSON.stringify(list)); } catch (e) {}
        try {
            if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.pushCloud) {
                window.SpaceStrikeAuth.pushCloud();
            }
        } catch (e2) {}
    }

    function owns(id) {
        return loadOwned().indexOf(id) >= 0;
    }

    function grant(id) {
        id = String(id || "").toLowerCase().trim();
        if (!SKIN_CATALOG[id]) return { ok: false, error: "Skin desconocida: " + id };
        var list = loadOwned();
        if (list.indexOf(id) >= 0) return { ok: true, already: true, skin: id };
        list.push(id);
        saveOwned(list);
        return { ok: true, already: false, skin: id };
    }

    function getEquipped() {
        try { return localStorage.getItem(EQUIPPED_KEY) || ""; } catch (e) { return ""; }
    }

    function equip(id) {
        id = String(id || "").trim();
        if (!id) {
            try { localStorage.removeItem(EQUIPPED_KEY); } catch (e) {}
            return { ok: true, equipped: "" };
        }
        if (!SKIN_CATALOG[id]) return { ok: false, error: "Skin no existe" };
        if (!owns(id)) return { ok: false, error: "No posees esta skin" };
        var shipId = "interceptor";
        try {
            if (window.SpaceStrikeShips && window.SpaceStrikeShips.getEquippedId) {
                shipId = window.SpaceStrikeShips.getEquippedId();
            }
        } catch (e) {}
        var skin = SKIN_CATALOG[id];
        if (skin.ships && skin.ships.indexOf(shipId) < 0) {
            return { ok: false, error: "Esta skin no monta en " + shipId + ". Usa: " + skin.ships.join(", ") };
        }
        try { localStorage.setItem(EQUIPPED_KEY, id); } catch (e2) {}
        try {
            if (window.SpaceStrikeAuth && window.SpaceStrikeAuth.pushCloud) window.SpaceStrikeAuth.pushCloud();
        } catch (e3) {}
        return { ok: true, equipped: id };
    }

    function getActiveSprite(shipId) {
        var eq = getEquipped();
        if (!eq || !owns(eq)) return null;
        var skin = SKIN_CATALOG[eq];
        if (!skin) return null;
        if (skin.drone) return null; /* drone handled separately */
        if (skin.ships && shipId && skin.ships.indexOf(shipId) < 0) return null;
        return skin.sprite || null;
    }

    function getActiveDroneSprite() {
        var eq = getEquipped();
        if (!eq || !owns(eq)) return null;
        var skin = SKIN_CATALOG[eq];
        if (skin && skin.drone) return skin.sprite;
        return null;
    }

    function listForShip(shipId) {
        var out = [];
        Object.keys(SKIN_CATALOG).forEach(function (k) {
            var s = SKIN_CATALOG[k];
            if (!s.ships || s.ships.indexOf(shipId) >= 0) {
                out.push(Object.assign({}, s, { owned: owns(k), equipped: getEquipped() === k }));
            }
        });
        return out;
    }

    function mergeFromCloud(data) {
        if (!data) return;
        if (Array.isArray(data.ownedSkins)) {
            var cur = loadOwned();
            data.ownedSkins.forEach(function (id) {
                if (cur.indexOf(id) < 0) cur.push(id);
            });
            saveOwned(cur);
        }
        if (data.equippedSkin) {
            try { localStorage.setItem(EQUIPPED_KEY, data.equippedSkin); } catch (e) {}
        }
    }

    function collectForCloud() {
        return {
            ownedSkins: loadOwned(),
            equippedSkin: getEquipped() || ""
        };
    }

    window.SpaceStrikeSkins = {
        catalog: SKIN_CATALOG,
        owns: owns,
        grant: grant,
        equip: equip,
        unequip: function () { return equip(""); },
        getEquipped: getEquipped,
        getActiveSprite: getActiveSprite,
        getActiveDroneSprite: getActiveDroneSprite,
        listForShip: listForShip,
        loadOwned: loadOwned,
        mergeFromCloud: mergeFromCloud,
        collectForCloud: collectForCloud
    };
})();