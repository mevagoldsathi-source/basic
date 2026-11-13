import { CONFIG } from "../../config.js";
import { postJSON } from "./http.js";

/** Your own serverless function — the step before a real database. */
export const apiAdapter = {
  name: "api",
  async send(order) {
    return postJSON(CONFIG.endpoints.api, order);
  }
};
