/* ================================================================
   SPACE STRIKE v3.0 — ShopManager
   Safe purchase flow for ships + upgrades.
   Flow: exist → not owned → funds → charge → grant → save → UI
================================================================ */

(function (global) {
    "use strict";

    function shipsApi() {
        return global.SpaceStrikeShips || null;
    }

    function upgradesApi() {
        return global.SpaceStrikeUpgrades || null;
    }

    function playerData() {
        return global.SpaceStrikePlayerData || null;
    }

    function saveManager() {
        return global.SpaceStrikeSaveManager || null;
    }

    function isPremium() {
        if (global.SpaceStrikePremium && global.SpaceStrikePremium.isPremium) {
            return !!global.SpaceStrikePremium.isPremium();
        }
        var PD = playerData();
        return PD && PD.isPremium ? !!PD.isPremium() : false;
    }

    /**
     * Buy / unlock a ship with full validation.
     * @returns {{ok:boolean, reason?:string, owned?:string[], equipped?:string}}
     */
    function purchaseShip(id) {
        id = String(id || "").toLowerCase().trim();
        var S = shipsApi();
        if (!id) return { ok: false, reason: "empty" };
        if (!S || !S.catalog || !S.catalog[id]) {
            return { ok: false, reason: "unknown" };
        }

        var ship = S.catalog[id];

        /* 1. Already owned? */
        var owned = false;
        if (S.owns) owned = !!S.owns(id);
        else if (playerData() && playerData().hasShip) owned = playerData().hasShip(id);
        if (owned) return { ok: false, reason: "owned" };

        /* 2. Code-only exclusives cannot be bought here */
        if ((ship.special || ship.codeOnly) && !ship.premium) {
            return { ok: false, reason: "code_only" };
        }

        /* 3. Premium gate */
        if (ship.premium && !isPremium()) {
            return { ok: false, reason: "premium" };
        }

        /* 4. Credits (non-premium paid ships) */
        if (!ship.premium && !ship.free && ship.cost > 0) {
            var coins = 0;
            if (playerData() && playerData().getCoins) coins = playerData().getCoins();
            else if (upgradesApi() && upgradesApi().loadCoins) coins = upgradesApi().loadCoins();
            if (coins < ship.cost) {
                return { ok: false, reason: "coins", cost: ship.cost, coins: coins };
            }
        }

        /* 5. Execute via existing ships.buy / grant (single path) */
        var res;
        if (S.buy) {
            res = S.buy(id);
        } else if (S.grant) {
            res = S.grant(id);
        } else {
            return { ok: false, reason: "no_api" };
        }

        if (!res || !res.ok) {
            return res || { ok: false, reason: "failed" };
        }

        /* 6. Persist */
        if (saveManager() && saveManager().save) {
            try {
                saveManager().save();
            } catch (e) {}
        }

        /* 7. Confirm final state */
        var finalOwned = S.loadOwned ? S.loadOwned() : (res.owned || []);
        var equipped = S.getEquippedId ? S.getEquippedId() : id;
        if (finalOwned.indexOf(id) < 0) {
            console.warn("[ShopManager] grant reported ok but ship not in owned list", id);
            if (S.grant) S.grant(id, { equip: false });
            finalOwned = S.loadOwned ? S.loadOwned() : finalOwned;
        }

        return {
            ok: true,
            owned: finalOwned,
            equipped: equipped,
            shipId: id
        };
    }

    /**
     * Equip ship only if owned.
     */
    function equipShip(id) {
        id = String(id || "").toLowerCase().trim();
        var S = shipsApi();
        if (!S || !S.catalog || !S.catalog[id]) return { ok: false, reason: "unknown" };
        var owned = S.owns ? S.owns(id) : false;
        if (!owned) return { ok: false, reason: "not_owned" };
        if (S.setEquipped) S.setEquipped(id);
        if (saveManager() && saveManager().save) {
            try {
                saveManager().save();
            } catch (e) {}
        }
        return { ok: true, equipped: id };
    }

    /**
     * Buy upgrade level with validation.
     */
    function purchaseUpgrade(id) {
        id = String(id || "").trim();
        var U = upgradesApi();
        if (!U || !U.catalog || !U.catalog[id]) {
            return { ok: false, reason: "unknown" };
        }
        if (!U.buy) return { ok: false, reason: "no_api" };

        var before = U.loadUpgrades ? U.loadUpgrades() : {};
        var beforeLv = Number(before[id]) || 0;
        var res = U.buy(id);
        if (!res || !res.ok) return res || { ok: false, reason: "failed" };

        var after = U.loadUpgrades ? U.loadUpgrades() : {};
        var afterLv = Number(after[id]) || 0;
        if (afterLv !== beforeLv + 1) {
            console.warn("[ShopManager] upgrade level mismatch", id, beforeLv, afterLv);
        }

        if (saveManager() && saveManager().save) {
            try {
                saveManager().save();
            } catch (e) {}
        }

        return {
            ok: true,
            id: id,
            level: afterLv,
            coins: U.loadCoins ? U.loadCoins() : undefined
        };
    }

    function getCoins() {
        if (playerData() && playerData().getCoins) return playerData().getCoins();
        if (upgradesApi() && upgradesApi().loadCoins) return upgradesApi().loadCoins();
        return 0;
    }

    global.SpaceStrikeShopManager = {
        purchaseShip: purchaseShip,
        equipShip: equipShip,
        purchaseUpgrade: purchaseUpgrade,
        getCoins: getCoins,
        isPremium: isPremium
    };
})(typeof window !== "undefined" ? window : this);
