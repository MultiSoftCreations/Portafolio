"""
Sistema de actualizaciones desde GitHub - MultiSoft NetGuard
"""

import os
import sys
import shutil
import tempfile
import zipfile
from pathlib import Path
from typing import Optional, Tuple

try:
    import requests
except ImportError:
    requests = None

from src.utils.helpers import get_base_path, APP_VERSION


class Updater:
    """
    Verifica y descarga actualizaciones desde un repositorio de GitHub.
    
    El repositorio debe tener un archivo VERSION en la raíz con el número
    de versión (ej: 1.0.1).
    """

    def __init__(self, github_user: str = "", github_repo: str = "MultiSoftNetGuard", branch: str = "main"):
        self.github_user = github_user
        self.github_repo = github_repo
        self.branch = branch
        self.base_path = get_base_path()
        self.current_version = APP_VERSION

    def set_repo(self, user: str, repo: str, branch: str = "main"):
        """Configura el repositorio de GitHub."""
        self.github_user = user
        self.github_repo = repo
        self.branch = branch

    @property
    def version_url(self) -> str:
        return f"https://raw.githubusercontent.com/{self.github_user}/{self.github_repo}/{self.branch}/VERSION"

    @property
    def zip_url(self) -> str:
        return f"https://github.com/{self.github_user}/{self.github_repo}/archive/refs/heads/{self.branch}.zip"

    def check_for_updates(self, timeout: int = 10) -> Tuple[bool, Optional[str]]:
        """
        Comprueba si hay una versión más nueva.
        Retorna (hay_actualizacion, nueva_version)
        """
        if not self.github_user:
            return False, None

        if requests is None:
            return False, None

        try:
            resp = requests.get(self.version_url, timeout=timeout)
            if resp.status_code != 200:
                return False, None

            remote_version = resp.text.strip()
            if self._is_newer(remote_version, self.current_version):
                return True, remote_version
            return False, remote_version
        except Exception:
            return False, None

    def _is_newer(self, remote: str, local: str) -> bool:
        """Compara versiones semánticas simples (x.y.z)."""
        try:
            r_parts = [int(x) for x in remote.split(".")]
            l_parts = [int(x) for x in local.split(".")]
            # Rellenar a 3 partes
            while len(r_parts) < 3:
                r_parts.append(0)
            while len(l_parts) < 3:
                l_parts.append(0)
            return r_parts > l_parts
        except ValueError:
            return remote != local

    def download_and_apply(self, progress_callback=None) -> bool:
        """
        Descarga el ZIP del repositorio y reemplaza los archivos.
        Retorna True si tuvo éxito.
        """
        if not self.github_user or requests is None:
            return False

        try:
            if progress_callback:
                progress_callback("Descargando actualización...")

            resp = requests.get(self.zip_url, stream=True, timeout=60)
            if resp.status_code != 200:
                return False

            with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp:
                for chunk in resp.iter_content(chunk_size=8192):
                    tmp.write(chunk)
                tmp_path = tmp.name

            if progress_callback:
                progress_callback("Extrayendo archivos...")

            with tempfile.TemporaryDirectory() as tmpdir:
                with zipfile.ZipFile(tmp_path, "r") as zf:
                    zf.extractall(tmpdir)

                # El ZIP de GitHub crea una carpeta repo-branch/
                extracted = list(Path(tmpdir).iterdir())
                if not extracted:
                    return False

                source_dir = extracted[0]

                # Copiar archivos (excepto .git y cosas temporales)
                for item in source_dir.rglob("*"):
                    if item.is_file():
                        rel = item.relative_to(source_dir)
                        if any(part.startswith(".") for part in rel.parts):
                            continue  # saltar archivos ocultos/.git
                        dest = self.base_path / rel
                        dest.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(item, dest)

            os.unlink(tmp_path)

            if progress_callback:
                progress_callback("Actualización aplicada correctamente.")

            return True
        except Exception as e:
            if progress_callback:
                progress_callback(f"Error: {e}")
            return False

    def is_online(self, timeout: int = 5) -> bool:
        """Comprueba si hay conexión a internet."""
        if requests is None:
            return False
        try:
            requests.get("https://github.com", timeout=timeout)
            return True
        except Exception:
            return False
