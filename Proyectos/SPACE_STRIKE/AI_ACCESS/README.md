# SPACE STRIKE — AI_ACCESS (modo revisión local)

Carpeta solo para que **asistentes de IA** (Grok, ChatGPT, Meta AI, etc.) y revisores abran el juego **sin cuenta de Google**.

## URL esperada (cuando esté en tu hosting)

```
https://multisoftcreations.com.mx/Proyectos/SPACE_STRIKE/AI_ACCESS/index.html
```

o la ruta equivalente en GitHub Pages / Netlify.

## Qué hace

| Aspecto              | Comportamiento |
|----------------------|----------------|
| Login Google         | Omitido (stub local) |
| Nombre de piloto     | Auto: `AI_REVIEWER` |
| Progreso / monedas   | Solo `localStorage` (no se sube a Firestore users) |
| Códigos VIP / rewards| Sí se validan en la nube (`usedBy: "local"`) |
| Ranking global       | Puede fallar o no escribir (no hay UID real) |
| Captchas / seguridad | Ninguno en esta entrada |

## Archivos de esta carpeta

- `index.html` — menú de entrada en modo IA (carga assets de `../`)
- `javascript/ai-bootstrap.js` — flag `SPACE_STRIKE_AI_MODE`, stub de auth, parches de `ensureGoogleAuth` / `ensurePilotRegistered` / `navigateTo`
- `README.md` — este archivo

**No modifica** el juego normal (`../index.html`). Los jugadores siguen obligados a Google.

## Notas para el dueño

1. Sube **solo** la carpeta `AI_ACCESS/` al repo (ver comandos Termux abajo).
2. Las reglas de Firestore de `premiumCodes` deben permitir lectura/escritura de canje sin auth de usuario (o con reglas que acepten `usedBy: "local"`). Si el canje falla sin login, revisa `firestore.rules`.
3. No enlaces esta carpeta de forma destacada en el portafolio público si no quieres que cualquiera entre sin cuenta; es un túnel de revisión.

## Probar en local

Sirve la carpeta padre `SPACE_STRIKE` con cualquier static server y abre `/AI_ACCESS/`.
