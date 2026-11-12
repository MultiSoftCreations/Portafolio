# Jarvis Vortex — Acceso restringido

Este repositorio / despliegue permanece en **acceso restringido** hasta que se actualice el backend en Render (o el host definitivo) y se configuren:

1. Variables de entorno reales (GROQ_API_KEYS, DATABASE_URL, SECRET_KEY, Firebase).
2. Dominios autorizados en Firebase.
3. URL del backend en `static/config.js` (si el frontend va aparte).

## No publicar todavía

- No abrir el Space/Render a público sin rate-limit y auth.
- No dejar `DEBUG=true` en producción.
- Las claves van **solo** en secrets del host (nunca en el código).

## Marca

Ricardo Torres · **MultiSoftCreations**
