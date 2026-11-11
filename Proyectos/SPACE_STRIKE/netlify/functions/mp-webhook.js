/**
 * Webhook de Mercado Pago (topic=payment).
 * Responde 200 siempre para que MP no reintente en exceso.
 * La activación real la hace el cliente con confirm-payment al volver.
 */
exports.handler = async function (event) {
  // MP sends GET or POST
  try {
    const q = event.queryStringParameters || {};
    let body = {};
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {}
    console.log("MP webhook", JSON.stringify({ q: q, body: body }).slice(0, 500));
  } catch (e) {}
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true })
  };
};
