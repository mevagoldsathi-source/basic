import { byId } from "../data/products.js";
import { money } from "../lib/format.js";

/**
 * The canonical order object. Every adapter receives exactly this shape,
 * so swapping destinations never changes the payload.
 */
export function buildOrder({ orderId, customer, payment, cart }) {
  return {
    orderId,
    placedAt: new Date().toISOString(),
    customer: { ...customer },
    items: cart.items.map(i => {
      const p = byId(i.id);
      return {
        productId: p.id,
        product: p.name,
        weight: i.weight,
        qty: i.qty,
        unitPrice: p.prices[i.weight],
        lineTotal: p.prices[i.weight] * i.qty
      };
    }),
    subtotal: cart.subtotal(),
    shipping: cart.shipping(),
    total: cart.total(),
    payment: {
      method: "UPI / bank transfer",
      reference: payment.ref,
      screenshot: payment.fileName || "not attached"
    }
  };
}

/** Human-readable order — used for WhatsApp, email and the copy button. */
export function orderToText(o) {
  const L = [];
  L.push(`MEVAGOLD ORDER ${o.orderId}`);
  L.push(new Date(o.placedAt).toLocaleString("en-IN"));
  L.push("", "ITEMS");
  o.items.forEach(i => L.push(`• ${i.product} — ${i.weight} × ${i.qty} = ${money(i.lineTotal)}`));
  L.push("");
  L.push(`Subtotal: ${money(o.subtotal)}`);
  L.push(`Shipping: ${o.shipping ? money(o.shipping) : "Free"}`);
  L.push(`TOTAL: ${money(o.total)}`);
  L.push("", "CUSTOMER");
  L.push(`${o.customer.name} · ${o.customer.phone}`);
  L.push(`${o.customer.address}, ${o.customer.city} — ${o.customer.pincode}`);
  L.push("", "PAYMENT");
  L.push(`${o.payment.method} · Ref ${o.payment.reference}`);
  L.push(`Screenshot: ${o.payment.screenshot}`);
  return L.join("\n");
}

/** Flat row — what a Google Sheet or CSV export wants. */
export function orderToRow(o) {
  return {
    orderId: o.orderId,
    placedAt: o.placedAt,
    name: o.customer.name,
    phone: o.customer.phone,
    address: o.customer.address,
    city: o.customer.city,
    pincode: o.customer.pincode,
    items: o.items.map(i => `${i.product} ${i.weight} x${i.qty}`).join(" | "),
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    paymentRef: o.payment.reference,
    screenshot: o.payment.screenshot
  };
}
