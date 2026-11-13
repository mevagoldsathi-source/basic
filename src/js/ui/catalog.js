import { inCategory } from "../data/products.js";
import { artwork } from "../art/artwork.js";
import { money, gramsOf } from "../lib/format.js";
import { $$, el } from "../lib/dom.js";

/** Renders one category of products into `container`. */
export function initCatalog({ container, category, onAdd }) {
  if (!container) return;
  container.innerHTML = "";
  inCategory(category).forEach((product, index) => {
    container.appendChild(product.status === "soon"
      ? soonCard(product, index)
      : liveCard(product, index, onAdd));
  });
}

function liveCard(product, index, onAdd) {
  const keys = Object.keys(product.prices);
  let weight = keys[Math.min(1, keys.length - 1)];
  const card = el("article", "card", `
    <div class="card-art">${artwork(product, `${product.id}${index}`)}<span class="card-tag">${product.tag}</span></div>
    <div class="card-body">
      <h3>${product.name}</h3>
      <p class="card-desc">${product.desc}</p>
      <div class="notes">${product.notes.map(n => `<span>${n}</span>`).join("")}</div>
      <div class="weights" role="group" aria-label="Choose weight for ${product.name}">
        ${keys.map(w => `<button class="wt" data-w="${w}">${w}</button>`).join("")}
      </div>
      <div class="buyline">
        <div class="price" data-price></div>
        <button class="btn btn-green" data-add>Add to cart</button>
      </div>
    </div>`);

  const priceEl = card.querySelector("[data-price]");
  const paint = () => {
    const price = product.prices[weight];
    const g = gramsOf(weight);
    // Saffron is sold by the gram; bulk goods by 100g.
    const unit = g <= 20 ? `${money(Math.round(price / g))} per gram` : `${money(Math.round(price / g * 100))} per 100g`;
    priceEl.innerHTML = `${money(price)}<small>${weight} · ${unit}</small>`;
    $$(".wt", card).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.w === weight)));
  };
  $$(".wt", card).forEach(b => b.addEventListener("click", () => { weight = b.dataset.w; paint(); }));
  card.querySelector("[data-add]").addEventListener("click", () => onAdd(product.id, weight));
  paint();
  return card;
}

function soonCard(product, index) {
  return el("article", "card soon", `
    <div class="card-art">${artwork(product, `${product.id}${index}`)}
      <span class="card-tag">${product.tag}</span><span class="ribbon">Coming soon</span></div>
    <div class="card-body">
      <h3>${product.name}</h3>
      <p class="card-desc">${product.desc}</p>
      <div class="buyline"><span class="soon-note">Not yet available</span>
        <button class="btn btn-line" disabled>Coming soon</button></div>
    </div>`);
}
