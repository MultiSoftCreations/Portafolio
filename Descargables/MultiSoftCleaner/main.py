#!/usr/bin/env python3
"""
MultiSoftCleaner - Punto de entrada
"""

import sys
from pathlib import Path

# Asegurar que la raíz del proyecto esté en el path
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def main():
    try:
        from ui.main_window import iniciar_app
        iniciar_app()
    except ImportError as e:
        print(f"Error de importación: {e}")
        print("Asegúrate de ejecutar este archivo desde la raíz del proyecto.")
        sys.exit(1)
    except Exception as e:
        print(f"Error al iniciar la aplicación: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()