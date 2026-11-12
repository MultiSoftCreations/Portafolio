"""
Evita que la pantalla se suspenda / bloquee mientras MultiSoftCleaner trabaja.
Soporta Linux (DBus / xset) y Windows.
"""

import sys
import subprocess
import atexit


class KeepAwake:
    def __init__(self):
        self._activo = False
        self._cookie = None
        self._bus = None
        self._proxy = None
        self._es_windows = sys.platform.startswith("win")

    def activar(self):
        if self._activo:
            return

        try:
            if self._es_windows:
                self._activar_windows()
            else:
                self._activar_linux()
            self._activo = True
        except Exception as e:
            print(f"[keepawake] No se pudo inhibir suspensión: {e}")

    def desactivar(self):
        if not self._activo:
            return

        try:
            if self._es_windows:
                self._desactivar_windows()
            else:
                self._desactivar_linux()
        except Exception as e:
            print(f"[keepawake] Error al restaurar: {e}")
        finally:
            self._activo = False
            self._cookie = None

    # -------------------- Windows --------------------
    def _activar_windows(self):
        import ctypes
        # ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_DISPLAY_REQUIRED
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000002 | 0x00000001 | 0x00000002)

    def _desactivar_windows(self):
        import ctypes
        ctypes.windll.kernel32.SetThreadExecutionState(0x80000000)

    # -------------------- Linux --------------------
    def _activar_linux(self):
        # 1) Intentar por DBus (Gnome, KDE, etc.)
        try:
            import dbus
            self._bus = dbus.SessionBus()
            self._proxy = self._bus.get_object(
                "org.freedesktop.ScreenSaver",
                "/org/freedesktop/ScreenSaver"
            )
            iface = dbus.Interface(self._proxy, "org.freedesktop.ScreenSaver")
            self._cookie = iface.Inhibit("MultiSoftCleaner", "Análisis en curso")
            return
        except Exception:
            pass

        # 2) Fallback: xset (X11)
        try:
            subprocess.run(["xset", "s", "off"], check=False, capture_output=True)
            subprocess.run(["xset", "-dpms"], check=False, capture_output=True)
            self._cookie = "xset"
            return
        except Exception:
            pass

        # 3) Último recurso: systemd-inhibit en background (solo si está)
        try:
            subprocess.Popen(
                ["systemd-inhibit", "--what=idle:sleep", "--who=MultiSoftCleaner",
                 "--why=Análisis en curso", "sleep", "infinity"],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            self._cookie = "systemd"
        except Exception:
            pass

    def _desactivar_linux(self):
        if self._cookie and not isinstance(self._cookie, str):
            # DBus cookie
            try:
                iface = self._bus.get_object(
                    "org.freedesktop.ScreenSaver",
                    "/org/freedesktop/ScreenSaver"
                )
                iface = dbus.Interface(iface, "org.freedesktop.ScreenSaver")
                iface.UnInhibit(self._cookie)
            except Exception:
                pass
        elif self._cookie == "xset":
            try:
                subprocess.run(["xset", "s", "on"], check=False, capture_output=True)
                subprocess.run(["xset", "+dpms"], check=False, capture_output=True)
            except Exception:
                pass
        # systemd-inhibit se libera solo al terminar el proceso sleep


# Instancia global
keep = KeepAwake()
atexit.register(keep.desactivar)