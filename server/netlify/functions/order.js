/**
 * Optional Phase-2 backend: a Netlify function that receives an order,
 * validates it server-side, and forwards it wherever you want.
 *
 * Enable by setting CONFIG.ACTIVE_CHANNEL = "api" in src/js/config.js.
 */
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let order;
  try {
    order = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  // Never trust the browser's totals — recompute before you act on them.
  const computed = order.items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  if (computed !== order.subtotal) {
    return { statusCode: 400, body: JSON.stringify({ error: "Subtotal mismatch" }) };
  }

  // 1. Log it (visible in the Netlify function log)
  console.log("New order", order.orderId, order.customer.phone, order.total);

  // 2. Forward to a Google Sheet, if configured
  if (process.env.SHEETS_WEBHOOK_URL) {
    await fetch(process.env.SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).catch(err => console.error("Sheets forward failed", err));
  }

  // 3. Email it, if you've added an email provider key
  // if (process.env.RESEND_API_KEY) { ...send mail... }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true, orderId: order.orderId })
  };
}
