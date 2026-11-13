import { CONFIG } from "../config.js";
import { byId } from "../data/products.js";
import { artwork } from "../art/artwork.js";
import { money } from "../lib/format.js";
import { storage } from "../lib/storage.js";
import { $, el, on } from "../lib/dom.js";
import { toast } from "./toast.js";
import { overlay } from "./overlay.js";

/**
 * Cart state + drawer rendering.
 * State is a plain array of { id, weight, qty } — easy to send to a
 * real backend later without reshaping anything.
 */
export const cart = {
  items: [],
  _subscribers: [],

  /* ---- state ---- */
  load() {
    const saved = storage.get("cart", []);
    this.items = Array.isArray(saved)
      ? saved.filter(i => byId(i.id) && byId(i.id).status !== "soon" && byId(i.id).prices[i.weight])
      : [];
  },
  save() { storage.set("cart", this.items); },

  add(id, weight) {
    const line = this.items.find(i => i.id === id && i.weight === weight);
    line ? line.qty++ : this.items.push({ id, weight, qty: 1 });
    this.commit();
    bumpCounter();
    toast(`${byId(id).tag} · ${weight} added`);
    openCart();
  },
  setQty(index, qty) {
    if (qty <= 0) return this.remove(index);
    this.items[index].qty = Math.min(qty, 99);
    this.commit();
  },
  remove(index) {
    const [gone] = this.items.splice(index, 1);
    this.commit();
    toast(`Removed ${byId(gone.id).name} · ${gone.weight}`);
  },
  clear() { this.items = []; this.commit(); },

  commit() { this.save(); this.render(); this._subscribers.forEach(fn => fn(this)); },
  subscribe(fn) { this._subscribers.push(fn); },

  /* ---- money ---- */
  unitPrice(line) { return byId(line.id).prices[line.weight]; },
  count()    { return this.items.reduce((s, i) => s + i.qty, 0); },
  subtotal() { return this.items.reduce((s, i) => s + this.unitPrice(i) * i.qty, 0); },
  shipping() {
    const s = this.subtotal();
    if (!s) return 0;
    return s >= CONFIG.shipping.freeAbove ? 0 : CONFIG.shipping.flat;
  },
  total() { return this.subtotal() + this.shipping(); },

  /* ---- view ---- */
  render() {
    $("#cartCount").textContent = this.count();
    const lines = $("#lines");
    const foot = $("#drawerFoot");
    lines.innerHTML = "";

    if (!this.items.length) {
      foot.hidden = true;
      const empty = el("div", "empty", `
        <h3>Nothing packed yet</h3>
        <p>Pick a kesar from this season's harvest and it will show up here.</p>
        <button class="btn btn-line" id="emptyShop">Browse kesar</button>`);
      lines.appendChild(empty);
      on($("#emptyShop"), "click", () => {
        closeCart();
        document.getElementById("kesar").scrollIntoView();
      });
      return;
    }

    foot.hidden = false;
    this.items.forEach((line, index) => {
      const product = byId(line.id);
      const row = el("div", "line", `
        <div class="line-art">${artwork(product, "c" + index)}</div>
        <div>
          <h4>${product.name}</h4>
          <div class="meta">${line.weight} · ${money(this.unitPrice(line))} each</div>
          <div class="line-foot">
            <div class="qty">
              <button data-dec aria-label="Decrease quantity">−</button>
              <span>${line.qty}</span>
              <button data-inc aria-label="Increase quantity">+</button>
            </div>
            <span class="line-price">${money(this.unitPrice(line) * line.qty)}</span>
          </div>
          <button class="rm" data-rm>Remove</button>
        </div>`);
      on(row.querySelector("[data-dec]"), "click", () => this.setQty(index, line.qty - 1));
      on(row.querySelector("[data-inc]"), "click", () => this.setQty(index, line.qty + 1));
      on(row.querySelector("[data-rm]"),  "click", () => this.remove(index));
      lines.appendChild(row);
    });

    $("#sub").textContent   = money(this.subtotal());
    $("#ship").textContent  = this.shipping() ? money(this.shipping()) : "Free";
    $("#grand").textContent = money(this.total());

    const gap = CONFIG.shipping.freeAbove - this.subtotal();
    $("#shipNote").textContent = gap > 0
      ? `Add ${money(gap)} more for free delivery. Dispatched from Srinagar in 24–48 hours.`
      : "Free delivery unlocked. Dispatched from Srinagar in 24–48 hours.";
  }
};

function bumpCounter() {
  const c = $("#cartCount");
  c.classList.add("pop");
  setTimeout(() => c.classList.remove("pop"), 300);
}

export function openCart() {
  $("#drawer").classList.add("on");
  $("#drawer").setAttribute("aria-hidden", "false");
  overlay.claim("cart", $("#closeCart"));
}

export function closeCart() {
  $("#drawer").classList.remove("on");
  $("#drawer").setAttribute("aria-hidden", "true");
  overlay.release("cart");
}

export function isCartOpen() { return $("#drawer").classList.contains("on"); }
