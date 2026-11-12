"""
Interfaz de línea de comandos - MultiSoft NetGuard
Compatible con Termux
"""

import sys
import time
from typing import Optional

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.layout import Layout
from rich.live import Live
from rich.text import Text
from rich.prompt import Prompt, Confirm
from rich import box

from src.utils.helpers import APP_NAME, APP_VERSION, BRAND, clear_screen, get_os_info, format_bytes
from src.core.scanner import PortScanner
from src.core.monitor import TrafficMonitor
from src.core.updater import Updater


console = Console()


class CLI:
    def __init__(self, github_user: str = "", github_repo: str = "MultiSoftNetGuard"):
        self.scanner = PortScanner()
        self.monitor = TrafficMonitor(scan_interval=4.0)
        self.updater = Updater(github_user=github_user, github_repo=github_repo)
        self.is_premium = False  # Free por defecto
        self._running = True

    def show_banner(self):
        banner = f"""
[bold green]╔══════════════════════════════════════════════════════════╗
║                                                          ║
║          [bold white]MULTISOFT NETGUARD[/] [dim]v{APP_VERSION}[/]                 ║
║                                                          ║
║          [cyan]{BRAND}[/]                            ║
║          Software • Solutions • Innovation               ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝[/]
"""
        console.print(banner)

    def show_main_menu(self):
        edition = "[bold yellow]PREMIUM[/]" if self.is_premium else "[bold blue]FREE[/]"
        console.print(Panel(
            f"[bold]Menú Principal[/]  |  Edición: {edition}\n\n"
            "[1]  Ver puertos abiertos\n"
            "[2]  Ver conexiones activas\n"
            "[3]  Detectar actividad inusual\n"
            "[4]  Iniciar monitoreo en vivo\n"
            "[5]  Detener monitoreo\n"
            "[6]  Ver alertas recientes\n"
            "[7]  Cerrar proceso / puerto\n"
            "[8]  Verificar actualizaciones\n"
            "[9]  Información del sistema\n"
            "[0]  Salir",
            title=f"[green]{APP_NAME}[/]",
            border_style="green",
        ))

    def list_open_ports(self):
        ports = self.scanner.get_open_ports()
        table = Table(title="Puertos Abiertos (LISTEN)", box=box.ROUNDED, border_style="cyan")
        table.add_column("Puerto", style="bold")
        table.add_column("Protocolo")
        table.add_column("Proceso")
        table.add_column("PID")

        if not ports:
            console.print("[yellow]No se encontraron puertos en escucha o se requieren permisos elevados.[/]")
            return

        for p in ports:
            style = "red" if p.port in self.scanner.suspicious_ports else "white"
            table.add_row(
                str(p.port),
                p.protocol,
                p.process_name or "-",
                str(p.pid) if p.pid else "-",
                style=style,
            )
        console.print(table)

    def list_connections(self):
        conns = self.scanner.get_active_connections()
        table = Table(title="Conexiones Activas", box=box.ROUNDED, border_style="cyan", show_lines=False)
        table.add_column("PID", width=7)
        table.add_column("Proceso", max_width=20)
        table.add_column("Local", max_width=22)
        table.add_column("Remoto", max_width=22)
        table.add_column("Estado")
        table.add_column("Tipo")

        if not conns:
            console.print("[yellow]No se encontraron conexiones o se requieren permisos elevados.[/]")
            return

        for c in conns[:50]:  # limitar para no saturar
            local = f"{c.local_address}:{c.local_port}"
            remote = f"{c.remote_address}:{c.remote_port}" if c.remote_address != "-" else "-"
            table.add_row(
                str(c.pid),
                c.process_name[:20],
                local,
                remote,
                c.status,
                c.type,
            )
        console.print(table)
        if len(conns) > 50:
            console.print(f"[dim]... y {len(conns)-50} más[/]")

    def detect_unusual(self):
        unusual = self.scanner.detect_unusual_activity()
        if not unusual:
            console.print("[green]✓ No se detectó actividad inusual en este momento.[/]")
            return

        console.print(f"[bold red]⚠ Se detectaron {len(unusual)} posibles actividades inusuales:[/]\n")
        for i, item in enumerate(unusual, 1):
            c = item["connection"]
            console.print(Panel(
                f"[bold]Proceso:[/] {c.process_name} (PID {c.pid})\n"
                f"[bold]Local:[/] {c.local_address}:{c.local_port}\n"
                f"[bold]Remoto:[/] {c.remote_address}:{c.remote_port}\n"
                f"[bold]Estado:[/] {c.status}\n"
                f"[bold]Razones:[/] {', '.join(item['reasons'])}",
                title=f"Alerta #{i}",
                border_style="red",
            ))

    def start_monitor(self):
        def on_alert(alert):
            console.print(
                f"\n[bold red]⚠ ALERTA[/] [{alert['timestamp']}] "
                f"Proceso: [yellow]{alert['process']}[/] (PID {alert['pid']}) → "
                f"{alert['remote']} | {', '.join(alert['reasons'])}"
            )

        self.monitor.add_alert_callback(on_alert)
        self.monitor.start()
        console.print("[green]✓ Monitoreo iniciado en segundo plano.[/]")
        console.print("[dim]Presiona Enter para volver al menú (el monitoreo continúa)...[/]")
        input()

    def stop_monitor(self):
        self.monitor.stop()
        console.print("[yellow]Monitoreo detenido.[/]")

    def show_alerts(self):
        alerts = self.monitor.get_alerts()
        if not alerts:
            console.print("[green]No hay alertas registradas.[/]")
            return
        for a in alerts[-20:]:
            console.print(
                f"[{a['timestamp']}] [red]{a['process']}[/] (PID {a['pid']}) "
                f"{a['local']} → {a['remote']} | {', '.join(a['reasons'])}"
            )

    def kill_process_menu(self):
        pid_str = Prompt.ask("Ingresa el PID del proceso a cerrar")
        try:
            pid = int(pid_str)
        except ValueError:
            console.print("[red]PID inválido.[/]")
            return

        if Confirm.ask(f"¿Seguro que deseas terminar el proceso {pid}?"):
            if self.scanner.kill_process(pid):
                console.print(f"[green]✓ Proceso {pid} terminado.[/]")
            else:
                console.print(f"[red]No se pudo terminar el proceso {pid}. Puede requerir permisos elevados (root).[/]")

    def check_updates(self):
        if not self.updater.github_user:
            console.print("[yellow]No se ha configurado el repositorio de GitHub.[/]")
            user = Prompt.ask("Usuario de GitHub", default="")
            repo = Prompt.ask("Nombre del repositorio", default="MultiSoftNetGuard")
            if user:
                self.updater.set_repo(user, repo)
            else:
                return

        console.print("[cyan]Verificando actualizaciones...[/]")
        if not self.updater.is_online():
            console.print("[yellow]Sin conexión a internet. La aplicación funciona offline.[/]")
            return

        has_update, remote_ver = self.updater.check_for_updates()
        if has_update:
            console.print(f"[bold green]¡Nueva versión disponible: {remote_ver}![/] (actual: {APP_VERSION})")
            if Confirm.ask("¿Deseas actualizar ahora?"):
                def progress(msg):
                    console.print(f"[cyan]{msg}[/]")
                success = self.updater.download_and_apply(progress)
                if success:
                    console.print("[bold green]Actualización completada. Reinicia la aplicación.[/]")
                else:
                    console.print("[red]Error al aplicar la actualización.[/]")
        else:
            if remote_ver:
                console.print(f"[green]✓ Ya tienes la última versión ({APP_VERSION}).[/]")
            else:
                console.print("[yellow]No se pudo verificar la versión remota.[/]")

    def show_system_info(self):
        info = get_os_info()
        snap = self.monitor.get_snapshot()
        console.print(Panel(
            f"[bold]Sistema:[/] {info['system']} {info['release']}\n"
            f"[bold]Arquitectura:[/] {info['machine']}\n"
            f"[bold]Python:[/] {info['python']}\n"
            f"[bold]Termux:[/] {'Sí' if info['is_termux'] else 'No'}\n"
            f"[bold]Versión App:[/] {APP_VERSION}\n"
            f"[bold]Edición:[/] {'Premium' if self.is_premium else 'Free'}\n"
            f"[bold]Conexiones actuales:[/] {snap['total_connections']}\n"
            f"[bold]Puertos abiertos:[/] {snap['open_ports']}\n"
            f"[bold]Actividad inusual:[/] {snap['unusual_count']}",
            title="Información del Sistema",
            border_style="blue",
        ))

    def run(self):
        clear_screen()
        self.show_banner()
        console.print(f"[dim]Edición Free | Funciona offline | Actualizaciones vía GitHub[/]\n")

        while self._running:
            self.show_main_menu()
            choice = Prompt.ask("Selecciona una opción", choices=[str(i) for i in range(10)], default="0")

            clear_screen()
            self.show_banner()

            if choice == "1":
                self.list_open_ports()
            elif choice == "2":
                self.list_connections()
            elif choice == "3":
                self.detect_unusual()
            elif choice == "4":
                self.start_monitor()
            elif choice == "5":
                self.stop_monitor()
            elif choice == "6":
                self.show_alerts()
            elif choice == "7":
                self.kill_process_menu()
            elif choice == "8":
                self.check_updates()
            elif choice == "9":
                self.show_system_info()
            elif choice == "0":
                self.monitor.stop()
                console.print("[cyan]¡Hasta luego! MultiSoftCreations[/]")
                self._running = False

            if self._running and choice != "4":
                console.print()
                Prompt.ask("[dim]Presiona Enter para continuar[/]", default="")
                clear_screen()
                self.show_banner()
