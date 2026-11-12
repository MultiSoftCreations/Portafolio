import os
import hashlib
from collections import defaultdict


# Carpetas que se ignoran completamente
EXCLUSIONES = {
    "node_modules",
    ".cache",
    ".git",
    ".svn",
    "__pycache__",
    ".venv",
    "venv",
    "env",
    ".local",
    ".npm",
    ".cargo",
    ".rustup",
    "snap",
}


MIN_SIZE = 1 * 1024 * 1024  # 1 MB (ignorar archivos muy pequeños)


def _esta_excluido(ruta: str) -> bool:
    """Devuelve True si la ruta contiene alguna carpeta excluida."""
    partes = ruta.split(os.sep)
    return any(p in EXCLUSIONES for p in partes)


def hash_archivo(path: str, bloque: int = 65536) -> str:
    """Hash MD5 completo del archivo."""
    hasher = hashlib.md5()
    with open(path, "rb") as f:
        while chunk := f.read(bloque):
            hasher.update(chunk)
    return hasher.hexdigest()


def hash_parcial(path: str, tamaño: int = 4096) -> bytes:
    """Lee solo los primeros bytes del archivo."""
    with open(path, "rb") as f:
        return f.read(tamaño)


def buscar_duplicados(ruta: str, callback=None, cancel_flag=None):
    """
    Busca archivos duplicados en 3 fases:
    1. Agrupar por tamaño
    2. Filtrar por hash parcial
    3. Confirmar con hash completo
    """
    if callback:
        callback(">> Fase 1/3: Contando y agrupando por tamaño...")

    # =========================
    # FASE 1: Agrupar por tamaño
    # =========================
    tamaños = defaultdict(list)
    total_archivos = 0
    procesados = 0

    for root, dirs, files in os.walk(ruta):
        if cancel_flag and cancel_flag():
            if callback:
                callback(">> Cancelado por el usuario.")
            return {}

        # Evitar entrar en carpetas excluidas
        dirs[:] = [d for d in dirs if d not in EXCLUSIONES]

        if _esta_excluido(root):
            continue

        for f in files:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(">> Cancelado por el usuario.")
                return {}

            path = os.path.join(root, f)

            try:
                size = os.path.getsize(path)

                if size < MIN_SIZE:
                    continue

                tamaños[size].append(path)
                total_archivos += 1

            except (OSError, PermissionError):
                continue

    # Solo nos interesan tamaños con más de 1 archivo
    candidatos_tamaño = {
        size: paths for size, paths in tamaños.items() if len(paths) > 1
    }

    if callback:
        callback(f">> Fase 1 terminada. {len(candidatos_tamaño)} grupos por tamaño.")

    # =========================
    # FASE 2: Hash parcial
    # =========================
    if callback:
        callback(">> Fase 2/3: Filtrando por hash parcial...")

    candidatos = defaultdict(list)
    procesados = 0
    total_fase2 = sum(len(v) for v in candidatos_tamaño.values())

    for size, archivos in candidatos_tamaño.items():
        if cancel_flag and cancel_flag():
            if callback:
                callback(">> Cancelado por el usuario.")
            return {}

        parciales = defaultdict(list)

        for path in archivos:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(">> Cancelado por el usuario.")
                return {}

            try:
                h = hash_parcial(path)
                parciales[h].append(path)
            except (OSError, PermissionError):
                continue

            procesados += 1
            if callback and procesados % 100 == 0 and total_fase2 > 0:
                porcentaje = (procesados / total_fase2) * 100
                callback(f">> Progreso: {porcentaje:.1f}%")

        for h, lista in parciales.items():
            if len(lista) > 1:
                candidatos[size].extend(lista)

    if callback:
        callback(f">> Fase 2 terminada. {len(candidatos)} grupos candidatos.")

    # =========================
    # FASE 3: Hash completo
    # =========================
    if callback:
        callback(">> Fase 3/3: Comparando archivos completos...")

    duplicados = {}
    procesados = 0
    total_fase3 = sum(len(v) for v in candidatos.values())

    for size, archivos in candidatos.items():
        if cancel_flag and cancel_flag():
            if callback:
                callback(">> Cancelado por el usuario.")
            return {}

        hashes = defaultdict(list)

        for path in archivos:
            if cancel_flag and cancel_flag():
                if callback:
                    callback(">> Cancelado por el usuario.")
                return {}

            try:
                h = hash_archivo(path)
                hashes[h].append(path)
            except (OSError, PermissionError):
                continue

            procesados += 1
            if callback and procesados % 50 == 0 and total_fase3 > 0:
                porcentaje = (procesados / total_fase3) * 100
                callback(f">> Progreso: {porcentaje:.1f}%")

        for h, lista in hashes.items():
            if len(lista) > 1:
                duplicados[h] = lista

    if callback:
        callback(">> Proceso terminado.")
        callback(f">> Se encontraron {len(duplicados)} grupos de duplicados.")

    return duplicados