/**
 * Crea preferencia Checkout Pro de Mercado Pago.
 * Env: MP_ACCESS_TOKEN, URL del sitio (opcional SITE_URL)
 */
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(), body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "method" });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return json(500, { ok: false, error: "Falta MP_ACCESS_TOKEN en Netlify" });
  }

  let body = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    body = {};
  }

  const site =
    process.env.SITE_URL ||
    (event.headers["x-forwarded-proto"] && event.headers.host
      ? event.headers["x-forwarded-proto"] + "://" + event.headers.host
      : "https://spacestrike.netlify.app");

  const external = String(body.ref || ("ss-" + Date.now())).slice(0, 64);
  const success =
    site.replace(/\/$/, "") + "/html/premium.html?mp=success&ref=" + encodeURIComponent(external);
  const failure =
    site.replace(/\/$/, "") + "/html/premium.html?mp=failure";
  const pending =
    site.replace(/\/$/, "") + "/html/premium.html?mp=pending";
  const notify =
    site.replace(/\/$/, "") + "/.netlify/functions/mp-webhook";

  const preference = {
    items: [
      {
        title: "Space Strike Premium",
        description: "Naves exclusivas +50% creditos + bonus",
        quantity: 1,
        currency_id: "MXN",
        unit_price: 49
      }
    ],
    external_reference: external,
    back_urls: {
      success: success,
      failure: failure,
      pending: pending
    },
    auto_return: "approved",
    notification_url: notify,
    statement_descriptor: "SPACESTRIKE"
  };

  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });
    const data = await res.json();
    if (!res.ok) {
      return json(res.status, { ok: false, error: data.message || data.error || "mp_error", detail: data });
    }
    return json(200, {
      ok: true,
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point
    });
  } catch (err) {
    return json(500, { ok: false, error: String(err.message || err) });
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}
function json(code, obj) {
  return {
    statusCode: code,
    headers: Object.assign({ "Content-Type": "application/json" }, cors()),
    body: JSON.stringify(obj)
  };
}
