import { CONFIG } from "../config.js";
import { handoffAdapter } from "./adapters/handoff.js";
import { formspreeAdapter } from "./adapters/formspree.js";
import { sheetsAdapter } from "./adapters/sheets.js";
import { apiAdapter } from "./adapters/api.js";

/**
 * Order routing. The UI calls OrderGateway.send(order) and never knows
 * or cares where the order actually goes.
 *
 * To add a destination (Shopify, Razorpay, a Postgres API):
 *   1. write an adapter with { name, async send(order) }
 *   2. register it below
 *   3. set CONFIG.ACTIVE_CHANNEL to its name
 */
const adapters = {
  handoff: handoffAdapter,
  formspree: formspreeAdapter,
  sheets: sheetsAdapter,
  api: apiAdapter
};

export const OrderGateway = {
  register(adapter) { adapters[adapter.name] = adapter; },

  async send(order) {
    const adapter = adapters[CONFIG.ACTIVE_CHANNEL] ?? handoffAdapter;
    try {
      const result = await adapter.send(order);
      return { ...result, channel: adapter.name };
    } catch (err) {
      // Never lose an order to a network hiccup: fall back to the manual handoff.
      console.warn(`[orderGateway] ${adapter.name} failed, falling back to handoff`, err);
      const fallback = await handoffAdapter.send(order);
      return { ...fallback, channel: "handoff", fallbackFrom: adapter.name };
    }
  }
};

export { waLink, mailLink } from "./adapters/handoff.js";
