import { CONFIG } from "../config.js";
import qrcode from "../vendor/qrcode.mjs";

/**
 * Real, scannable UPI QR — generated in the browser, no external QR API.
 *
 * The QR encodes a standard "upi://pay" deep link with the exact order
 * amount and a note, so any UPI app (GPay, PhonePe, Paytm, BHIM, the
 * customer's own bank app) opens pre-filled and ready to pay — no manual
 * amount entry, and no round-trip to a server just to draw a QR code.
 *
 * If you'd rather show a fixed QR from your bank app instead (Option A),
 * set CONFIG.payment.qrImage to an image path and this module steps aside.
 *
 * Note: UPI has no payment-status webhook, so this alone can't mark an
 * order "paid" automatically — the customer still confirms in their app
 * and reports back their UTR. That last mile needs a gateway like Razorpay
 * Payment Links; see docs/DEPLOY.md.
 */

/** Builds the upi://pay deep link UPI apps understand. */
export function buildUpiUri({ amount, note }) {
  const p = CONFIG.payment;
  const params = new URLSearchParams({
    pa: p.upiId,               // payee address (your VPA)
    pn: CONFIG.brand,          // payee name
    am: Number(amount).toFixed(2),
    cu: "INR"
  });
  if (note) params.set("tn", note.slice(0, 50)); // most apps cap the note length
  return `upi://pay?${params.toString()}`;
}

/**
 * Renders the QR block for the checkout screen.
 * `amount` should be the live cart total; `note` is usually the order ID.
 */
export function qrMarkup({ amount, note } = {}) {
  const P = CONFIG.payment;

  if (P.qrImage) {
    return `<img src="${P.qrImage}" alt="UPI QR code for ${P.upiId}">`;
  }
  if (!P.upiId) {
    return `<div class="qr-missing">Add a UPI ID in <code>config.js</code> to show a QR here.</div>`;
  }

  const uri = buildUpiUri({ amount, note });
  return dynamicQrSvg(uri);
}

/** Encodes `text` and draws it as a crisp, theme-colored inline SVG. */
function dynamicQrSvg(text) {
  const qr = qrcode(0, "M");   // type 0 = auto-size to fit the data
  qr.addData(text);
  qr.make();

  const n = qr.getModuleCount();
  let cells = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) cells += `<rect x="${c}" y="${r}" width="1" height="1"/>`;
    }
  }

  return `<svg viewBox="0 0 ${n} ${n}" role="img" aria-label="Scan with any UPI app to pay">
    <rect width="${n}" height="${n}" fill="#fff"/>
    <g fill="#0B3C26">${cells}</g>
  </svg>`;
}
