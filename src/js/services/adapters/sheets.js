import { CONFIG } from "../../config.js";
import { orderToRow } from "../orderModel.js";
import { postJSON } from "./http.js";

/** Phase 2: appends a row to a Google Sheet via an Apps Script web app.
 *  See server/google-apps-script/Code.gs for the receiving end. */
export const sheetsAdapter = {
  name: "sheets",
  async send(order) {
    return postJSON(CONFIG.endpoints.sheets, { row: orderToRow(order), raw: order });
  }
};
