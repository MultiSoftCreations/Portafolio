import os
from utils.helpers import esta_excluido, filtrar_directorios


def escanear_directorio(ruta: str, callback=None):
    """
    Recorre un directorio y calcula:
    - Número total de archivos
    - Tamaño total en bytes

    callback(archivos, tamaño) se llama periódicamente si se proporciona.
    """
    total_archivos = 0
    total_size = 0

    try:
        for root, dirs, files in os.walk(ruta):
            # Evitar carpetas excluidas
            filtrar_directorios(dirs)

            if esta_excluido(root):
                continue

            for file in files:
                try:
                    path = os.path.join(root, file)
                    size = os.path.getsize(path)

                    total_archivos += 1
                    total_size += size

                    # Avisar cada 200 archivos para no saturar
                    if callback and total_archivos % 200 == 0:
                        callback(total_archivos, total_size)

                except (OSError, PermissionError):
                    continue

    except (OSError, PermissionError) as e:
        if callback:
            callback(total_archivos, total_size)
        # Devolvemos lo que se haya podido calcular
        return total_archivos, total_size

    if callback:
        callback(total_archivos, total_size)

    return total_archivos, total_size