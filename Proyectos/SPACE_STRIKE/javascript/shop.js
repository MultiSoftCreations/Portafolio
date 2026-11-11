/* SPACE STRIKE — Shop (upgrades + ships) */
(function () {
    const spaceBackground = document.getElementById("space");
    const transitionScreen = document.getElementById("transition");
    const backButton = document.getElementById("backButton");
    const coinsValue = document.getElementById("coinsValue");
    const shopList = document.getElementById("shopList");
    const shipsList = document.getElementById("shipsList");
    const specialShipsList = document.getElementById("specialShipsList");
    const specialHint = document.getElementById("specialHint");

    function createStars() {
        if (!spaceBackground) return;
        spaceBackground.innerHTML = "";
        for (let i = 0; i < 70; i++) {
            const s = document.createElement("div");
            s.className = "star";
            const size = Math.random() * 2 + 0.4;
            s.style.width = size + "px";
            s.style.height = size + "px";
            s.style.left = Math.random() * 100 + "%";
            s.style.top = Math.random() * 100 + "%";
            s.style.animationDuration = (Math.random() * 3 + 1.5) + "s";
            spaceBackground.appendChild(s);
        }
    }

    function navigateTo(page) {
        if (!transitionScreen || transitionScreen.classList.contains("active")) return;
        transitionScreen.classList.add("active");
        setTimeout(function () { location.href = page; }, 450);
    }

    function renderShipCard(S, id, ship, owned, equipped, coins) {
        const isEq = equipped === id;
        const isSpecial = !!(ship.special || ship.codeOnly) && !ship.premium;
        /* Owned if in list OR currently equipped (heals UI desync) */
        const isOwned = owned.indexOf(id) >= 0 || isEq;

        const card = document.createElement("article");
        card.className = "shop-card ship-card" + (isEq ? " equipped" : "") + (isSpecial ? " special-ship" : "") + (ship.premium ? " premium-ship" : "");
        card.innerHTML =
            "<h3>" + ship.name + "</h3>" +
            "<div class=\"shop-meta\">VEL " + ship.speed + " · CAD " + ship.fireRate + " · HULL " + ship.maxHealth +
            (ship.damageBonus ? " · DMG +" + ship.damageBonus : "") + "</div>" +
            "<p>" + ship.desc + "</p>" +
            "<div class=\"ship-swatch\" style=\"background:" + ship.color + "\"></div>";

        const btn = document.createElement("button");
        btn.type = "button";
        /* Premium always checked before special/code locks */
        var isPremShip = !!ship.premium;
        var hasPrem = window.SpaceStrikePremium && window.SpaceStrikePremium.isPremium && window.SpaceStrikePremium.isPremium();

        if (isEq) {
            btn.textContent = "EQUIPADA";
            btn.disabled = true;
            btn.className = "maxed";
        } else if (isOwned) {
            btn.textContent = "EQUIPAR";
            btn.addEventListener("click", function () {
                var SM = window.SpaceStrikeShopManager;
                if (SM && SM.equipShip) {
                    var er = SM.equipShip(id);
                    if (!er.ok) console.warn("[Shop] equip fail", er);
                } else {
                    S.setEquipped(id);
                }
                renderShips();
            });
        } else if (isPremShip) {
            if (hasPrem) {
                btn.textContent = "DESBLOQUEAR ★";
                btn.disabled = false;
                btn.className = "";
                btn.addEventListener("click", function () {
                    var SM = window.SpaceStrikeShopManager;
                    var res = SM && SM.purchaseShip ? SM.purchaseShip(id) : S.buy(id);
                    console.log("[Shop] premium buy", id, res);
                    if (res && res.ok) {
                        if (SM && SM.equipShip) SM.equipShip(id);
                        else S.setEquipped(id);
                        renderAll();
                    } else if (res && res.reason === "premium") {
                        btn.textContent = "SOLO PREMIUM ★";
                    } else if (res && res.reason === "code_only") {
                        if (S.grant) {
                            var g = S.grant(id);
                            if (g && g.ok) {
                                S.setEquipped(id);
                                renderAll();
                            }
                        }
                    }
                });
            } else {
                btn.textContent = "SOLO PREMIUM ★";
                btn.disabled = true;
                btn.className = "premium-lock";
            }
        } else if (isSpecial) {
            btn.textContent = "CÓDIGO EXCLUSIVO";
            btn.disabled = true;
            btn.className = "premium-lock";
        } else {
            btn.textContent = "COMPRAR · " + ship.cost;
            if (coins < ship.cost) btn.disabled = true;
            btn.addEventListener("click", function () {
                var SM = window.SpaceStrikeShopManager;
                const res = SM && SM.purchaseShip ? SM.purchaseShip(id) : S.buy(id);
                if (res.ok) {
                    if (SM && SM.equipShip) SM.equipShip(id);
                    else S.setEquipped(id);
                    renderAll();
                } else if (res.reason === "coins") {
                    alert("Créditos insuficientes. Necesitas " + res.cost + ".");
                }
            });
        }
        card.appendChild(btn);
        return card;
    }

    function ensureSpecialSection() {
        var list = document.getElementById("specialShipsList");
        if (list) return list;
        /* Create section if HTML is outdated */
        var main = document.querySelector("main.shop") || document.querySelector("main");
        if (!main) return null;
        var title = document.createElement("div");
        title.className = "shop-section-title special";
        title.id = "specialSectionTitle";
        title.textContent = "NAVES ESPECIALES";
        title.style.cssText = "width:min(420px,94vw);margin:18px auto 8px;font-size:12px;letter-spacing:3px;color:#c4b5ff;font-weight:800;";
        var hint = document.createElement("p");
        hint.id = "specialHint";
        hint.className = "special-hint";
        hint.style.cssText = "width:min(420px,94vw);margin:0 auto 10px;font-size:11px;color:rgba(180,160,255,0.55);";
        list = document.createElement("section");
        list.id = "specialShipsList";
        list.className = "shop-list";
        var upgradesTitle = main.querySelector(".shop-section-title.upgrades");
        var shipsSection = document.getElementById("shipsList");
        var anchor = upgradesTitle || (shipsSection && shipsSection.nextSibling);
        if (anchor && anchor.parentNode) {
            anchor.parentNode.insertBefore(title, anchor);
            anchor.parentNode.insertBefore(hint, anchor);
            anchor.parentNode.insertBefore(list, anchor);
        } else if (shipsSection && shipsSection.parentNode) {
            shipsSection.parentNode.insertBefore(title, shipsSection);
            shipsSection.parentNode.insertBefore(hint, shipsSection);
            shipsSection.parentNode.insertBefore(list, shipsSection);
        } else {
            main.appendChild(title);
            main.appendChild(hint);
            main.appendChild(list);
        }
        return list;
    }

    function renderShips() {
        const S = window.SpaceStrikeShips;
        if (!S || !S.catalog) {
            console.warn("[Shop] SpaceStrikeShips no cargó");
            return;
        }
        const owned = S.loadOwned ? S.loadOwned() : [];
        const equipped = S.getEquippedId ? S.getEquippedId() : "interceptor";
        const coins = window.SpaceStrikeUpgrades ? window.SpaceStrikeUpgrades.loadCoins() : 0;

        var specialListEl = specialShipsList || ensureSpecialSection();
        var hintEl = document.getElementById("specialHint") || specialHint;

        if (shipsList) shipsList.innerHTML = "";
        if (specialListEl) specialListEl.innerHTML = "";

        var normalIds = [];
        var specialIds = [];
        Object.keys(S.catalog).forEach(function (id) {
            var ship = S.catalog[id];
            if (!ship) return;
            /* Premium ships go in the normal list (DESBLOQUEAR ★ / EQUIPAR) */
            if (ship.premium && !ship.codeOnly) {
                normalIds.push(id);
            } else if (ship.special || ship.codeOnly) {
                specialIds.push(id);
            } else {
                normalIds.push(id);
            }
        });

        /* Force NEBULA into special list if missing from catalog flags */
        if (specialIds.indexOf("nebula") < 0 && S.catalog.nebula) {
            specialIds.push("nebula");
            normalIds = normalIds.filter(function (id) { return id !== "nebula"; });
        }
        if (specialIds.indexOf("nebula") < 0 && owned.indexOf("nebula") >= 0) {
            /* Catalog without nebula entry — synthesize card data */
            S.catalog.nebula = S.catalog.nebula || {
                id: "nebula",
                name: "NEBULA ★★",
                desc: "EXCLUSIVA. Doble cañón, agilidad, escudo 3, disparo rojo.",
                special: true,
                codeOnly: true,
                speed: 480,
                fireRate: 140,
                maxHealth: 3,
                damageBonus: 1,
                color: "#7b6cff",
                accent: "#c4b5ff"
            };
            specialIds.push("nebula");
        }

        normalIds.forEach(function (id) {
            if (!shipsList) return;
            shipsList.appendChild(renderShipCard(S, id, S.catalog[id], owned, equipped, coins));
        });

        var unlockedSpecial = 0;
        specialIds.forEach(function (id) {
            if (!specialListEl) return;
            if (owned.indexOf(id) >= 0) unlockedSpecial++;
            specialListEl.appendChild(renderShipCard(S, id, S.catalog[id], owned, equipped, coins));
        });

        if (hintEl) {
            if (specialIds.length === 0) {
                hintEl.textContent = "Aún no hay naves especiales en esta versión.";
            } else if (unlockedSpecial === 0) {
                hintEl.textContent = "Desbloquea naves exclusivas con códigos en RECOMPENSAS. (" + specialIds.length + " disponibles)";
            } else {
                hintEl.textContent = "Desbloqueadas: " + unlockedSpecial + " / " + specialIds.length + " · Equípala aquí.";
            }
        }
        console.log("[Shop] special=", specialIds, "owned=", owned, "equipped=", equipped);
        var st = document.getElementById("invStatus");
        if (st) {
            st.textContent = "Inventario: " + owned.join(", ") + " | Equipada: " + equipped;
        }
    }

    function renderUpgrades() {
        const U = window.SpaceStrikeUpgrades;
        if (!U || !shopList) return;
        const upgrades = U.loadUpgrades();
        const coins = U.loadCoins();
        if (coinsValue) coinsValue.textContent = String(coins);
        shopList.innerHTML = "";

        Object.keys(U.catalog).forEach(function (id) {
            const cat = U.catalog[id];
            const level = upgrades[id] || 0;
            const cost = U.getCost(id, level);
            const maxed = level >= cat.maxLevel;

            const card = document.createElement("article");
            card.className = "shop-card";
            card.innerHTML =
                "<h3>" + cat.name + "</h3>" +
                "<div class=\"shop-meta\">NV " + level + " / " + cat.maxLevel + "</div>" +
                "<p>" + cat.desc + "</p>";

            const btn = document.createElement("button");
            btn.type = "button";
            if (maxed) {
                btn.textContent = "MÁXIMO";
                btn.disabled = true;
                btn.className = "maxed";
            } else {
                btn.textContent = "COMPRAR · " + cost;
                if (coins < cost) btn.disabled = true;
                btn.addEventListener("click", function () {
                    var SM = window.SpaceStrikeShopManager;
                    const res = SM && SM.purchaseUpgrade ? SM.purchaseUpgrade(id) : U.buy(id);
                    if (res.ok) renderAll();
                    else if (res.reason === "coins") alert("Créditos insuficientes. Necesitas " + res.cost + ".");
                });
            }
            card.appendChild(btn);
            shopList.appendChild(card);
        });
    }

    function renderAll() {
        renderUpgrades();
        renderShips();
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            navigateTo("../index.html");
        });
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") navigateTo("../index.html");
    });

    createStars();
    renderAll();

    /* Always refresh inventory from single source of truth */
    window.addEventListener("ss-ships-changed", function () {
        renderShips();
    });
    window.addEventListener("pageshow", function () {
        renderAll();
    });
    window.addEventListener("storage", function (e) {
        if (!e.key || e.key.indexOf("spaceStrikeShip") >= 0 || e.key === "spaceStrikeShipsPing") {
            renderShips();
        }
    });
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") renderShips();
    });
})();
