/**
 * CODEVERSE — Control de versión de caché
 * MultiSoftCreations
 *
 * Lee version.json del servidor y lo compara con la versión guardada.
 * Si cambió: limpia cachés de la app y recarga una sola vez.
 *
 * Uso: al subir cambios, sube también version.json con un número nuevo
 * (ej. 1.1.1 → 1.1.2).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'codeverse_app_version';
  var RELOAD_KEY = 'codeverse_version_reloading';
  var VERSION_URL = (function () {
    var path = window.location.pathname || "/";
    var cursos = path.indexOf("/Cursos/");
    if (cursos >= 0) return path.slice(0, cursos + 1) + "version.json";
    var last = path.lastIndexOf("/");
    return (last >= 0 ? path.slice(0, last + 1) : "/") + "version.json";
  })();

  function getStoredVersion() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  function setStoredVersion(version) {
    try {
      localStorage.setItem(STORAGE_KEY, version);
    } catch (_) {}
  }

  function clearReloadFlag() {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch (_) {}
  }

  function markReloading() {
    try {
      sessionStorage.setItem(RELOAD_KEY, '1');
    } catch (_) {}
  }

  function isReloading() {
    try {
      return sessionStorage.getItem(RELOAD_KEY) === '1';
    } catch (_) {
      return false;
    }
  }

  function clearAppCaches() {
    var tasks = [];

    // Cache Storage (Pyodide, assets, etc.)
    if (typeof caches !== 'undefined' && caches.keys) {
      tasks.push(
        caches.keys().then(function (keys) {
          return Promise.all(
            keys
              .filter(function (k) {
                return k.indexOf('codeverse') !== -1 || k.indexOf('pyodide') !== -1;
              })
              .map(function (k) {
                return caches.delete(k);
              })
          );
        }).catch(function () {})
      );
    }

    // Service Workers de este scope
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
      tasks.push(
        navigator.serviceWorker.getRegistrations().then(function (regs) {
          return Promise.all(
            regs.map(function (reg) {
              return reg.unregister();
            })
          );
        }).catch(function () {})
      );
    }

    return Promise.all(tasks);
  }

  function hardReload() {
    var url = new URL(window.location.href);
    url.searchParams.set('_cv', String(Date.now()));
    window.location.replace(url.toString());
  }

  // Exponer versión actual para otros scripts (live.js puede usarla en ?v=)
  window.CODEVERSE_VERSION = getStoredVersion() || '0';

  // Evitar bucle de recarga
  if (isReloading()) {
    clearReloadFlag();
    return;
  }

  fetch(VERSION_URL + '?t=' + Date.now(), {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  })
    .then(function (res) {
      if (!res.ok) throw new Error('version.json HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      var remote = (data && data.version) ? String(data.version) : '';
      if (!remote) return;

      window.CODEVERSE_VERSION = remote;
      var local = getStoredVersion();

      // Primera visita: solo guardar
      if (!local) {
        setStoredVersion(remote);
        return;
      }

      // Misma versión: no hacer nada
      if (local === remote) return;

      // Versión distinta → limpiar caché de la app y recargar
      console.info('[CODEVERSE] Nueva versión detectada:', local, '→', remote);
      markReloading();
      return clearAppCaches().then(function () {
        setStoredVersion(remote);
        hardReload();
      });
    })
    .catch(function (err) {
      // Si no se puede leer version.json, no bloqueamos la app
      console.warn('[CODEVERSE] No se pudo verificar versión:', err && err.message ? err.message : err);
    });
})();
