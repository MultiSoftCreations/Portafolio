"""
Mueve archivos/carpetas a la papelera del sistema (no borra permanente).
Linux: freedesktop Trash
Windows: Recycle Bin (send2trash o API)
"""

import os
import sys
import shutil
import time
from pathlib import Path
from core.protection import clasificar_ruta


def _trash_linux(path: str) -> None:
    path = Path(path).resolve()
    home = Path.home()
    trash = home / ".local/share/Trash"
    files_dir = trash / "files"
    info_dir = trash / "info"
    files_dir.mkdir(parents=True, exist_ok=True)
    info_dir.mkdir(parents=True, exist_ok=True)

    nombre = path.name
    destino = files_dir / nombre
    contador = 1
    while destino.exists():
        destino = files_dir / f"{path.stem}_{contador}{path.suffix}"
        contador += 1

    # .trashinfo
    info = info_dir / (destino.name + ".trashinfo")
    deletion_date = time.strftime("%Y-%m-%dT%H:%M:%S")
    contenido = (
        "[Trash Info]\n"
        f"Path={path.as_posix()}\n"
        f"DeletionDate={deletion_date}\n"
    )
    info.write_text(contenido, encoding="utf-8")

    shutil.move(str(path), str(destino))


def _trash_windows(path: str) -> None:
    try:
        from send2trash import send2trash
        send2trash(path)
        return
    except ImportError:
        pass

    # Fallback API shell
    import ctypes
    from ctypes import wintypes

    FO_DELETE = 3
    FOF_ALLOWUNDO = 0x40
    FOF_NOCONFIRMATION = 0x10

    class SHFILEOPSTRUCT(ctypes.Structure):
        _fields_ = [
            ("hwnd", wintypes.HWND),
            ("wFunc", wintypes.UINT),
            ("pFrom", wintypes.LPCWSTR),
            ("pTo", wintypes.LPCWSTR),
            ("fFlags", wintypes.WORD),
            ("fAnyOperationsAborted", wintypes.BOOL),
            ("hNameMappings", wintypes.LPVOID),
            ("lpszProgressTitle", wintypes.LPCWSTR),
        ]

    op = SHFILEOPSTRUCT()
    op.hwnd = None
    op.wFunc = FO_DELETE
    op.pFrom = path + "\0\0"
    op.pTo = None
    op.fFlags = FOF_ALLOWUNDO | FOF_NOCONFIRMATION
    res = ctypes.windll.shell32.SHFileOperationW(ctypes.byref(op))
    if res != 0:
        raise OSError(f"SHFileOperation falló con código {res}")


def mover_a_papelera(path: str) -> bool:
    """
    Mueve a papelera. Solo rutas SEGURAS.
    Devuelve True si tuvo éxito.
    """
    clase = clasificar_ruta(path)
    if clase == "PROTEGIDA":
        raise PermissionError(f"Ruta protegida: {path}")
    if clase == "ESPECIAL":
        raise PermissionError(f"Ruta especial (requiere confirmación extra): {path}")

    if not os.path.exists(path):
        raise FileNotFoundError(path)

    if sys.platform.startswith("win"):
        _trash_windows(path)
    else:
        _trash_linux(path)
    return True