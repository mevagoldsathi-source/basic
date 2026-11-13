// Placeholder prices (INR per gram). Set your real ones here. Server re-prices every order from this file.
export const PRODUCTS = [
  { id: "mongra", name: "Mongra Kesar", grade: "Grade A++", note: "Crimson stigma tips only", perGram: 520, sizes: [1, 2, 5], status: "live" },
  { id: "lacha", name: "Lacha Kesar", grade: "Grade A+", note: "Whole thread, rich aroma", perGram: 380, sizes: [1, 2, 5], status: "live" },
  { id: "walnut-kernel", name: "Walnut Kernels", grade: "Kupwara", note: "Snow-white halves", status: "soon" },
  { id: "walnut-inshell", name: "Inshell Walnuts", grade: "Sopore", note: "Thin-shelled", status: "soon" },
];
export const SHIP = { freeAbove: 1500, fee: 80 };
export const priceOf = (id, g) => { const p = PRODUCTS.find(x => x.id === id && x.status === "live"); return p && p.sizes.includes(g) ? p.perGram * g : null; };
export const shipFor = sub => (sub === 0 || sub >= SHIP.freeAbove ? 0 : SHIP.fee);
