import { $ } from "../lib/dom.js";

let timer;
export function toast(message) {
  const node = $("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("on");
  clearTimeout(timer);
  timer = setTimeout(() => node.classList.remove("on"), 2400);
  const live = $("#live");
  if (live) live.textContent = message;
}
