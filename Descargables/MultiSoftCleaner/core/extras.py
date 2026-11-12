import os
from collections import defaultdict
from core.protection import clasificar_ruta
from utils.helpers import esta_excluido, filtrar_directorios


def buscar_archivos_grandes(ruta: str, limite: int = 50, min_size: int = 50 * 1024 * 1024,
                            callback=None, cancel_flag=None):
    """
    Encuentra los archivos más pesados (por defecto >= 50 MB).
    """
    archivos = []
    procesados = 0

    for root, dirs, files in os.walk(ruta):
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            break

        filtrar_directorios(dirs)
        if esta_excluido(root) or clasificar_ruta(root) == "PROTEGIDA":
            continue

        for f in files:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(f"CANCELADO|{procesados}")
                return archivos[:limite]

            path = os.path.join(root, f)
            try:
                size = os.path.getsize(path)
                if size < min_size:
                    continue

                clase = clasificar_ruta(path)
                if clase == "PROTEGIDA":
                    continue

                archivos.append({
                    "ruta": path,
                    "tamano": size,
                    "seguridad": clase
                })
                procesados += 1

                if callback and procesados % 100 == 0:
                    callback(f"PROGRESO|{procesados}|0")

            except (OSError, PermissionError):
                continue

    archivos.sort(key=lambda x: x["tamano"], reverse=True)
    return archivos[:limite]


def buscar_carpetas_vacias(ruta: str, limite: int = 100,
                           callback=None, cancel_flag=None):
    """
    Encuentra carpetas vacías (sin archivos).
    """
    vacias = []
    procesados = 0

    for root, dirs, files in os.walk(ruta, topdown=False):
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            break

        filtrar_directorios(dirs)
        if esta_excluido(root) or clasificar_ruta(root) == "PROTEGIDA":
            continue

        try:
            # Está vacía si no tiene archivos ni subdirs (después del filtrado)
            if not files and not dirs:
                clase = clasificar_ruta(root)
                if clase != "PROTEGIDA":
                    vacias.append({
                        "ruta": root,
                        "tamano": 0,
                        "seguridad": clase
                    })
            procesados += 1
            if callback and procesados % 50 == 0:
                callback(f"PROGRESO|{procesados}|0")
        except (OSError, PermissionError):
            continue

    return vacias[:limite]