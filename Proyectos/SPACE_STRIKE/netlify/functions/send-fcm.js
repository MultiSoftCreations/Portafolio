/**
 * POST body: { title, body, type?, url? }
 * Env: FCM_SERVER_KEY (Firebase Cloud Messaging legacy server key)
 * Reads tokens from Firestore via REST is complex without admin SDK;
 * Client can pass tokens OR we use FIREBASE with admin.
 * Simple path: body.tokens[] optional; if missing, response asks to use client broadcast list.
 *
 * Preferred: Admin client collects token docs and POSTs here with tokens + message.
 * Env FCM_SERVER_KEY required.
 */
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  var key = process.env.FCM_SERVER_KEY || process.env.FIREBASE_SERVER_KEY || "";
  if (!key) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "Falta FCM_SERVER_KEY en variables de entorno de Netlify"
      })
    };
  }

  var data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "JSON inválido" }) };
  }

  var title = String(data.title || "SPACE STRIKE").slice(0, 80);
  var body = String(data.body || "").slice(0, 500);
  var tokens = Array.isArray(data.tokens) ? data.tokens.filter(Boolean) : [];
  if (!tokens.length) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "Sin tokens" })
    };
  }

  var sent = 0;
  var errors = [];
  /* FCM allows up to 1000 registration_ids per request (legacy) */
  for (var i = 0; i < tokens.length; i += 500) {
    var chunk = tokens.slice(i, i + 500);
    var payload = {
      registration_ids: chunk,
      priority: "high",
      notification: {
        title: title,
        body: body,
        icon: "/img/marca.png",
        click_action: data.url || "https://multisoftcreations.com.mx/Proyectos/SPACE_STRIKE/"
      },
      data: {
        title: title,
        body: body,
        type: String(data.type || "news"),
        url: data.url || "/"
      }
    };
    try {
      var res = await fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: "key=" + key,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      var json = await res.json().catch(function () {
        return {};
      });
      if (res.ok) {
        sent += Number(json.success || 0);
        if (json.failure) errors.push("fail batch " + json.failure);
      } else {
        errors.push("HTTP " + res.status + " " + JSON.stringify(json).slice(0, 200));
      }
    } catch (err) {
      errors.push(String(err && err.message || err));
    }
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
    body: JSON.stringify({ ok: errors.length === 0, sent: sent, tokenCount: tokens.length, errors: errors })
  };
};
