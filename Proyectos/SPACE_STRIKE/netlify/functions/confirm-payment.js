/**
 * Verifica payment_id / preference con la API de Mercado Pago.
 * Si approved → { ok:true, premium:true }
 */
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors(), body: "" };
  }
  if (event.httpMethod !== "POST" && event.httpMethod !== "GET") {
    return json(405, { ok: false, error: "method" });
  }

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    return json(500, { ok: false, error: "Falta MP_ACCESS_TOKEN" });
  }

  let paymentId = null;
  let preferenceId = null;
  if (event.httpMethod === "GET") {
    paymentId = (event.queryStringParameters || {}).payment_id;
    preferenceId = (event.queryStringParameters || {}).preference_id;
  } else {
    try {
      const b = JSON.parse(event.body || "{}");
      paymentId = b.payment_id || b.collection_id;
      preferenceId = b.preference_id;
    } catch (e) {}
  }

  if (!paymentId && !preferenceId) {
    return json(400, { ok: false, error: "Falta payment_id" });
  }

  try {
    if (paymentId) {
      const res = await fetch("https://api.mercadopago.com/v1/payments/" + encodeURIComponent(paymentId), {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      if (!res.ok) {
        return json(res.status, { ok: false, error: data.message || "payment_lookup_failed" });
      }
      const status = data.status;
      const approved = status === "approved";
      return json(200, {
        ok: approved,
        premium: approved,
        status: status,
        payment_id: data.id,
        amount: data.transaction_amount,
        external_reference: data.external_reference || null
      });
    }

    return json(400, { ok: false, error: "Usa payment_id" });
  } catch (err) {
    return json(500, { ok: false, error: String(err.message || err) });
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  };
}
function json(code, obj) {
  return {
    statusCode: code,
    headers: Object.assign({ "Content-Type": "application/json" }, cors()),
    body: JSON.stringify(obj)
  };
}
