import os
import sys
import logging
import subprocess
from pathlib import Path
from datetime import datetime


logging.basicConfig(level=logging.INFO, format="[%(levelname)s] %(message)s")
logger = logging.getLogger("MultiSoftCleaner")


EXCLUSIONES = {
    "node_modules", ".cache", ".git", ".svn", "__pycache__",
    ".venv", "venv", "env", ".local", ".npm", ".cargo",
    ".rustup", "snap", ".Trash", "lost+found",
}


def esta_excluido(ruta: str) -> bool:
    partes = Path(ruta).parts
    return any(p in EXCLUSIONES for p in partes)


def filtrar_directorios(dirs: list) -> None:
    dirs[:] = [d for d in dirs if d not in EXCLUSIONES]


def formatear_tamano(bytes_size: int | float) -> str:
    try:
        bytes_size = float(bytes_size)
    except (TypeError, ValueError):
        return "0 B"

    if bytes_size < 0:
        bytes_size = 0

    unidades = ["B", "KB", "MB", "GB", "TB"]
    unidad = 0
    while bytes_size >= 1024 and unidad < len(unidades) - 1:
        bytes_size /= 1024
        unidad += 1

    if unidad == 0:
        return f"{int(bytes_size)} {unidades[unidad]}"
    return f"{bytes_size:.2f} {unidades[unidad]}"


def ruta_valida(ruta: str) -> bool:
    try:
        path = Path(ruta).expanduser().resolve()
        return path.exists() and os.access(path, os.R_OK)
    except (OSError, RuntimeError):
        return False


def normalizar_ruta(ruta: str) -> str:
    try:
        return str(Path(ruta).expanduser().resolve())
    except (OSError, RuntimeError):
        return ruta


def asegurar_directorio(ruta: str | Path) -> bool:
    try:
        Path(ruta).mkdir(parents=True, exist_ok=True)
        return True
    except OSError as e:
        logger.error(f"No se pudo crear el directorio {ruta}: {e}")
        return False


def timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def notificar(titulo: str, mensaje: str):
    """Notificación de escritorio (Linux notify-send / Windows toast básico)."""
    try:
        if sys.platform.startswith("win"):
            try:
                from win10toast import ToastNotifier
                ToastNotifier().show_toast(titulo, mensaje, duration=5, threaded=True)
            except Exception:
                pass
        else:
            subprocess.run(
                ["notify-send", "-a", "MultiSoftCleaner", titulo, mensaje],
                capture_output=True, check=False
            )
    except Exception:
        pass