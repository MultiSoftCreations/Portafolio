import os
import time
from collections import defaultdict
from core.protection import clasificar_ruta


EXTENSIONES = {
    "FOTOS": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".tiff"],
    "VIDEOS": [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    "AUDIO": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a"],
    "DOCUMENTOS": [".pdf", ".docx", ".doc", ".txt", ".xlsx", ".xls", ".pptx", ".odt"],
}

EXCLUSIONES = {
    "node_modules", ".cache", ".git", ".svn", "__pycache__",
    ".venv", "venv", "env", ".local", ".npm", ".cargo",
    ".rustup", "snap", ".Trash", "lost+found",
}


def _esta_excluido(ruta: str) -> bool:
    partes = ruta.split(os.sep)
    return any(p in EXCLUSIONES for p in partes)


def obtener_categoria(archivo: str) -> str:
    ext = os.path.splitext(archivo)[1].lower()
    for categoria, exts in EXTENSIONES.items():
        if ext in exts:
            return categoria
    return "OTROS"


def detectar_apps_inactivas(ruta: str, dias: int = 30, limite: int = 50,
                            callback=None, cancel_flag=None):
    apps = []
    ahora = time.time()
    limite_segundos = dias * 86400
    procesados = 0

    for root, dirs, files in os.walk(ruta):
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            return apps[:limite]

        dirs[:] = [d for d in dirs if d not in EXCLUSIONES]
        if _esta_excluido(root):
            continue

        for f in files:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(f"CANCELADO|{procesados}")
                return apps[:limite]

            path = os.path.join(root, f)
            try:
                if not os.access(path, os.X_OK):
                    continue

                # No reportar ejecutables protegidos
                if clasificar_ruta(path) == "PROTEGIDA":
                    continue

                stat = os.stat(path)
                tiempo_sin_uso = ahora - stat.st_atime

                if tiempo_sin_uso > limite_segundos:
                    apps.append({
                        "ruta": path,
                        "tamano": stat.st_size,
                        "dias_sin_usar": int(tiempo_sin_uso / 86400),
                        "seguridad": clasificar_ruta(path)
                    })

                procesados += 1
                if callback and procesados % 300 == 0:
                    callback(f"PROGRESO|{procesados}|0")

            except (OSError, PermissionError):
                continue

    apps.sort(key=lambda x: x["tamano"], reverse=True)
    return apps[:limite]


def analisis_rapido(ruta: str, limite: int = 20, callback=None, cancel_flag=None):
    resultados = []
    procesados = 0

    try:
        items = os.listdir(ruta)
    except (OSError, PermissionError):
        return []

    total_carpetas = len([i for i in items if os.path.isdir(os.path.join(ruta, i))])
    carpetas_hechas = 0

    for item in items:
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            break

        path = os.path.join(ruta, item)

        if not os.path.isdir(path):
            continue
        if _esta_excluido(path) or item in EXCLUSIONES:
            continue

        # Saltar carpetas totalmente protegidas
        if clasificar_ruta(path) == "PROTEGIDA":
            continue

        total_size = 0
        conteo = defaultdict(int)
        archivos_validos = 0

        for root, dirs, files in os.walk(path):
            if cancel_flag and cancel_flag():
                if callback:
                    callback(f"CANCELADO|{procesados}")
                break

            dirs[:] = [d for d in dirs if d not in EXCLUSIONES]
            if _esta_excluido(root):
                continue

            for f in files:
                if cancel_flag and cancel_flag():
                    if callback:
                        callback(f"CANCELADO|{procesados}")
                    break

                if f.startswith("."):
                    continue

                try:
                    file_path = os.path.join(root, f)
                    size = os.path.getsize(file_path)
                    categoria = obtener_categoria(f)

                    conteo[categoria] += size
                    total_size += size
                    archivos_validos += 1
                    procesados += 1

                    if callback and procesados % 200 == 0:
                        porcentaje = (carpetas_hechas / max(total_carpetas, 1)) * 100
                        callback(f"PROGRESO|{procesados}|{porcentaje:.1f}")

                except (OSError, PermissionError):
                    continue

        if archivos_validos == 0:
            categoria_final = "VACÍAS"
        else:
            categoria_final = max(conteo, key=conteo.get)

        resultados.append({
            "ruta": path,
            "tamano": total_size,
            "categoria": categoria_final,
            "archivos": archivos_validos,
            "seguridad": clasificar_ruta(path)
        })

        carpetas_hechas += 1
        if callback:
            porcentaje = (carpetas_hechas / max(total_carpetas, 1)) * 100
            callback(f"PROGRESO|{procesados}|{porcentaje:.1f}")

    resultados.sort(key=lambda x: x["tamano"], reverse=True)
    return resultados[:limite]


def analisis_completo(ruta: str, limite: int = 100, callback=None, cancel_flag=None):
    resultados = []
    procesados = 0

    if callback:
        callback(">> Contando archivos...")

    total_estimado = 0
    for root, dirs, files in os.walk(ruta):
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            return []
        dirs[:] = [d for d in dirs if d not in EXCLUSIONES]
        if _esta_excluido(root):
            continue
        if clasificar_ruta(root) == "PROTEGIDA":
            continue
        total_estimado += len(files)

    if callback:
        callback(f">> Se estiman ~{total_estimado} archivos. Iniciando análisis...")

    for root, dirs, files in os.walk(ruta):
        if cancel_flag and cancel_flag():
            if callback:
                callback(f"CANCELADO|{procesados}")
            break

        dirs[:] = [d for d in dirs if d not in EXCLUSIONES]
        if _esta_excluido(root):
            continue

        # Saltar rutas protegidas del sistema
        if clasificar_ruta(root) == "PROTEGIDA":
            continue

        total_size = 0
        conteo = defaultdict(int)
        archivos_validos = 0

        for f in files:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(f"CANCELADO|{procesados}")
                break

            if f.startswith("."):
                continue

            try:
                path = os.path.join(root, f)
                size = os.path.getsize(path)
                categoria = obtener_categoria(f)

                conteo[categoria] += size
                total_size += size
                archivos_validos += 1
                procesados += 1

                if callback and procesados % 150 == 0:
                    porcentaje = (procesados / max(total_estimado, 1)) * 100
                    if porcentaje > 100:
                        porcentaje = 99.9
                    callback(f"PROGRESO|{procesados}|{porcentaje:.1f}")

            except (OSError, PermissionError):
                continue

        if archivos_validos == 0:
            categoria_final = "VACÍAS"
        else:
            categoria_final = max(conteo, key=conteo.get)

        if total_size > 0 or categoria_final == "VACÍAS":
            resultados.append({
                "ruta": root,
                "tamano": total_size,
                "categoria": categoria_final,
                "archivos": archivos_validos,
                "seguridad": clasificar_ruta(root)
            })

    resultados.sort(key=lambda x: x["tamano"], reverse=True)
    return resultados[:limite]