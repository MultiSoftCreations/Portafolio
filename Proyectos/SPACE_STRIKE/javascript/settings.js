/* ================================================================
   SPACE STRIKE
   SETTINGS
   Version: 1.3.3
================================================================ */


const STORAGE_KEY = "spaceStrikeSettings";
const HIGH_SCORE_KEY = "spaceStrikeHighScore";


const DEFAULT_SETTINGS = {
    sound: true,
    music: true,
    vibration: true,
    difficulty: "normal"
};


/* ================================================================
   DOM
================================================================ */

const spaceBackground = document.getElementById("space");
const transitionScreen = document.getElementById("transition");

const soundToggle = document.getElementById("soundToggle");
const musicToggle = document.getElementById("musicToggle");
const vibrationToggle = document.getElementById("vibrationToggle");

const soundValue = document.getElementById("soundValue");
const musicValue = document.getElementById("musicValue");
const vibrationValue = document.getElementById("vibrationValue");
const difficultyValue = document.getElementById("difficultyValue");
const highScoreValue = document.getElementById("highScoreValue");

const diffEasy = document.getElementById("diffEasy");
const diffNormal = document.getElementById("diffNormal");
const diffHard = document.getElementById("diffHard");

const resetScoreButton = document.getElementById("resetScoreButton");
const backButton = document.getElementById("backButton");
const saveButton = document.getElementById("saveButton");


/* ================================================================
   STATE
================================================================ */

let settings = loadSettings();


/* ================================================================
   LOAD / SAVE
================================================================ */

function loadSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...DEFAULT_SETTINGS };
        }
        const parsed = JSON.parse(raw);
        return {
            sound: typeof parsed.sound === "boolean" ? parsed.sound : true,
            music: typeof parsed.music === "boolean" ? parsed.music : true,
            vibration: typeof parsed.vibration === "boolean" ? parsed.vibration : true,
            difficulty: ["easy", "normal", "hard"].includes(parsed.difficulty)
                ? parsed.difficulty
                : "normal"
        };
    } catch (e) {
        return { ...DEFAULT_SETTINGS };
    }
}


function saveSettings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        // silent
    }
}


function getHighScore() {
    let best = Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    if (!Number.isFinite(best) || best < 0) {
        best = 0;
    }

    /*
        If a run was saved with a higher score but the
        high-score key was never written (bug in 0.1.0),
        recover it from progress.
    */
    try {
        const raw = localStorage.getItem("spaceStrikeProgress");
        if (raw) {
            const data = JSON.parse(raw);
            if (data && typeof data.score === "number") {
                best = Math.max(best, data.score);
            }
        }
    } catch (e) {
        // silent
    }

    try {
        localStorage.setItem(HIGH_SCORE_KEY, String(Math.floor(best)));
    } catch (e) {
        // silent
    }

    return best;
}


function resetHighScore() {
    try {
        localStorage.setItem(HIGH_SCORE_KEY, "0");
    } catch (e) {
        // silent
    }
    updateHighScoreDisplay();
}


/* ================================================================
   UI UPDATE
================================================================ */

function formatNumber(value) {
    return String(Math.floor(value)).padStart(4, "0");
}


function updateToggle(button, valueElement, isOn) {
    if (!button || !valueElement) return;
    button.setAttribute("aria-pressed", isOn ? "true" : "false");
    valueElement.textContent = isOn ? "ON" : "OFF";
}


