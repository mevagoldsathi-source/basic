export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function el(tag, className, html) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (html != null) n.innerHTML = html;
  return n;
}

export function on(node, evt, fn, opts) {
  node && node.addEventListener(evt, fn, opts);
  return () => node && node.removeEventListener(evt, fn, opts);
}
