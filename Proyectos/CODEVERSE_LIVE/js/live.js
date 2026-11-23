/**
 * CODEVERSE LIVE — editor HTML / CSS / JavaScript / Python
 * Vista previa aislada, consola, guardado local y descarga.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'codeverse_live_project_v2';
  const DEFAULTS = {
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Mi proyecto</title>
</head>
<body>
  <h1>Hola CODEVERSE</h1>
  <p>Edita el código y pulsa <strong>Ejecutar</strong>.</p>
  <button id="btn">Haz clic</button>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
  background: #0f0f14;
  color: #e8e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
  text-align: center;
  padding: 1rem;
}

h1 {
  color: #818cf8;
  margin-bottom: 0.5rem;
}

button {
  margin-top: 1.5rem;
  padding: 0.6rem 1.4rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #818cf8;
}`,
    js: `const btn = document.getElementById('btn');

if (btn) {
  btn.addEventListener('click', () => {
    console.log('Botón presionado');
    alert('CODEVERSE LIVE funciona');
  });
}

console.log('Proyecto cargado correctamente');`,
    python: `print("Hola CODEVERSE desde Python")

nombre = "estudiante"
print(f"Bienvenido, {nombre}")

for numero in range(1, 4):
    print("Vuelta:", numero)`
  };

  function start() {
    if (!window.CodeMirror) {
      window.setTimeout(start, 50);
      return;
    }
    init();
  }

  function init() {
    const CM = window.CodeMirror;
    const editorHost = document.getElementById('editor-host');
    const previewFrame = document.getElementById('preview-frame');
    const consoleEl = document.getElementById('console-output');
    const statusEl = document.getElementById('live-status');
    const btnRun = document.getElementById('btn-run');
    const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));
    if (!editorHost || !previewFrame) return;

    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (_) {}
    const state = {
      ...DEFAULTS,
      ...(saved && saved.files && typeof saved.files === 'object' ? saved.files : {}),
      activeTab: saved && saved.activeTab ? saved.activeTab : 'html'
    };
    if (!['html', 'css', 'js', 'python'].includes(state.activeTab)) state.activeTab = 'html';

    let view = null;
    let pythonLanguage = null;
    let pyodidePromise = null;

    const baseExtensions = [
      CM.basicSetup,
      CM.EditorView.updateListener.of((update) => {
        if (update.docChanged && view) state[state.activeTab] = update.state.doc.toString();
      }),
      CM.EditorView.theme({
        '&': { height: '100%', fontSize: '14px', backgroundColor: '#0d0d14' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { caretColor: '#818cf8', fontFamily: "'JetBrains Mono', ui-monospace, monospace" },
        '.cm-gutters': { backgroundColor: '#111118', color: '#6b6b7b', border: 'none' },
        '.cm-activeLineGutter': { backgroundColor: '#1a1a26' },
        '.cm-activeLine': { backgroundColor: 'rgba(99,102,241,0.08)' },
        '&.cm-focused .cm-cursor': { borderLeftColor: '#818cf8' },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': { backgroundColor: 'rgba(99,102,241,0.35)' }
      }, { dark: true })
    ];

    function setStatus(message) {
      if (statusEl) statusEl.textContent = message;
    }

    function syncEditor() {
      if (view) state[state.activeTab] = view.state.doc.toString();
    }

    function languageFor(tab) {
      if (tab === 'html') return CM.html();
      if (tab === 'css') return CM.css();
      if (tab === 'js') return CM.javascript();
      return pythonLanguage || [];
    }

    function createEditor(tab) {
      if (view) view.destroy();
      editorHost.innerHTML = '';
      view = new CM.EditorView({
        doc: state[tab] || '',
        extensions: [...baseExtensions, languageFor(tab)],
        parent: editorHost
      });
    }

    async function loadPythonLanguage() {
      if (pythonLanguage) return pythonLanguage;
      const module = await import('https://esm.sh/@codemirror/lang-python@6.2.1');
      pythonLanguage = module.python();
      return pythonLanguage;
    }

    async function selectTab(tab) {
      if (!['html', 'css', 'js', 'python'].includes(tab) || tab === state.activeTab) return;
      syncEditor();
      state.activeTab = tab;
      tabButtons.forEach((button) => {
        const active = button.dataset.tab === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      try {
        if (tab === 'python') await loadPythonLanguage();
        createEditor(tab);
        setStatus(tab === 'python' ? 'Python · Pyodide' : 'Listo');
      } catch (error) {
        createEditor(tab);
        setStatus('Python: resaltado no disponible');
        logToConsole('warn', ['No se pudo cargar el resaltado Python:', error.message]);
      }
    }

    tabButtons.forEach((button) => button.addEventListener('click', () => selectTab(button.dataset.tab)));

    function escapeHtml(value) {
      return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function logToConsole(type, args) {
      if (!consoleEl) return;
      const line = document.createElement('div');
      line.className = 'console-line console-' + type;
      const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const message = args.map((item) => {
        if (typeof item === 'string') return item;
        try { return JSON.stringify(item); } catch (_) { return String(item); }
      }).join(' ');
      line.innerHTML = '<span class="console-time">' + time + '</span> <span class="console-msg">' + escapeHtml(message) + '</span>';
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function clearConsole() {
      if (consoleEl) consoleEl.innerHTML = '';
      progressLineEl = null;
    }

    function consoleBridge() {
      return `<script>
(function () {
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (level) {
    var original = console[level];
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments).map(function (value) {
        try { return typeof value === 'object' ? JSON.stringify(value) : String(value); }
        catch (error) { return String(value); }
      });
      parent.postMessage({ source: 'codeverse-preview', type: 'console', level: level, args: args }, '*');
      if (original) original.apply(console, arguments);
    };
  });
  window.onerror = function (message, url, line) {
    parent.postMessage({ source: 'codeverse-preview', type: 'error', message: message + ' (línea ' + line + ')' }, '*');
  };
  parent.postMessage({ source: 'codeverse-preview', type: 'ready' }, '*');
})();
<\/script>`;
    }

    function buildSrcdoc() {
      syncEditor();
      let html = state.html || '';
      const cssBlock = '<style>\n' + (state.css || '') + '\n</style>';
      if (/<\/head\s*>/i.test(html)) {
        html = html.replace(/<\/head\s*>/i, cssBlock + '\n</head>');
      } else {
        html = cssBlock + '\n' + html;
      }

      const jsBlock = consoleBridge() + '\n<script>\n' + (state.js || '') + '\n<\/script>';
      if (/<\/body\s*>/i.test(html)) {
        html = html.replace(/<\/body\s*>/i, jsBlock + '\n</body>');
      } else {
        html += '\n' + jsBlock;
      }
      return html;
    }

    function runWebProject() {
      previewFrame.srcdoc = buildSrcdoc();
      setStatus('Ejecutando vista previa…');
    }

    const PYODIDE_VERSION = '0.27.7';
    const PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v' + PYODIDE_VERSION + '/full/';
    const PYODIDE_CACHE = 'codeverse-pyodide-v' + PYODIDE_VERSION;
    let progressLineEl = null;
    let progressStartedAt = 0;

    function formatEta(seconds) {
      if (!isFinite(seconds) || seconds < 0) return 'calculando…';
      if (seconds < 5) return 'unos segundos';
      if (seconds < 60) return 'aprox. ' + Math.ceil(seconds) + ' s';
      const m = Math.floor(seconds / 60);
      const s = Math.ceil(seconds % 60);
      return 'aprox. ' + m + ' min ' + s + ' s';
    }

    function ensureProgressLine() {
      if (!consoleEl) return null;
      if (progressLineEl && progressLineEl.isConnected) return progressLineEl;
      progressLineEl = document.createElement('div');
      progressLineEl.className = 'console-line console-progress';
      progressLineEl.innerHTML =
        '<div class="py-progress">' +
          '<div class="py-progress__label">Descargando motor Python…</div>' +
          '<div class="py-progress__bar"><div class="py-progress__fill" style="width:0%"></div></div>' +
          '<div class="py-progress__meta"><span class="py-progress__pct">0%</span> · <span class="py-progress__eta">calculando…</span></div>' +
        '</div>';
      consoleEl.appendChild(progressLineEl);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      progressStartedAt = Date.now();
      return progressLineEl;
    }

    function updateProgress(percent, label) {
      const line = ensureProgressLine();
      if (!line) return;
      const pct = Math.max(0, Math.min(100, Math.round(percent)));
      const fill = line.querySelector('.py-progress__fill');
      const pctEl = line.querySelector('.py-progress__pct');
      const etaEl = line.querySelector('.py-progress__eta');
      const labelEl = line.querySelector('.py-progress__label');
      if (fill) fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (labelEl && label) labelEl.textContent = label;
      if (etaEl && pct > 0 && pct < 100) {
        const elapsed = (Date.now() - progressStartedAt) / 1000;
        const total = elapsed / (pct / 100);
        const remaining = total - elapsed;
        etaEl.textContent = 'faltan ' + formatEta(remaining);
      } else if (etaEl && pct >= 100) {
        etaEl.textContent = 'listo';
      }
      if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
      setStatus(label || ('Descargando motor Python… ' + pct + '%'));
    }

    function removeProgressLine() {
      if (progressLineEl && progressLineEl.parentNode) {
        progressLineEl.parentNode.removeChild(progressLineEl);
      }
      progressLineEl = null;
    }

    async function cachePut(request, response) {
      try {
        if (!('caches' in window)) return;
        const cache = await caches.open(PYODIDE_CACHE);
        await cache.put(request, response.clone());
      } catch (_) {}
    }

    async function cachedFetch(url, onProgress) {
      // 1) Intentar desde Cache Storage (guardado local del motor)
      if ('caches' in window) {
        try {
          const cache = await caches.open(PYODIDE_CACHE);
          const hit = await cache.match(url);
          if (hit) {
            if (onProgress) onProgress(100, 'Motor Python (caché local)');
            return hit;
          }
        } catch (_) {}
      }

      // 2) Descargar con progreso si es posible
      const response = await fetch(url);
      if (!response.ok) throw new Error('No se pudo descargar: ' + url);

      const contentLength = Number(response.headers.get('Content-Length') || 0);
      if (!response.body || !contentLength || !onProgress) {
        await cachePut(url, response);
        if (onProgress) onProgress(100, 'Descarga completada');
        return response;
      }

      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        const pct = Math.min(99, (received / contentLength) * 100);
        onProgress(pct, 'Descargando motor Python…');
      }
      const blob = new Blob(chunks);
      const full = new Response(blob, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      await cachePut(url, full);
      onProgress(100, 'Motor Python descargado');
      return full;
    }

    function loadPyodideRuntime() {
      if (window.loadPyodide) return Promise.resolve(window.loadPyodide);
      if (pyodidePromise) return pyodidePromise;
      pyodidePromise = (async () => {
        const scriptUrl = PYODIDE_INDEX + 'pyodide.js';
        updateProgress(2, 'Preparando motor Python…');

        // Preferir script desde caché local
        let scriptSrc = scriptUrl;
        try {
          const resp = await cachedFetch(scriptUrl, (pct, label) => {
            // pyodide.js es solo una parte; reservamos 0-35%
            updateProgress(2 + (pct * 0.33), label || 'Descargando pyodide.js…');
          });
          const blob = await resp.blob();
          scriptSrc = URL.createObjectURL(blob);
        } catch (err) {
          // Fallback: script tag normal
          console.warn('[CODEVERSE] Cache fetch falló, usando CDN directo', err);
        }

        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = scriptSrc;
          script.onload = () => (window.loadPyodide ? resolve() : reject(new Error('El motor Python no quedó disponible.')));
          script.onerror = () => reject(new Error('No se pudo cargar Pyodide. Comprueba tu conexión.'));
          document.head.appendChild(script);
        });

        updateProgress(35, 'Inicializando motor Python…');
        return window.loadPyodide;
      })();
      return pyodidePromise;
    }

    async function runPython() {
      syncEditor();
      setStatus('Cargando Python…');
      clearConsole();
      ensureProgressLine();
      updateProgress(1, 'Iniciando motor Python (Pyodide)…');
      try {
        const loadPyodide = await loadPyodideRuntime();

        // Interceptar fetch durante la carga para cachear wasm/packages y mostrar progreso
        const originalFetch = window.fetch;
        let packageProgress = 35;
        window.fetch = async function(input, init) {
          const url = typeof input === 'string' ? input : (input && input.url) || '';
          const isPyodideAsset = url.indexOf('/pyodide/') !== -1 || url.indexOf('cdn.jsdelivr.net/pyodide') !== -1;
          if (isPyodideAsset && 'caches' in window) {
            try {
              const cache = await caches.open(PYODIDE_CACHE);
              const hit = await cache.match(url);
              if (hit) {
                packageProgress = Math.min(90, packageProgress + 3);
                updateProgress(packageProgress, 'Usando caché local del motor…');
                return hit;
              }
            } catch (_) {}
          }
          const resp = await originalFetch(input, init);
          if (isPyodideAsset && resp && resp.ok) {
            try {
              const cache = await caches.open(PYODIDE_CACHE);
              cache.put(url, resp.clone());
            } catch (_) {}
            packageProgress = Math.min(92, packageProgress + 4);
            updateProgress(packageProgress, 'Descargando componentes de Python…');
          }
          return resp;
        };

        try {
          const pyodide = window.__codeversePyodide || (window.__codeversePyodide = await loadPyodide({
            indexURL: PYODIDE_INDEX,
            stdout: (text) => logToConsole('log', [text]),
            stderr: (text) => logToConsole('error', [text])
          }));
          updateProgress(96, 'Motor listo. Ejecutando código…');
          pyodide.setStdout({ batched: (text) => logToConsole('log', [text]) });
          pyodide.setStderr({ batched: (text) => logToConsole('error', [text]) });
          removeProgressLine();
          await pyodide.runPythonAsync(state.python || '');
          setStatus('Python ejecutado');
          logToConsole('info', ['Ejecución de Python finalizada.']);
        } finally {
          window.fetch = originalFetch;
        }
      } catch (error) {
        removeProgressLine();
        setStatus('Error en Python');
        logToConsole('error', [error && error.message ? error.message : String(error)]);
      }
    }

    async function run() {
      clearConsole();
      logToConsole('info', ['Ejecutando proyecto…']);
      if (state.activeTab === 'python') {
        await runPython();
      } else {
        runWebProject();
        window.setTimeout(() => {
          if (statusEl && statusEl.textContent === 'Ejecutando vista previa…') setStatus('Vista previa actualizada');
        }, 900);
      }
    }

    function saveProject(showMessage = true) {
      syncEditor();
      const payload = { version: 2, files: { html: state.html, css: state.css, js: state.js, python: state.python }, activeTab: state.activeTab, savedAt: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        if (showMessage) {
          setStatus('Guardado en este dispositivo');
          logToConsole('info', ['Proyecto guardado localmente en este navegador.']);
        }
        return true;
      } catch (error) {
        setStatus('No se pudo guardar');
        logToConsole('error', ['No se pudo guardar en el almacenamiento local:', error.message]);
        return false;
      }
    }

    function downloadProject() {
      syncEditor();
      const content = buildSrcdoc();
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'codeverse-proyecto.html';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus('Descarga preparada');
    }

    async function shareProject() {
      syncEditor();
      const text = 'Mi proyecto CODEVERSE LIVE\n\n' + buildSrcdoc();
      try {
        if (navigator.share) {
          await navigator.share({ title: 'Proyecto CODEVERSE', text });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
          setStatus('Código copiado para compartir');
        } else {
          throw new Error('Este navegador no permite compartir ni copiar automáticamente.');
        }
      } catch (error) {
        if (error.name !== 'AbortError') logToConsole('warn', [error.message]);
      }
    }

    function restoreExample() {
      state.html = DEFAULTS.html;
      state.css = DEFAULTS.css;
      state.js = DEFAULTS.js;
      state.python = DEFAULTS.python;
      if (view) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: state[state.activeTab] } });
      saveProject(false);
      setStatus('Ejemplo restaurado');
      logToConsole('info', ['Se restauró el ejemplo inicial.']);
    }

    const btnSave = document.getElementById('btn-save');
    const btnDownload = document.getElementById('btn-download');
    const btnShare = document.getElementById('btn-share');
    const btnExample = document.getElementById('btn-example');
    const btnTheme = document.getElementById('btn-theme');
    const btnClearConsole = document.getElementById('btn-clear-console');

    if (btnRun) btnRun.addEventListener('click', run);
    if (btnSave) btnSave.addEventListener('click', () => saveProject(true));
    if (btnDownload) btnDownload.addEventListener('click', downloadProject);
    if (btnShare) btnShare.addEventListener('click', shareProject);
    if (btnExample) btnExample.addEventListener('click', () => {
      if (window.confirm('¿Restaurar el ejemplo? Se reemplazarán los cambios actuales del editor.')) restoreExample();
    });
    if (btnClearConsole) btnClearConsole.addEventListener('click', clearConsole);
    if (btnTheme) btnTheme.addEventListener('click', () => {
      const light = document.body.classList.toggle('theme-light');
      btnTheme.textContent = light ? 'Modo oscuro' : 'Modo claro';
      localStorage.setItem('codeverse_live_theme', light ? 'light' : 'dark');
    });

    window.addEventListener('message', (event) => {
      if (event.source !== previewFrame.contentWindow || !event.data || event.data.source !== 'codeverse-preview') return;
      if (event.data.type === 'console') logToConsole(event.data.level || 'log', event.data.args || []);
      else if (event.data.type === 'error') logToConsole('error', [event.data.message]);
      else if (event.data.type === 'ready') setStatus('Vista previa ejecutada');
    });

    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        run();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveProject(true);
      }
    });

    try {
      if (localStorage.getItem('codeverse_live_theme') === 'light') {
        document.body.classList.add('theme-light');
        if (btnTheme) btnTheme.textContent = 'Modo oscuro';
      }
    } catch (_) {}

    createEditor(state.activeTab);
    if (state.activeTab === 'python') {
      loadPythonLanguage().then(() => createEditor('python')).catch(() => {});
    }
    tabButtons.forEach((button) => {
      const active = button.dataset.tab === state.activeTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    if (btnRun) btnRun.disabled = false;
    setStatus(saved ? 'Proyecto recuperado' : 'Listo');
    logToConsole('info', [saved ? 'Proyecto recuperado del almacenamiento local.' : 'CODEVERSE LIVE listo. Edita y pulsa Ejecutar (Ctrl+Enter).']);
    runWebProject();
  }

  start();
})();
