# MultiSoft NetGuard v1.0.0

**MultiSoftCreations** - Software • Solutions • Innovation

## Descripción

**MultiSoft NetGuard** es un sistema de protección de red (antivirus de red) que actúa como respaldo para el usuario común. Monitorea puertos abiertos, analiza el tráfico entrante/saliente en busca de actividad inusual y notifica al usuario qué aplicación está generando tráfico sospechoso.

### Versiones
- **Free**: Monitoreo de puertos, detección de tráfico inusual, notificaciones, capacidad de cerrar puertos/procesos y visualizar datos enviados/recibidos.
- **Premium** (próximamente completo en v1.x): Filtrado de posible malware/virus entrante + filtrado de información saliente para evitar fugas.

### Características principales v1
- Funciona **sin internet** (modo offline completo).
- Sistema de **actualizaciones automáticas** desde GitHub (compara archivo VERSION).
- Detección de puertos abiertos y conexiones activas.
- Identificación de procesos responsables del tráfico.
- Notificaciones de actividad inusual.
- Cierre de puertos/procesos sospechosos.
- Interfaz de línea de comandos moderna (compatible con Termux).

## Instalación (Termux / Linux)

```bash
pkg update && pkg upgrade
pkg install python git
pip install -r requirements.txt
python main.py
```

## Actualizaciones

La aplicación se conecta al repositorio de GitHub para verificar el archivo `VERSION`.  
Si detecta una versión superior, descarga e instala la actualización automáticamente.

## Estructura del proyecto

```
MultiSoftNetGuard/
├── VERSION
├── main.py
├── requirements.txt
├── README.md
├── assets/
│   └── logo.png
├── src/
│   ├── __init__.py
│   ├── core/
│   │   ├── monitor.py
│   │   ├── updater.py
│   │   └── scanner.py
│   ├── ui/
│   │   └── cli.py
│   └── utils/
│       └── helpers.py
└── docs/
```

## Licencia
MultiSoftCreations © 2026 - Todos los derechos reservados.

---

## Repositorio oficial

Actualizaciones y releases: **https://github.com/MultiSoftCreations/MultiSoftNetGuard**

Si instalaste desde la cuenta personal antigua (`RicardoT005`), cambia el usuario de actualización en la app o reinstala desde el repo de la organización.
