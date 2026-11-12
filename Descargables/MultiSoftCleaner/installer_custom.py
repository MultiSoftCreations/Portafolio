#!/usr/bin/env python3
"""
Instalador personalizado MultiSoftCleaner
Misma paleta que el programa principal.
"""

import os
import sys
import shutil
import stat
import tkinter as tk
from tkinter import filedialog, messagebox
from pathlib import Path

# ---- Colores MSC ----
BG = "#0b0f14"
PANEL = "#12181f"
CARD = "#1a222d"
NEON = "#00e5ff"
TEXT = "#e8eef5"
DIM = "#8b9bb4"
BTN = "#1e2833"
OK = "#39ff14"
ERR = "#ff4d6d"

APP_NAME = "MultiSoftCleaner"
VERSION = "1.0.0"

# Archivos/carpetas a copiar (relativos a la raíz del proyecto)
COPIAR = [
    "main.py",
    "core",
    "ui",
    "utils",
    "assets",
    "requirements.txt",
]


def raiz_proyecto() -> Path:
    return Path(__file__).resolve().parent


def destino_default() -> Path:
    home = Path.home()
    if sys.platform.startswith("win"):
        base = Path(os.environ.get("LOCALAPPDATA", home / "AppData" / "Local"))
        return base / APP_NAME
    return home / ".local" / "share" / APP_NAME


