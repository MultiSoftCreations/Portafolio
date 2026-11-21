# CODEVERSE — CODEVERSE LIVE

Plataforma educativa CODEVERSE con editor LIVE para HTML, CSS, JavaScript y Python.

## Páginas

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Landing |
| `academy.html` | Academia |
| `live.html` | Editor CODEVERSE LIVE |
| `community.html` | Comunidad |
| `dashboard.html` | Dashboard |
| `privacidad.html` | Aviso de Privacidad |
| `terminos.html` | Términos de Uso |

## CODEVERSE LIVE

- Editor CodeMirror 6 para HTML, CSS, JavaScript y Python.
- Vista previa HTML/CSS/JavaScript en iframe aislado (`sandbox="allow-scripts"`).
- Consola con captura de `console.log`, advertencias y errores.
- Ejecución de Python en el navegador mediante Pyodide (WebAssembly).
- Guardado local en el navegador (`localStorage`).
- Descarga del proyecto como un archivo HTML independiente (para proyectos web).
- Compartir el código mediante el menú nativo del dispositivo o portapapeles.
- Restauración del ejemplo inicial y tema claro/oscuro.
- Atajo `Ctrl+Enter` / `Cmd+Enter` para ejecutar y `Ctrl+S` / `Cmd+S` para guardar.

## Cómo probar LIVE

Usa un servidor local (no abras el archivo con `file://`):

```bash
cd CODEVERSE_LIVE
python3 -m http.server 8080
```

Abre `http://localhost:8080/live.html`.

## Dependencias externas

CodeMirror 6, sus paquetes de lenguaje y Pyodide se cargan desde CDN. Por tanto, se necesita conexión a internet. La primera ejecución de Python puede tardar porque descarga el runtime de Pyodide.

## Límites actuales

- El guardado se almacena en el navegador y dispositivo actuales; no sincroniza entre cuentas ni dispositivos.
- La descarga genera un HTML combinado para proyectos web. El código Python se puede ejecutar en LIVE, pero no se empaqueta dentro de ese HTML descargado.
- Python corre en el navegador mediante WebAssembly; no es un servidor Python ni tiene acceso directo al sistema de archivos del dispositivo.
- Paso a paso, variables, cursos y comunidad siguen fuera del alcance de esta versión si no están implementados en sus respectivas páginas.

**Marca:** MultiSoftCreations.
