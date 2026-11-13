import { CONFIG } from "../../config.js";
import { orderToText } from "../orderModel.js";

/**
 * Phase 1: no backend at all. The order is formatted and handed to
 * WhatsApp or email through links rendered on the confirmation screen.
 */
export const handoffAdapter = {
  name: "handoff",
  async send(order) {
    console.info("[order]", orderToText(order));
    return { ok: true, via: "handoff", needsUserAction: true };
  }
};

export const waLink = order =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(orderToText(order))}`;

export const mailLink = order =>
  `mailto:${CONFIG.founderEmail}` +
  `?subject=${encodeURIComponent("New Mevagold order " + order.orderId)}` +
  `&body=${encodeURIComponent(orderToText(order))}`;
