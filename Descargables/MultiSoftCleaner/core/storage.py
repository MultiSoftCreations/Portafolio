import json
from pathlib import Path
from utils.helpers import timestamp, asegurar_directorio


DATA_DIR = Path("data")
ARCHIVO_ANALISIS = DATA_DIR / "analisis.json"
ARCHIVO_HISTORIAL = DATA_DIR / "historial.json"


def guardar_analisis(data, limite: int = 200):
    try:
        asegurar_directorio(DATA_DIR)
        if isinstance(data, list) and len(data) > limite:
            data = data[:limite]
        with open(ARCHIVO_ANALISIS, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except (OSError, TypeError, ValueError) as e:
        print(f"[storage] Error al guardar análisis: {e}")
        return False


def cargar_analisis():
    try:
        if not ARCHIVO_ANALISIS.exists():
            return None
        with open(ARCHIVO_ANALISIS, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError, ValueError) as e:
        print(f"[storage] Error al cargar análisis: {e}")
        return None


def eliminar_analisis():
    try:
        if ARCHIVO_ANALISIS.exists():
            ARCHIVO_ANALISIS.unlink()
            return True
        return False
    except OSError as e:
        print(f"[storage] Error al eliminar análisis: {e}")
        return False


def existe_analisis() -> bool:
    return ARCHIVO_ANALISIS.exists()


def agregar_historial(entrada: dict):
    """
    entrada ejemplo:
    {
        "fecha": "...",
        "accion": "duplicados" | "limpieza" | "analisis",
        "detalle": "...",
        "archivos": 12,
        "tamano": 123456
    }
    """
    try:
        asegurar_directorio(DATA_DIR)
        historial = []
        if ARCHIVO_HISTORIAL.exists():
            with open(ARCHIVO_HISTORIAL, "r", encoding="utf-8") as f:
                historial = json.load(f)

        entrada["fecha"] = entrada.get("fecha", timestamp())
        historial.insert(0, entrada)
        historial = historial[:100]  # máximo 100 entradas

        with open(ARCHIVO_HISTORIAL, "w", encoding="utf-8") as f:
            json.dump(historial, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"[storage] Error historial: {e}")
        return False


def cargar_historial():
    try:
        if not ARCHIVO_HISTORIAL.exists():
            return []
        with open(ARCHIVO_HISTORIAL, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []