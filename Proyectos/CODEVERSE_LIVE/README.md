# CODEVERSE — Base + LIVE v1.3

Plataforma educativa CODEVERSE con editor LIVE funcional.

## Páginas

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Landing |
| `academy.html` | Academia |
| `live.html` | **CODEVERSE LIVE** (editor real) |
| `community.html` | Comunidad |
| `dashboard.html` | Dashboard |
| `privacidad.html` | Aviso de Privacidad |
| `terminos.html` | Términos de Uso |

## CODEVERSE LIVE V1

- Editor CodeMirror 6 (HTML / CSS / JavaScript)
- Pestañas por lenguaje
- Vista previa en iframe sandbox (`allow-scripts`)
- Consola con captura de `console.log` / errores
- Botón Ejecutar + atajo **Ctrl+Enter**
- Tema oscuro integrado

### Cómo probar LIVE

```bash
cd codeverse
python3 -m http.server 8080
```

Abre http://localhost:8080/live.html

> Importante: usa un servidor local (no `file://`). CodeMirror se carga por CDN.

## Próximos pasos

1. Guardado de proyectos (localStorage → luego Supabase)
2. Motor Python (Pyodide)
3. Panel de archivos / multi-archivo
4. Autenticación

---

**Documento de referencia:** CODEVERSE_Planos_Tecnicos_v1.pdf  
**Marca:** MultiSoftCreations · Ricardo Torres  
**Fecha:** 8 de noviembre de 2026
