# Mi Portafolio — Ricardo Torres × MultiSoftCreations

Sitio web profesional para presentar proyectos, servicios y contacto.

**Lema:** «Si puedes imaginarlo, puedes programarlo».

Repositorio: https://github.com/ (MultiSoftCreations)

---

## Estructura

```
mi_portafolio/
├── index.html              # Página de inicio
├── css/
│   ├── styles.css
│   ├── projects.css
│   └── responsive.css
├── javascript/
│   ├── main.js
│   ├── projects.js         # Carga automática de proyectos desde JSON
│   ├── contact.js
│   └── firebase.js         # Placeholder para fase Firebase
├── html/
│   ├── proyectos.html      # Catálogo de proyectos
│   ├── contacto.html
│   ├── privacidad.html
│   ├── terminos.html
│   └── proyectos/
│       ├── space-strike/
│       ├── jarvis-vortex/
│       ├── multisoft-cleaner/
│       ├── msc-streammonitor/
│       └── multisoft-auditor/
├── data/
│   ├── projects.json       # Índice de proyectos
│   └── services.json
├── assets/
└── documents/
```

---

## Cómo añadir un proyecto

1. Crea la carpeta: `html/proyectos/nombre-del-proyecto/`
2. Añade `project.json` (copia de otro como plantilla)
3. Añade imágenes en `img/` dentro de esa carpeta
4. Opcional: crea `index.html` de detalle
5. Añade la ruta del `project.json` en `data/projects.json`
6. Publica los cambios

### Ejemplo de `project.json`

```json
{
  "id": "mi-proyecto",
  "name": "Nombre del proyecto",
  "brand": "MultiSoftCreations",
  "category": "Utilidades",
  "status": "development",
  "visibility": "public",
  "featured": false,
  "description": "Descripción honesta.",
  "image": "img/portada.webp",
  "technologies": ["HTML5", "JavaScript"],
  "links": {
    "demo": "",
    "repository": ""
  },
  "release": {
    "type": "public",
    "label": "Ver demo"
  }
}
```

**Importante:** Si `demo` o `repository` están vacíos (`""`), **no** se muestra el botón. No inventes enlaces.

### Estados recomendados

| Valor           | Etiqueta mostrada    |
|-----------------|----------------------|
| `released`      | Disponible           |
| `early_access`  | Acceso anticipado    |
| `demo`          | Demostración         |
| `development`   | En desarrollo        |
| `private`       | (no aparece)         |

---

## Publicación en GitHub Pages

1. Sube el contenido a la rama `main` (o `gh-pages`).
2. En el repositorio: **Settings → Pages**.
3. Source: Deploy from a branch → `main` → `/` (root).
4. Espera unos minutos y abre `https://multisoftcreations.com.mx/`

**Nota:** Los `fetch()` de JSON requieren que el sitio se sirva por HTTP(S). No abras `index.html` con `file://`.

Para probar en local:

```bash
# Desde la carpeta del proyecto
python3 -m http.server 8080
# Abre http://localhost:8080
```

---

## Contacto

- WhatsApp Business: [wa.me/525624944382](https://wa.me/525624944382)
- Mensaje sugerido ya está configurado en los botones del sitio.

---

## Principios

- Honestidad en estados y enlaces.
- Campos vacíos = no disponibles (no se muestran botones rotos).
- Un JSON defectuoso no rompe el catálogo completo.
- Diseño mobile-first, accesible y mantenible.
- Sin secretos en archivos públicos.

---

## Fases siguientes (opcionales)

1. Completar descripciones, imágenes y enlaces reales.
2. Añadir currículum PDF en `documents/`.
3. Configurar Firebase (auth + Firestore + reglas) solo cuando la seguridad esté lista.
4. Formulario de contacto seguro.
5. Páginas de detalle más ricas por proyecto.
