/* SPACE STRIKE — Service Worker: texturas en disco (cache-first) */
var TEX_CACHE = "ss-textures-v3313";

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          /* limpia caches viejos de texturas, no toca otros */
          if (k.indexOf("ss-textures-") === 0 && k !== TEX_CACHE) {
            return caches.delete(k);
          }
          if (k.indexOf("space-strike-assets-") === 0) {
            return caches.delete(k);
          }
          return null;
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function isTextureRequest(url) {
  try {
    var u = new URL(url);
    if (u.origin !== self.location.origin) return false;
    var p = u.pathname;
    return (
      p.indexOf("/img/") !== -1 ||
      /\.(png|jpg|jpeg|webp|gif|svg)(\?|$)/i.test(p)
    );
  } catch (e) {
    return false;
  }
}

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  if (!isTextureRequest(req.url)) return;

  event.respondWith(
    caches.open(TEX_CACHE).then(function (cache) {
      return cache.match(req).then(function (cached) {
        if (cached) return cached;
        return fetch(req)
          .then(function (res) {
            if (res && res.ok) {
              try {
                cache.put(req, res.clone());
              } catch (e) {}
            }
            return res;
          })
          .catch(function () {
            return cached || Response.error();
          });
      });
    })
  );
});
