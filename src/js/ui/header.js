import { $, on } from "../lib/dom.js";
import { CONFIG } from "../config.js";

export function initHeader() {
  $("#yr").textContent = new Date().getFullYear();
  $("#footWa").href = `https://wa.me/${CONFIG.whatsapp}`;
  $("#footMail").href = `mailto:${CONFIG.founderEmail}`;

  const hdr = $("#hdr");
  const sync = () => hdr.classList.toggle("solid", window.scrollY > window.innerHeight * 0.82);
  on(window, "scroll", sync, { passive: true });
  sync();
}
