import os
import sys
from pathlib import Path


# =========================================================
# RUTAS TOTALMENTE PROTEGIDAS (nunca tocar)
# =========================================================
PROTEGIDAS_LINUX = [
    "/bin", "/sbin", "/usr", "/lib", "/lib64",
    "/etc", "/boot", "/dev", "/proc", "/sys",
    "/run", "/snap", "/var/lib", "/var/run",
    "/var/log", "/root", "/opt",
]

PROTEGIDAS_WINDOWS = [
    r"C:\Windows",
    r"C:\Program Files",
    r"C:\Program Files (x86)",
    r"C:\ProgramData",
    r"C:\System Volume Information",
    r"C:\Recovery",
    r"C:\$Recycle.Bin",
    r"C:\Boot",
    r"C:\EFI",
]

# Carpetas críticas del usuario (ambos sistemas)
PROTEGIDAS_HOME = [
    ".ssh",
    ".gnupg",
    ".config/systemd",
    ".local/share/keyrings",
    ".local/share/Trash",
    "AppData/Roaming",
    "AppData/Local/Microsoft",
    "NTUSER.DAT",
    "ntuser.dat.LOG1",
    "ntuser.dat.LOG2",
]


# =========================================================
# RUTAS / PATRONES "ESPECIALES" (duda 50/50)
# =========================================================
# Se pueden listar, pero el usuario debe tener mucho cuidado
ESPECIALES_PATRONES = [
    ".config",
    ".local",
    ".cache",          # a veces se puede borrar, a veces no
    "AppData",
    "Application Data",
    "Library",         # macOS / algunos linux
    "ProgramData",
    "node_modules",    # se puede regenerar, pero es pesado
    ".npm",
    ".cargo",
    ".rustup",
    ".venv",
    "venv",
    "__pycache__",
    ".git",
]


def _es_windows() -> bool:
    return sys.platform.startswith("win")


def _normalizar(ruta: str) -> str:
    try:
        return str(Path(ruta).expanduser().resolve())
    except (OSError, RuntimeError):
        return os.path.abspath(os.path.expanduser(ruta))


def clasificar_ruta(ruta: str) -> str:
    """
    Clasifica una ruta en:
    - "PROTEGIDA"  → nunca tocar
    - "ESPECIAL"   → mostrar con advertencia (50/50)
    - "SEGURA"     → se puede trabajar con ella
    """
    path = _normalizar(ruta)
    path_lower = path.lower()

    # ---------- PROTEGIDAS ----------
    protegidas = PROTEGIDAS_WINDOWS if _es_windows() else PROTEGIDAS_LINUX

    for p in protegidas:
        p_norm = _normalizar(p)
        if path == p_norm or path.startswith(p_norm + os.sep):
            return "PROTEGIDA"

    # Home críticos
    home = _normalizar("~")
    for item in PROTEGIDAS_HOME:
        critico = os.path.join(home, item)
        critico = _normalizar(critico)
        if path == critico or path.startswith(critico + os.sep):
            return "PROTEGIDA"

    # Evitar tocar el propio sistema de archivos raíz en Windows
    if _es_windows():
        if path_lower.startswith(r"c:\windows") or "system32" in path_lower:
            return "PROTEGIDA"

    # ---------- ESPECIALES (duda) ----------
    for patron in ESPECIALES_PATRONES:
        if patron.lower() in path_lower:
            return "ESPECIAL"

    # Ejecutables en el home también se consideran especiales
    try:
        if os.path.isfile(path) and os.access(path, os.X_OK):
            # Si está fuera de carpetas de usuario típicas de datos
            return "ESPECIAL"
    except OSError:
        pass

    return "SEGURA"


def es_protegida(ruta: str) -> bool:
    return clasificar_ruta(ruta) == "PROTEGIDA"


def es_especial(ruta: str) -> bool:
    return clasificar_ruta(ruta) == "ESPECIAL"


def es_segura(ruta: str) -> bool:
    return clasificar_ruta(ruta) == "SEGURA"


def filtrar_por_seguridad(lista_rutas: list, incluir_especiales: bool = True):
    """
    Separa una lista de rutas en tres grupos.
    """
    protegidas = []
    especiales = []
    seguras = []

    for item in lista_rutas:
        # Soporta tanto strings como diccionarios con clave "ruta"
        ruta = item["ruta"] if isinstance(item, dict) else item
        clase = clasificar_ruta(ruta)

        if clase == "PROTEGIDA":
            protegidas.append(item)
        elif clase == "ESPECIAL":
            if incluir_especiales:
                especiales.append(item)
        else:
            seguras.append(item)

    return {
        "protegidas": protegidas,
        "especiales": especiales,
        "seguras": seguras
    }