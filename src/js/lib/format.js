import { CONFIG } from "../config.js";

export const money = n => CONFIG.currency + Number(n).toLocaleString(CONFIG.locale);

export const gramsOf = weight => (weight === "1kg" ? 1000 : parseInt(weight, 10));

export const esc = s => String(s ?? "").replace(/[&<>"']/g, m =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

export function newOrderId() {
  const d = new Date(), p = n => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MF-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rand}`;
}
