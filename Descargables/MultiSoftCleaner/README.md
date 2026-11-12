# MultiSoftCleaner v2.1.1 (Free)

**MultiSoftCreations** — Software · Solutions · Innovation

Limpiador de disco para Windows/Linux: analiza espacio, encuentra duplicados y archivos grandes, limpia basura y genera informes.

## Versiones

| Edición | Límites |
|---------|---------|
| **Free** | Hasta 30 archivos grandes, 40 grupos de duplicados, sin export HTML ni filtros avanzados |
| **Pro**  | Límites ampliados, export HTML, filtros avanzados, historial completo |

## Requisitos

- Python 3.10+
- Windows 10/11 o Linux

```bash
pip install -r requirements.txt
python main.py
```

## Estructura

```
MultiSoftCleaner/
├── main.py
├── requirements.txt
├── core/          # Análisis, limpieza, disco, duplicados
├── ui/            # Interfaz (Tkinter)
├── utils/
├── assets/
└── data/          # Config e historial local (no se sube)
```

## Build Windows (GitHub Actions)

Hay workflow en `.github/workflows/build-windows.yml` que genera `MultiSoftCleaner.exe` con PyInstaller.

## Licencia

MultiSoftCreations © 2026 — Todos los derechos reservados.
