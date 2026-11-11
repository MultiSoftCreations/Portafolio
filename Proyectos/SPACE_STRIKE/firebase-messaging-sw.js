/* SPACE STRIKE FCM service worker — receives push when tab/app closed */
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAvphMu9hP94TxCWbhiyAHZJtUHiwBrU1Y",
  authDomain: "space-strike-2b542.firebaseapp.com",
  projectId: "space-strike-2b542",
  storageBucket: "space-strike-2b542.firebasestorage.app",
  messagingSenderId: "274515632428",
  appId: "1:274515632428:web:c72fb66c2df01929128c89"
});

var messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  var title = (payload.notification && payload.notification.title) ||
    (payload.data && payload.data.title) ||
    "SPACE STRIKE";
  var body = (payload.notification && payload.notification.body) ||
    (payload.data && payload.data.body) ||
    "";
  var options = {
    body: body,
    icon: "/img/marca.png",
    badge: "/img/marca.png",
    data: payload.data || {},
    tag: (payload.data && payload.data.tag) || "ss-push"
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || "/index.html";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url && "focus" in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
