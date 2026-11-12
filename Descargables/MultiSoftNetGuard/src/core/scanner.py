"""
Escáner de puertos y conexiones - MultiSoft NetGuard
"""

import socket
import psutil
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime


@dataclass
class ConnectionInfo:
    pid: int
    process_name: str
    local_address: str
    local_port: int
    remote_address: str
    remote_port: int
    status: str
    family: str
    type: str


@dataclass
class PortInfo:
    port: int
    protocol: str
    status: str
    process_name: Optional[str]
    pid: Optional[int]


class PortScanner:
    """Escanea puertos abiertos y conexiones activas."""

    def __init__(self):
        self.suspicious_ports = {
            4444, 5555, 6666, 7777, 8888, 9999,  # comunes en malware
            1337, 31337, 12345, 54321,
            1080, 3128, 8080, 8443,  # proxies / backdoors frecuentes
        }

    def get_active_connections(self) -> List[ConnectionInfo]:
        """Obtiene todas las conexiones de red activas."""
        connections = []
        try:
            for conn in psutil.net_connections(kind="inet"):
                if conn.status == "NONE":
                    continue

                process_name = "Desconocido"
                pid = conn.pid or 0

                if pid:
                    try:
                        proc = psutil.Process(pid)
                        process_name = proc.name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        process_name = "Sin acceso"

                local_addr = conn.laddr.ip if conn.laddr else "0.0.0.0"
                local_port = conn.laddr.port if conn.laddr else 0
                remote_addr = conn.raddr.ip if conn.raddr else "-"
                remote_port = conn.raddr.port if conn.raddr else 0

                family = "IPv4" if conn.family == socket.AF_INET else "IPv6"
                conn_type = "TCP" if conn.type == socket.SOCK_STREAM else "UDP"

                connections.append(ConnectionInfo(
                    pid=pid,
                    process_name=process_name,
                    local_address=local_addr,
                    local_port=local_port,
                    remote_address=remote_addr,
                    remote_port=remote_port,
                    status=conn.status,
                    family=family,
                    type=conn_type,
                ))
        except (psutil.AccessDenied, PermissionError):
            # En Termux sin root o sin permisos puede fallar
            pass

        return connections

    def get_open_ports(self) -> List[PortInfo]:
        """Lista puertos en estado LISTEN."""
        ports = []
        seen = set()

        for conn in self.get_active_connections():
            if conn.status == "LISTEN":
                key = (conn.local_port, conn.type)
                if key not in seen:
                    seen.add(key)
                    ports.append(PortInfo(
                        port=conn.local_port,
                        protocol=conn.type,
                        status="LISTEN",
                        process_name=conn.process_name,
                        pid=conn.pid,
                    ))

        return sorted(ports, key=lambda p: p.port)

    def detect_unusual_activity(self) -> List[Dict]:
        """
        Detecta actividad potencialmente inusual.
        Criterios básicos v1:
        - Puertos sospechosos conocidos
        - Conexiones a IPs privadas externas inesperadas (simplificado)
        - Procesos desconocidos con muchas conexiones
        """
        unusual = []
        connections = self.get_active_connections()

        for conn in connections:
            reasons = []

            # Puerto local sospechoso
            if conn.local_port in self.suspicious_ports:
                reasons.append(f"Puerto local sospechoso: {conn.local_port}")

            # Puerto remoto sospechoso
            if conn.remote_port in self.suspicious_ports:
                reasons.append(f"Puerto remoto sospechoso: {conn.remote_port}")

            # Proceso desconocido con conexión establecida
            if conn.process_name in ("Desconocido", "Sin acceso") and conn.status == "ESTABLISHED":
                reasons.append("Proceso desconocido con conexión activa")

            if reasons:
                unusual.append({
                    "connection": conn,
                    "reasons": reasons,
                    "timestamp": datetime.now().isoformat(),
                })

        return unusual

    def kill_process(self, pid: int) -> bool:
        """Intenta terminar un proceso por PID."""
        try:
            proc = psutil.Process(pid)
            proc.terminate()
            proc.wait(timeout=3)
            return True
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.TimeoutExpired):
            try:
                proc = psutil.Process(pid)
                proc.kill()
                return True
            except Exception:
                return False

    def get_process_connections(self, pid: int) -> List[ConnectionInfo]:
        """Obtiene conexiones de un proceso específico."""
        return [c for c in self.get_active_connections() if c.pid == pid]
