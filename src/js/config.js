/**
 * Mevagold — single source of truth for business settings.
 * Everything a non-developer might need to change lives in this file.
 */
export const CONFIG = {
  brand: "Mevagold",
  currency: "₹",
  locale: "en-IN",

  /* Where orders go.
   *   "handoff"   → formats the order and opens WhatsApp / email (no backend)
   *   "formspree" → POSTs JSON to FORMSPREE_ENDPOINT
   *   "sheets"    → POSTs JSON to a Google Apps Script web app
   *   "api"       → POSTs to your own serverless function (server/netlify/functions/order.js)
   * Adapters are registered in services/orderGateway.js — add one without
   * touching any UI code. */
  ACTIVE_CHANNEL: "handoff",

  endpoints: {
    formspree: "https://formspree.io/f/REPLACE_ME",
    sheets: "https://script.google.com/macros/s/REPLACE_ME/exec",
    api: "/.netlify/functions/order"
  },

  founderEmail: "orders@mevagold.com",
  whatsapp: "919999999999",            // country code + number, digits only

  shipping: { flat: 90, freeAbove: 1500 },

  payment: {
    // Your real UPI ID (VPA) — e.g. "yourname@okaxis" or "mevagold@paytm".
    // The checkout QR is generated live from this, so it always encodes
    // the exact cart total — the customer never types an amount in.
    upiId: "mevagold@upi",
    accountName: "Mevagold",
    accountNumber: "0000 1111 2222 3333",
    ifsc: "JAKA0MEVAFR",
    bank: "J&K Bank, Lal Chowk, Srinagar",
    // Leave null to use the generated dynamic QR above. Only set this if
    // you'd rather show a fixed QR exported from your bank/UPI app instead
    // (that kind of QR can't carry a pre-filled amount).
    qrImage: null
  }
};
