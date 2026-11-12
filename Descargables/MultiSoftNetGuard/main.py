#!/usr/bin/env python3
"""
MultiSoft NetGuard - Versión 1.0.0
Antivirus de red / Monitor de protección
MultiSoftCreations
"""

import sys
from pathlib import Path

# Asegurar que el paquete src esté en el path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.ui.cli import CLI


def main():
    # Puedes cambiar estos valores o dejarlos vacíos para configurar en runtime
    GITHUB_USER = "MultiSoftCreations"          # Ej: "tuusuario"
    GITHUB_REPO = "MultiSoftNetGuard"

    app = CLI(github_user=GITHUB_USER, github_repo=GITHUB_REPO)
    app.run()


if __name__ == "__main__":
    main()