class Instalador(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(f"Instalar {APP_NAME}")
        self.geometry("560x420")
        self.configure(bg=BG)
        self.resizable(False, False)

        self.ruta_destino = tk.StringVar(value=str(destino_default()))
        self.crear_acceso = tk.BooleanVar(value=True)

        self._ui()

    def _ui(self):
        # Cabecera
        top = tk.Frame(self, bg=PANEL, height=70)
        top.pack(fill="x")
        top.pack_propagate(False)
        tk.Label(
            top, text="MSC", bg=PANEL, fg=NEON,
            font=("Consolas", 22, "bold")
        ).pack(side="left", padx=20, pady=15)
        tk.Label(
            top, text=f"Instalador  ·  v{VERSION}", bg=PANEL, fg=DIM,
            font=("Consolas", 10)
        ).pack(side="left", pady=20)

        body = tk.Frame(self, bg=BG)
        body.pack(fill="both", expand=True, padx=24, pady=18)

        tk.Label(
            body, text="MultiSoftCleaner", bg=BG, fg=TEXT,
            font=("Consolas", 14, "bold")
        ).pack(anchor="w")
        tk.Label(
            body,
            text="Análisis y limpieza segura de espacio en disco.",
            bg=BG, fg=DIM, font=("Consolas", 9)
        ).pack(anchor="w", pady=(2, 14))

        # Carpeta destino
        tk.Label(
            body, text="Carpeta de instalación", bg=BG, fg=DIM,
            font=("Consolas", 9)
        ).pack(anchor="w")

        row = tk.Frame(body, bg=BG)
        row.pack(fill="x", pady=6)
        entry = tk.Entry(
            row, textvariable=self.ruta_destino, bg=CARD, fg=TEXT,
            insertbackground=NEON, relief="flat", font=("Consolas", 10)
        )
        entry.pack(side="left", fill="x", expand=True, ipady=6, padx=(0, 8))
        tk.Button(
            row, text="Examinar", command=self._examinar,
            bg=BTN, fg=TEXT, activebackground=NEON, activeforeground="#000",
            relief="flat", font=("Consolas", 9), cursor="hand2", padx=12
        ).pack(side="right")

        tk.Checkbutton(
            body,
            text="Crear acceso directo / lanzador",
            variable=self.crear_acceso,
            bg=BG, fg=TEXT, selectcolor=CARD,
            activebackground=BG, activeforeground=NEON,
            font=("Consolas", 9)
        ).pack(anchor="w", pady=10)

        self.log = tk.Text(
            body, height=8, bg="#070b10", fg=NEON,
            font=("Consolas", 9), relief="flat", state="disabled"
        )
        self.log.pack(fill="both", expand=True, pady=(8, 12))

        btns = tk.Frame(body, bg=BG)
        btns.pack(fill="x")
        tk.Button(
            btns, text="Cancelar", command=self.destroy,
            bg=BTN, fg=DIM, relief="flat", font=("Consolas", 10),
            cursor="hand2", padx=16, pady=6
        ).pack(side="left")
        tk.Button(
            btns, text="Instalar", command=self._instalar,
            bg=NEON, fg="#000", relief="flat", font=("Consolas", 10, "bold"),
            cursor="hand2", padx=20, pady=6
        ).pack(side="right")

    def _escribir(self, msg: str):
        self.log.configure(state="normal")
        self.log.insert("end", msg + "\n")
        self.log.see("end")
        self.log.configure(state="disabled")
        self.update_idletasks()

    def _examinar(self):
        d = filedialog.askdirectory(initialdir=self.ruta_destino.get())
        if d:
            self.ruta_destino.set(d)

    def _instalar(self):
        origen = raiz_proyecto()
        destino = Path(self.ruta_destino.get()).expanduser()

        try:
            destino.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo crear la carpeta:\n{e}")
            return

        self._escribir(f">> Instalando en: {destino}")

        try:
            for nombre in COPIAR:
                src = origen / nombre
                dst = destino / nombre
                if not src.exists():
                    self._escribir(f"  (omitido, no existe) {nombre}")
                    continue
                if src.is_dir():
                    if dst.exists():
                        shutil.rmtree(dst)
                    shutil.copytree(src, dst)
                    self._escribir(f"  + carpeta {nombre}/")
                else:
                    shutil.copy2(src, dst)
                    self._escribir(f"  + {nombre}")

            # Carpeta data vacía
            (destino / "data").mkdir(exist_ok=True)
            self._escribir("  + data/")

            # Lanzador
            if sys.platform.startswith("win"):
                self._lanzador_windows(destino)
            else:
                self._lanzador_linux(destino)

            self._escribir("")
            self._escribir(">> Instalación completada.")
            messagebox.showinfo(
                "Listo",
                f"{APP_NAME} se instaló correctamente en:\n{destino}"
            )
        except Exception as e:
            self._escribir(f"ERROR: {e}")
            messagebox.showerror("Error", str(e))

    def _lanzador_linux(self, destino: Path):
        # Script ejecutable
        run = destino / "MultiSoftCleaner.sh"
        run.write_text(
            f"""#!/usr/bin/env bash
cd "{destino}"
if [ -d .venv ]; then
  source .venv/bin/activate
fi
exec python3 main.py "$@"
""",
            encoding="utf-8",
        )
        run.chmod(run.stat().st_mode | stat.S_IEXEC)
        self._escribir("  + MultiSoftCleaner.sh")

        if not self.crear_acceso.get():
            return

        apps = Path.home() / ".local" / "share" / "applications"
        apps.mkdir(parents=True, exist_ok=True)
        desktop = apps / "multisofcleaner.desktop"
        icon = destino / "assets" / "icon.ico"
        icon_line = f"Icon={icon}" if icon.exists() else "Icon=utilities-system-monitor"
        desktop.write_text(
            f"""[Desktop Entry]
Type=Application
Name=MultiSoftCleaner
Comment=Análisis y limpieza segura de disco
Exec={run}
{icon_line}
Terminal=false
Categories=Utility;System;
""",
            encoding="utf-8",
        )
        self._escribir("  + acceso en el menú de aplicaciones")

    def _lanzador_windows(self, destino: Path):
        bat = destino / "MultiSoftCleaner.bat"
        bat.write_text(
            f"""@echo off
cd /d "{destino}"
python main.py
if errorlevel 1 py main.py
pause
""",
            encoding="utf-8",
        )
        self._escribir("  + MultiSoftCleaner.bat")

        if self.crear_acceso.get():
            self._escribir("  (En Windows: crea un acceso directo al .bat o al .exe)")


if __name__ == "__main__":
    app = Instalador()
    app.mainloop()