function updateDifficultyUI() {
    const map = {
        easy: "FÁCIL",
        normal: "NORMAL",
        hard: "DIFÍCIL"
    };

    if (difficultyValue) {
        difficultyValue.textContent = map[settings.difficulty] || "NORMAL";
    }

    const buttons = [diffEasy, diffNormal, diffHard];
    buttons.forEach((btn) => {
        if (!btn) return;
        const diff = btn.getAttribute("data-diff");
        if (diff === settings.difficulty) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}


function updateHighScoreDisplay() {
    if (highScoreValue) {
        highScoreValue.textContent = formatNumber(getHighScore());
    }
}


function applyUI() {
    updateToggle(soundToggle, soundValue, settings.sound);
    updateToggle(musicToggle, musicValue, settings.music);
    updateToggle(vibrationToggle, vibrationValue, settings.vibration);
    updateDifficultyUI();
    updateHighScoreDisplay();
}


/* ================================================================
   STARS
================================================================ */

const STAR_COUNT_LIMIT = 180;

function createStars() {
    if (!spaceBackground) return;
    spaceBackground.innerHTML = "";

    const calculatedAmount = Math.floor(
        (window.innerWidth * window.innerHeight) / 7000
    );
    const amount = Math.min(
        STAR_COUNT_LIMIT,
        Math.max(40, calculatedAmount)
    );

    for (let i = 0; i < amount; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const isLargeStar = Math.random() < 0.15;
        const size = isLargeStar
            ? Math.random() * 2.5 + 1
            : Math.random() * 1.6 + 0.5;

        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.left = (Math.random() * 100) + "%";
        star.style.top = (Math.random() * 100) + "%";
        star.style.animationDuration = (Math.random() * 3 + 1.5) + "s";
        star.style.animationDelay = (Math.random() * 3) + "s";

        if (Math.random() < 0.25) {
            star.style.opacity = String(Math.random() * 0.4 + 0.2);
        }

        spaceBackground.appendChild(star);
    }
}


/* ================================================================
   NAVIGATION
================================================================ */

function navigateTo(page) {
    if (!transitionScreen || transitionScreen.classList.contains("active")) {
        return;
    }
    transitionScreen.classList.add("active");
    window.setTimeout(function () {
        window.location.href = page;
    }, 500);
}


function goBack() {
    navigateTo("../index.html");
}


/* ================================================================
   EVENTS
================================================================ */

function bindToggles() {
    if (soundToggle) {
        soundToggle.addEventListener("click", function () {
            settings.sound = !settings.sound;
            updateToggle(soundToggle, soundValue, settings.sound);
        });
    }

    if (musicToggle) {
        musicToggle.addEventListener("click", function () {
            settings.music = !settings.music;
            updateToggle(musicToggle, musicValue, settings.music);
        });
    }

    if (vibrationToggle) {
        vibrationToggle.addEventListener("click", function () {
            settings.vibration = !settings.vibration;
            updateToggle(vibrationToggle, vibrationValue, settings.vibration);
        });
    }
}


function bindDifficulty() {
    const buttons = [diffEasy, diffNormal, diffHard];
    buttons.forEach(function (btn) {
        if (!btn) return;
        btn.addEventListener("click", function () {
            const diff = btn.getAttribute("data-diff");
            if (["easy", "normal", "hard"].includes(diff)) {
                settings.difficulty = diff;
                updateDifficultyUI();
            }
        });
    });
}


function bindActions() {
    if (resetScoreButton) {
        resetScoreButton.addEventListener("click", function () {
            const ok = window.confirm(
                "¿Reiniciar el récord de puntuación?\nEsta acción no se puede deshacer."
            );
            if (ok) {
                resetHighScore();
            }
        });
    }

    if (backButton) {
        backButton.addEventListener("click", goBack);
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            saveSettings();
            if (window.SpaceStrikeControls) {
                window.SpaceStrikeControls.save(readControlsFromSliders());
            }
            goBack();
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            goBack();
        }
    });
}


/* ================================================================
   INIT
================================================================ */

function syncControlSliders() {
    const C = window.SpaceStrikeControls;
    if (!C) return;
    const cfg = C.load();
    const map = {
        joySize: ["joystickSize", "joySizeVal", "px"],
        joyLeft: ["joystickLeft", "joyLeftVal", "px"],
        joyBottom: ["joystickBottom", "joyBottomVal", "px"],
        fireSize: ["fireSize", "fireSizeVal", "px"],
        fireRight: ["fireRight", "fireRightVal", "px"],
        fireBottom: ["fireBottom", "fireBottomVal", "px"],
        ctrlOpacity: ["opacity", "ctrlOpacityVal", "%"]
    };
    Object.keys(map).forEach(function (id) {
        const el = document.getElementById(id);
        const valEl = document.getElementById(map[id][1]);
        if (!el) return;
        let v = cfg[map[id][0]];
        if (id === "ctrlOpacity") {
            el.value = Math.round(v * 100);
            if (valEl) valEl.textContent = el.value + "%";
        } else {
            el.value = v;
            if (valEl) valEl.textContent = v + "px";
        }
    });
}

