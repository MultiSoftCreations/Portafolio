"""
Monitor de tráfico y actividad - MultiSoft NetGuard
"""

import time
import threading
from typing import List, Dict, Callable, Optional
from datetime import datetime
from collections import defaultdict

from src.core.scanner import PortScanner, ConnectionInfo


class TrafficMonitor:
    """
    Monitorea continuamente el tráfico de red y detecta actividad inusual.
    Funciona offline.
    """

    def __init__(self, scan_interval: float = 5.0):
        self.scanner = PortScanner()
        self.scan_interval = scan_interval
        self._running = False
        self._thread: Optional[threading.Thread] = None
        self._alerts: List[Dict] = []
        self._callbacks: List[Callable] = []
        self._history: Dict[str, int] = defaultdict(int)  # process -> connection count

    def add_alert_callback(self, callback: Callable):
        """Registra un callback que se llama cuando hay una alerta."""
        self._callbacks.append(callback)

    def start(self):
        """Inicia el monitoreo en segundo plano."""
        if self._running:
            return
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        """Detiene el monitoreo."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=2)

    def _loop(self):
        while self._running:
            try:
                unusual = self.scanner.detect_unusual_activity()
                for item in unusual:
                    alert = {
                        "type": "unusual_traffic",
                        "timestamp": datetime.now().isoformat(),
                        "process": item["connection"].process_name,
                        "pid": item["connection"].pid,
                        "local": f"{item['connection'].local_address}:{item['connection'].local_port}",
                        "remote": f"{item['connection'].remote_address}:{item['connection'].remote_port}",
                        "reasons": item["reasons"],
                        "status": item["connection"].status,
                    }
                    self._alerts.append(alert)
                    for cb in self._callbacks:
                        try:
                            cb(alert)
                        except Exception:
                            pass
            except Exception:
                pass
            time.sleep(self.scan_interval)

    def get_alerts(self, limit: int = 50) -> List[Dict]:
        """Devuelve las últimas alertas."""
        return self._alerts[-limit:]

    def clear_alerts(self):
        self._alerts.clear()

    def get_snapshot(self) -> Dict:
        """Obtiene un snapshot actual del estado de la red."""
        connections = self.scanner.get_active_connections()
        ports = self.scanner.get_open_ports()
        unusual = self.scanner.detect_unusual_activity()

        # Contar por proceso
        by_process = defaultdict(int)
        for c in connections:
            by_process[c.process_name] += 1

        return {
            "timestamp": datetime.now().isoformat(),
            "total_connections": len(connections),
            "open_ports": len(ports),
            "unusual_count": len(unusual),
            "connections": connections,
            "ports": ports,
            "unusual": unusual,
            "by_process": dict(by_process),
        }
