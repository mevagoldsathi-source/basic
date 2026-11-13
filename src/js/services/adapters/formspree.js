import { CONFIG } from "../../config.js";
import { orderToText } from "../orderModel.js";
import { postJSON } from "./http.js";

/** Emails the order straight to the founder's inbox. */
export const formspreeAdapter = {
  name: "formspree",
  async send(order) {
    return postJSON(CONFIG.endpoints.formspree, {
      _subject: `New Mevagold order ${order.orderId}`,
      orderId: order.orderId,
      name: order.customer.name,
      phone: order.customer.phone,
      message: orderToText(order),
      raw: order
    });
  }
};