function readControlsFromSliders() {
    return {
        joystickSize: Number(document.getElementById("joySize").value),
        joystickLeft: Number(document.getElementById("joyLeft").value),
        joystickBottom: Number(document.getElementById("joyBottom").value),
        fireSize: Number(document.getElementById("fireSize").value),
        fireRight: Number(document.getElementById("fireRight").value),
        fireBottom: Number(document.getElementById("fireBottom").value),
        opacity: Number(document.getElementById("ctrlOpacity").value) / 100
    };
}

function bindControls() {
    const ids = ["joySize", "joyLeft", "joyBottom", "fireSize", "fireRight", "fireBottom", "ctrlOpacity"];
    ids.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", function () {
            const valEl = document.getElementById(id + "Val");
            if (id === "ctrlOpacity") {
                if (valEl) valEl.textContent = el.value + "%";
            } else if (valEl) {
                valEl.textContent = el.value + "px";
            }
        });
    });
    const resetBtn = document.getElementById("resetControlsButton");
    if (resetBtn && window.SpaceStrikeControls) {
        resetBtn.addEventListener("click", function () {
            window.SpaceStrikeControls.save(
                Object.assign({}, window.SpaceStrikeControls.defaults)
            );
            syncControlSliders();
        });
    }
}

function initializeSettings() {
    createStars();
    applyUI();
    syncControlSliders();
    bindToggles();
    bindDifficulty();
    bindControls();
    bindActions();

    let resizeTimer = null;
    window.addEventListener("resize", function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(createStars, 200);
    });
}


if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSettings);
} else {
    initializeSettings();
}


/* Fullscreen preference (global) */
(function () {
    function refreshFsBtn() {
        var b = document.getElementById("fullscreenSettingBtn");
        if (!b || !window.SpaceStrikeFullscreen) return;
        b.textContent = window.SpaceStrikeFullscreen.load() ? "ON" : "OFF";
    }
    document.addEventListener("DOMContentLoaded", function () {
        var b = document.getElementById("fullscreenSettingBtn");
        if (!b) return;
        refreshFsBtn();
        b.addEventListener("click", function () {
            if (window.SpaceStrikeFullscreen) {
                window.SpaceStrikeFullscreen.toggle();
                refreshFsBtn();
            }
        });
    });
})();


/* Graphics quality cycle */
(function () {
    var order = ["auto", "low", "medium", "high"];
    var labels = { auto: "AUTO", low: "BAJO", medium: "MEDIO", high: "ALTO" };
    function refresh() {
        var b = document.getElementById("graphicsQuality");
        if (!b || !window.SpaceStrikeGraphics) return;
        var v = SpaceStrikeGraphics.load();
        b.textContent = "GRÁFICOS: " + (labels[v] || v.toUpperCase());
    }
    document.addEventListener("DOMContentLoaded", function () {
        var b = document.getElementById("graphicsQuality");
        if (!b) return;
        refresh();
        b.addEventListener("click", function () {
            if (!window.SpaceStrikeGraphics) return;
            var v = SpaceStrikeGraphics.load();
            var i = order.indexOf(v);
            var next = order[(i + 1) % order.length];
            SpaceStrikeGraphics.save(next);
            refresh();
        });
    });
})();

(function(){
  var btn=document.getElementById("adsToggle");
  if(!btn)return;
  function ref(){
    var on=true;
    try{ if(window.SpaceStrikeAds) on=window.SpaceStrikeAds.adsEnabled(); }catch(e){}
    if(window.SpaceStrikeAds&&window.SpaceStrikeAds.isPremium&&window.SpaceStrikeAds.isPremium()){btn.textContent="PREMIUM OFF";btn.disabled=true;return;}
    btn.disabled=false;btn.textContent=on?"ON":"OFF";
  }
  btn.onclick=function(){
    var on=true; try{ on=window.SpaceStrikeAds.adsEnabled(); }catch(e){}
    if(window.SpaceStrikeAds) window.SpaceStrikeAds.setAdsEnabled(!on);
    if(confirm("Recargar para aplicar anuncios?")) location.reload();
    else ref();
  };
  ref();
})();
