import { $ } from "../lib/dom.js";

/** Shared scrim + scroll lock, so the drawer and modal can't fight over them. */
const open = new Set();
let restoreFocus = null;

export const overlay = {
  claim(name, focusTarget) {
    if (!open.size) {
      restoreFocus = document.activeElement;
      document.body.style.overflow = "hidden";
    }
    open.add(name);
    $("#scrim").classList.add("on");
    focusTarget?.focus();
  },
  release(name) {
    open.delete(name);
    if (!open.size) {
      $("#scrim").classList.remove("on");
      document.body.style.overflow = "";
      restoreFocus?.focus?.();
      restoreFocus = null;
    }
  },
  isOpen: name => open.has(name)
};
