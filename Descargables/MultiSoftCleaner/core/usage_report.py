"""
Registro de uso para pruebas en otros equipos.
Genera data/informe_uso.json y un .txt exportable.
"""

import json
import platform
import sys
import traceback
from datetime import datetime
from pathlib import Path

from utils.helpers import asegurar_directorio, formatear_tamano

DATA_DIR = Path("data")
ARCHIVO_USO = DATA_DIR / "informe_uso.json"


def _ahora() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def _cargar() -> dict:
    asegurar_directorio(DATA_DIR)
    if not ARCHIVO_USO.exists():
        return {
            "meta": {
                "creado": _ahora(),
                "app": "MultiSoftCleaner",
                "version_app": "1.0-test",
            },
            "sistema": {},
            "eventos": [],
            "errores": [],
            "resumen": {
                "analisis_rapido": 0,
                "escaneo_completo": 0,
                "duplicados": 0,
                "archivos_grandes": 0,
                "carpetas_vacias": 0,
                "limpiezas": 0,
                "cancelaciones": 0,
                "errores": 0,
            },
        }
    try:
        with open(ARCHIVO_USO, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return _cargar.__wrapped__() if hasattr(_cargar, "__wrapped__") else {
            "meta": {"creado": _ahora(), "app": "MultiSoftCleaner", "version_app": "1.0-test"},
            "sistema": {},
            "eventos": [],
            "errores": [],
            "resumen": {},
        }


def _guardar(data: dict) -> None:
    asegurar_directorio(DATA_DIR)
    try:
        with open(ARCHIVO_USO, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[usage_report] No se pudo guardar: {e}")


def registrar_sistema():
    """Guarda info del equipo (una vez / se actualiza)."""
    data = _cargar()
    data["sistema"] = {
        "fecha_registro": _ahora(),
        "sistema_operativo": platform.system(),
        "version_os": platform.version(),
        "release": platform.release(),
        "arquitectura": platform.machine(),
        "procesador": platform.processor(),
        "python": sys.version.split()[0],
        "hostname": platform.node(),
        "plataforma": sys.platform,
    }
    _guardar(data)


def registrar_evento(accion: str, detalle: str = "", extra: dict | None = None):
    """
    Registra una acción de uso.
    accion: analisis_rapido, duplicados, limpieza, cancelar, error, etc.
    """
    data = _cargar()
    evento = {
        "fecha": _ahora(),
        "accion": accion,
        "detalle": detalle,
    }
    if extra:
        evento["extra"] = extra

    data["eventos"].append(evento)
    # limitar tamaño
    data["eventos"] = data["eventos"][-300:]

    resumen = data.setdefault("resumen", {})
    if accion in resumen:
        resumen[accion] = resumen.get(accion, 0) + 1
    elif accion.startswith("analisis"):
        resumen["analisis_rapido"] = resumen.get("analisis_rapido", 0) + (1 if "rapido" in accion else 0)
        resumen["escaneo_completo"] = resumen.get("escaneo_completo", 0) + (1 if "completo" in accion else 0)
    else:
        resumen[accion] = resumen.get(accion, 0) + 1

    _guardar(data)


def registrar_error(donde: str, error: Exception | str):
    data = _cargar()
    entrada = {
        "fecha": _ahora(),
        "donde": donde,
        "error": str(error),
        "traceback": traceback.format_exc() if isinstance(error, Exception) else "",
    }
    data.setdefault("errores", []).append(entrada)
    data["errores"] = data["errores"][-100:]
    data.setdefault("resumen", {})
    data["resumen"]["errores"] = data["resumen"].get("errores", 0) + 1
    _guardar(data)


def generar_informe_txt(ruta_destino: str | Path) -> str:
    """
    Genera un .txt legible para que te lo envíen.
    Devuelve la ruta del archivo creado.
    """
    data = _cargar()
    ruta_destino = Path(ruta_destino)

    lineas = []
    lineas.append("=" * 60)
    lineas.append("  MULTISOFTCLEANER - INFORME DE USO / PRUEBAS")
    lineas.append("=" * 60)
    lineas.append(f"Generado: {_ahora()}")
    lineas.append(f"App: {data.get('meta', {}).get('app', 'MultiSoftCleaner')}")
    lineas.append(f"Versión: {data.get('meta', {}).get('version_app', '?')}")
    lineas.append("")

    sis = data.get("sistema", {})
    lineas.append("--- SISTEMA ---")
    for k, v in sis.items():
        lineas.append(f"  {k}: {v}")
    lineas.append("")

    res = data.get("resumen", {})
    lineas.append("--- RESUMEN DE USO ---")
    if res:
        for k, v in res.items():
            lineas.append(f"  {k}: {v}")
    else:
        lineas.append("  (sin datos)")
    lineas.append("")

    lineas.append("--- ÚLTIMOS EVENTOS ---")
    eventos = data.get("eventos", [])[-50:]
    if not eventos:
        lineas.append("  (ninguno)")
    else:
        for e in eventos:
            extra = e.get("extra") or {}
            extra_str = ""
            if extra:
                partes = [f"{k}={v}" for k, v in extra.items()]
                extra_str = " | " + ", ".join(partes)
            lineas.append(
                f"  [{e.get('fecha')}] {e.get('accion')} — {e.get('detalle', '')}{extra_str}"
            )
    lineas.append("")

    lineas.append("--- ERRORES ---")
    errores = data.get("errores", [])[-20:]
    if not errores:
        lineas.append("  (ninguno)")
    else:
        for err in errores:
            lineas.append(f"  [{err.get('fecha')}] en {err.get('donde')}: {err.get('error')}")
            if err.get("traceback"):
                lineas.append("  --- traceback ---")
                for ln in err["traceback"].strip().splitlines()[-8:]:
                    lineas.append(f"    {ln}")
    lineas.append("")
    lineas.append("=" * 60)
    lineas.append("Fin del informe. Enviar este archivo al desarrollador.")
    lineas.append("=" * 60)

    texto = "\n".join(lineas)
    ruta_destino.write_text(texto, encoding="utf-8")
    return str(ruta_destino.resolve())


def ruta_json() -> str:
    return str(ARCHIVO_USO.resolve())