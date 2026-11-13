/**
 * Product catalogue.
 *   category: "kesar" | "walnut"   → which section of the page it appears in
 *   status:   "live" | "soon"      → "soon" renders a dimmed, non-purchasable card
 *   art:      "kesar-mongra" | "kesar-lacha" | "kernel" | "shell"
 *   image:    optional path (e.g. "/public/assets/mongra.jpg"), overrides art
 *
 * To launch walnuts later: set status to "live". Nothing else changes.
 * Prices below are placeholders — set your real ones.
 */
export const PRODUCTS = [
  {
    id: "kesar-mongra",
    category: "kesar",
    status: "live",
    name: "Mongra Kashmiri Kesar",
    tag: "Grade A++ · Mongra",
    desc: "Direct from the crocus fields of Pampore. Only the deep-crimson stigma tips, no pale style — the strongest colour, aroma and flavour a thread can carry.",
    notes: ["GI-tagged origin", "Hand-picked", "Air-dried"],
    art: "kesar-mongra",
    image: null,
    prices: { "1g": 549, "2g": 1049, "5g": 2499 }
  },
  {
    id: "kesar-lacha",
    category: "kesar",
    status: "live",
    name: "Lacha Kashmiri Kesar",
    tag: "Grade A+ · Lacha",
    desc: "Hand-picked Pampore stigmas with a touch of the pale style left on. Rich colour and fragrance at a friendlier price — made for everyday kitchens.",
    notes: ["GI-tagged origin", "Hand-picked", "Air-dried"],
    art: "kesar-lacha",
    image: null,
    prices: { "1g": 399, "2g": 749, "5g": 1799 }
  },
  {
    id: "kernels",
    category: "walnut",
    status: "soon",
    name: "Premium Snow-White Walnut Kernels",
    tag: "Light halves",
    desc: "Pale, unbroken halves from Kupwara orchards with a high oil content.",
    notes: ["Shade-dried", "Unbleached"],
    art: "kernel",
    image: null,
    prices: { "250g": 749, "500g": 1399, "1kg": 2599 }
  },
  {
    id: "inshell",
    category: "walnut",
    status: "soon",
    name: "Elite Kashmiri Inshell Walnuts",
    tag: "Paper-thin shell",
    desc: "Thin-shelled, easy-to-crack walnuts from Sopore orchards.",
    notes: ["Sun-cured", "Unpolished"],
    art: "shell",
    image: null,
    prices: { "250g": 349, "500g": 649, "1kg": 1199 }
  }
];

export const byId = id => PRODUCTS.find(p => p.id === id);
export const inCategory = c => PRODUCTS.filter(p => p.category === c);
