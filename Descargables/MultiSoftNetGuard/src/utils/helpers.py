"""
Utilidades generales - MultiSoft NetGuard
"""

import os
import sys
import platform
from pathlib import Path

APP_NAME = "MultiSoft NetGuard"
APP_VERSION = "1.0.0"
BRAND = "MultiSoftCreations"

def get_base_path() -> Path:
    """Obtiene la ruta base de la aplicación."""
    if getattr(sys, 'frozen', False):
        return Path(sys.executable).parent
    return Path(__file__).resolve().parent.parent.parent

def is_termux() -> bool:
    """Detecta si se está ejecutando en Termux."""
    return "com.termux" in os.environ.get("PREFIX", "") or "TERMUX_VERSION" in os.environ

def get_os_info() -> dict:
    """Información del sistema operativo."""
    return {
        "system": platform.system(),
        "release": platform.release(),
        "machine": platform.machine(),
        "python": platform.python_version(),
        "is_termux": is_termux(),
    }

def format_bytes(size: int) -> str:
    """Formatea bytes a unidad legible."""
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if size < 1024:
            return f"{size:.2f} {unit}"
        size /= 1024
    return f"{size:.2f} PB"

def clear_screen():
    """Limpia la pantalla (compatible Termux/Linux/Windows)."""
    os.system("cls" if os.name == "nt" else "clear")
