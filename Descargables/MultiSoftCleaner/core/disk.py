import shutil
from pathlib import Path


def obtener_espacio(ruta: str = "/"):
    """
    Devuelve el espacio de disco de la ruta indicada.

    Retorna un diccionario con:
    - total
    - usado
    - libre
    (todo en bytes)
    """
    try:
        path = Path(ruta).expanduser().resolve()

        if not path.exists():
            return {
                "total": 0,
                "usado": 0,
                "libre": 0
            }

        total, usado, libre = shutil.disk_usage(path)

        return {
            "total": total,
            "usado": usado,
            "libre": libre
        }

    except (OSError, PermissionError):
        return {
            "total": 0,
            "usado": 0,
            "libre": 0
        }