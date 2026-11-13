/**
 * Entry point. Wires modules together and owns nothing itself —
 * this is the only file that knows about all the pieces at once.
 */
import { $, on } from "./lib/dom.js";
import { drawJaal } from "./art/jaal.js";
import { initHeader } from "./ui/header.js";
import { initCatalog } from "./ui/catalog.js";
import { cart, openCart, closeCart, isCartOpen } from "./ui/cart.js";
import { checkout } from "./ui/checkout.js";
import { initHero } from "./three/hero.js";

function boot() {
  initHeader();
  drawJaal($("#motif"));

  cart.load();
  cart.render();

  const add = (id, weight) => cart.add(id, weight);
  initCatalog({ container: $("#catalog-kesar"),  category: "kesar",  onAdd: add });
  initCatalog({ container: $("#catalog-walnut"), category: "walnut", onAdd: add });
  initHero($("#heroFx"), $(".hero"));

  on($("#cartBtn"),      "click", openCart);
  on($("#closeCart"),    "click", closeCart);
  on($("#checkoutBtn"),  "click", () => { closeCart(); checkout.open(); });
  on($("#closeModal"),   "click", () => checkout.close());
  on($("#scrim"),        "click", () => { checkout.close(); closeCart(); });

  on(window, "keydown", e => {
    if (e.key !== "Escape") return;
    if (checkout.isOpen()) checkout.close();
    else if (isCartOpen()) closeCart();
  });
}

document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", boot)
  : boot();
