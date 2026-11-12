import json
from pathlib import Path
from utils.helpers import asegurar_directorio

DATA_DIR = Path("data")
CONFIG_FILE = DATA_DIR / "config.json"

DEFAULTS = {
    "ultima_ruta": "",
    "tema": "dark",
    "version": "free",          # "free" | "pro"
    "licencia": "",
    "espacio_antes": 0,
    "notificaciones": True,
}


def cargar_config() -> dict:
    asegurar_directorio(DATA_DIR)
    if not CONFIG_FILE.exists():
        guardar_config(DEFAULTS.copy())
        return DEFAULTS.copy()
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        cfg = DEFAULTS.copy()
        cfg.update(data)
        return cfg
    except Exception:
        return DEFAULTS.copy()


def guardar_config(cfg: dict) -> bool:
    try:
        asegurar_directorio(DATA_DIR)
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False


def es_pro() -> bool:
    return cargar_config().get("version") == "pro"


# Límites Free vs Pro (para monetizar)
LIMITES_FREE = {
    "max_archivos_grandes": 30,
    "max_duplicados_grupos": 40,
    "exportar_html": False,
    "filtros_avanzados": False,
    "incluir_especiales_borrado": False,
    "historial_completo": False,
}

LIMITES_PRO = {
    "max_archivos_grandes": 500,
    "max_duplicados_grupos": 9999,
    "exportar_html": True,
    "filtros_avanzados": True,
    "incluir_especiales_borrado": True,  # con confirmación extra
    "historial_completo": True,
}


def limites():
    return LIMITES_PRO if es_pro() else LIMITES_FREE