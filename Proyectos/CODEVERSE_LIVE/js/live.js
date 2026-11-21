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

    function loadPyodideRuntime() {
      if (window.loadPyodide) return Promise.resolve(window.loadPyodide);
      if (pyodidePromise) return pyodidePromise;
      pyodidePromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js';
        script.onload = () => window.loadPyodide ? resolve(window.loadPyodide) : reject(new Error('El motor Python no quedó disponible.'));
        script.onerror = () => reject(new Error('No se pudo descargar Pyodide. Comprueba tu conexión.'));
        document.head.appendChild(script);
      });
      return pyodidePromise;
    }

    async function runPython() {
      syncEditor();
      setStatus('Cargando Python…');
      logToConsole('info', ['Iniciando motor Python (Pyodide); la primera carga puede tardar.']);
      try {
        const loadPyodide = await loadPyodideRuntime();
        const pyodide = window.__codeversePyodide || (window.__codeversePyodide = await loadPyodide({
          stdout: (text) => logToConsole('log', [text]),
          stderr: (text) => logToConsole('error', [text])
        }));
        pyodide.setStdout({ batched: (text) => logToConsole('log', [text]) });
        pyodide.setStderr({ batched: (text) => logToConsole('error', [text]) });
        await pyodide.runPythonAsync(state.python || '');
        setStatus('Python ejecutado');
        logToConsole('info', ['Ejecución de Python finalizada.']);
      } catch (error) {
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
