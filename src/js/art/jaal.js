/** Kashmiri jaal motif — the repeating vine-and-bud from khatamband ceilings. */
export function drawJaal(node) {
  if (!node) return;
  let s = "";
  for (let x = 0; x <= 1200; x += 60) {
    s += `<path d="M${x} 13 q15 -11 30 0 q-15 11 -30 0Z"/><circle cx="${x + 30}" cy="13" r="2.2"/>`;
  }
  node.innerHTML = s;
}
