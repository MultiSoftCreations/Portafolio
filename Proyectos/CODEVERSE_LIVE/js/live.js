/**
 * CODEVERSE LIVE — V1
 * Editor HTML/CSS/JS + preview sandbox + consola
 */

(function () {
  'use strict';

  function start() {
    if (!window.CodeMirror) {
      setTimeout(start, 50);
      return;
    }
    init();
  }

  function init() {
    const CM = window.CodeMirror;

    const state = {
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
      activeTab: 'html'
    };

    const editorHost = document.getElementById('editor-host');
    const previewFrame = document.getElementById('preview-frame');
    const consoleEl = document.getElementById('console-output');
    const btnRun = document.getElementById('btn-run');
    const btnClearConsole = document.getElementById('btn-clear-console');
    const tabButtons = document.querySelectorAll('[data-tab]');
    const statusEl = document.getElementById('live-status');

    if (!editorHost || !previewFrame) return;

    let view = null;

    const baseExtensions = [
      CM.basicSetup,
      CM.EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          state[state.activeTab] = update.state.doc.toString();
        }
      }),
      CM.EditorView.theme({
        '&': { height: '100%', fontSize: '14px', backgroundColor: '#0d0d14' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': {
          caretColor: '#818cf8',
          fontFamily: "'JetBrains Mono', ui-monospace, monospace"
        },
        '.cm-gutters': {
          backgroundColor: '#111118',
          color: '#6b6b7b',
          border: 'none'
        },
        '.cm-activeLineGutter': { backgroundColor: '#1a1a26' },
        '.cm-activeLine': { backgroundColor: 'rgba(99,102,241,0.08)' },
        '&.cm-focused .cm-cursor': { borderLeftColor: '#818cf8' },
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
          backgroundColor: 'rgba(99,102,241,0.35)'
        }
      }, { dark: true })
    ];

    function languageFor(tab) {
      if (tab === 'html') return CM.html();
      if (tab === 'css') return CM.css();
      if (tab === 'js') return CM.javascript();
      return [];
    }

    function createEditor(tab) {
      if (view) {
        view.destroy();
        view = null;
      }
      editorHost.innerHTML = '';
      view = new CM.EditorView({
        doc: state[tab],
        extensions: [...baseExtensions, languageFor(tab)],
        parent: editorHost
      });
    }

    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        if (tab === state.activeTab) return;
        if (view) state[state.activeTab] = view.state.doc.toString();
        state.activeTab = tab;
        tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
        createEditor(tab);
      });
    });

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function logToConsole(type, args) {
      if (!consoleEl) return;
      const line = document.createElement('div');
      line.className = 'console-line console-' + type;
      const time = new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      const text = args.map((a) => {
        if (typeof a === 'object') {
          try { return JSON.stringify(a); } catch { return String(a); }
        }
        return String(a);
      }).join(' ');
      line.innerHTML = '<span class="console-time">' + time + '</span> <span class="console-msg">' + escapeHtml(text) + '</span>';
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }

    function clearConsole() {
      if (consoleEl) consoleEl.innerHTML = '';
    }

    if (btnClearConsole) btnClearConsole.addEventListener('click', clearConsole);

    window.addEventListener('message', (event) => {
      if (!event.data || event.data.source !== 'codeverse-preview') return;
      if (event.data.type === 'console') {
        logToConsole(event.data.level || 'log', event.data.args || []);
      } else if (event.data.type === 'error') {
        logToConsole('error', [event.data.message]);
      } else if (event.data.type === 'ready') {
        setStatus('Ejecutado');
      }
    });

    function buildSrcdoc() {
      if (view) state[state.activeTab] = view.state.doc.toString();

      const consoleBridge = `
<script>
(function(){
  var levels = ['log','info','warn','error','debug'];
  levels.forEach(function(level){
    var original = console[level];
    console[level] = function(){
      var args = Array.prototype.slice.call(arguments).map(function(a){
        try {
          if (typeof a === 'object') return JSON.stringify(a);
          return String(a);
        } catch(e) { return String(a); }
      });
      parent.postMessage({ source: 'codeverse-preview', type: 'console', level: level, args: args }, '*');
      if (original) original.apply(console, arguments);
    };
  });
  window.onerror = function(msg, url, line) {
    parent.postMessage({ source: 'codeverse-preview', type: 'error', message: msg + ' (línea ' + line + ')' }, '*');
  };
  parent.postMessage({ source: 'codeverse-preview', type: 'ready' }, '*');
})();
<\/script>`;

      var html = state.html || '';
      var cssBlock = '<style>\\n' + (state.css || '') + '\\n</style>';
      if (html.indexOf('</head>') !== -1) {
        html = html.replace('</head>', cssBlock + '\\n</head>');
      } else {
        html = cssBlock + html;
      }

      var jsBlock = consoleBridge + '\\n<script>\\n' + (state.js || '') + '\\n<\\/script>';
      if (html.indexOf('</body>') !== -1) {
        html = html.replace('</body>', jsBlock + '\\n</body>');
      } else {
        html = html + jsBlock;
      }
      return html;
    }

    function setStatus(text) {
      if (statusEl) statusEl.textContent = text;
    }

    function run() {
      clearConsole();
      setStatus('Ejecutando…');
      logToConsole('info', ['Ejecutando proyecto…']);
      previewFrame.srcdoc = buildSrcdoc();
      setTimeout(function () {
        if (statusEl && statusEl.textContent === 'Ejecutando…') setStatus('Listo');
      }, 1500);
    }

    if (btnRun) btnRun.addEventListener('click', run);

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });

    createEditor('html');
    tabButtons.forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === 'html');
    });
    setStatus('Listo');
    logToConsole('info', ['CODEVERSE LIVE listo. Edita y pulsa Ejecutar (Ctrl+Enter).']);
  }

  start();
})();
