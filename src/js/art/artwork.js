/**
 * Generated SVG stand-ins for product photography.
 * When your orchard shoot is ready, set `image` on the product in
 * data/products.js and this module steps aside automatically.
 */
export function artwork(product, seed = 1) {
  if (product.image) {
    return `<img src="${product.image}" alt="${product.name}" loading="lazy">`;
  }
  if (product.art === "kesar-mongra") return kesarArt(seed, "mongra");
  if (product.art === "kesar-lacha")  return kesarArt(seed, "lacha");
  return product.art === "kernel" ? kernelArt(seed) : shellArt(seed);
}

const rings = () =>
  Array.from({ length: 7 }, (_, i) => `<circle cx="200" cy="150" r="${28 + i * 26}"/>`).join("");

function kernelArt(seed) {
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Snow-white walnut kernel halves">
    <defs>
      <radialGradient id="kg${seed}" cx="50%" cy="42%"><stop offset="0" stop-color="#F2E6D2"/><stop offset="1" stop-color="#C6A87F"/></radialGradient>
      <linearGradient id="kbg${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E4A2F"/><stop offset="1" stop-color="#072718"/></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#kbg${seed})"/>
    <g opacity=".14" stroke="#F4F7F6" fill="none">${rings()}</g>
    ${[[200,148,78],[112,206,50],[294,204,50]].map(([cx,cy,r],i)=>`
      <g transform="translate(${cx} ${cy}) rotate(${i*23-16})">
        <path d="M0 -${r} C ${r*.92} -${r*.86}, ${r*.92} ${r*.86}, 0 ${r} C -${r*.92} ${r*.86}, -${r*.92} -${r*.86}, 0 -${r} Z" fill="url(#kg${seed})"/>
        <g stroke="#9C7C55" fill="none" stroke-width="${r*.035}" opacity=".85">
          <path d="M0 -${r*.9} V ${r*.9}"/>
          ${Array.from({length:6},(_,j)=>{const y=-r*.68+j*(r*1.36/5);
            return `<path d="M0 ${y} C ${r*.3} ${y-r*.16}, ${r*.52} ${y-r*.08}, ${r*.66} ${y+r*.06}"/>
                    <path d="M0 ${y} C -${r*.3} ${y-r*.16}, -${r*.52} ${y-r*.08}, -${r*.66} ${y+r*.06}"/>`}).join("")}
        </g>
      </g>`).join("")}
  </svg>`;
}

function shellArt(seed) {
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Inshell Kashmiri walnuts">
    <defs>
      <radialGradient id="sg${seed}" cx="40%" cy="34%"><stop offset="0" stop-color="#A8845C"/><stop offset="1" stop-color="#5C4033"/></radialGradient>
      <linearGradient id="sbg${seed}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E4A2F"/><stop offset="1" stop-color="#072718"/></linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#sbg${seed})"/>
    <g opacity=".14" stroke="#F4F7F6" fill="none">${rings()}</g>
    ${[[198,152,74],[104,208,48],[300,200,52],[262,92,38]].map(([cx,cy,r],i)=>`
      <g transform="translate(${cx} ${cy}) rotate(${i*31-20})">
        <ellipse rx="${r}" ry="${r*.93}" fill="url(#sg${seed})"/>
        <path d="M0 -${r*.93} V ${r*.93}" stroke="#3D2A22" stroke-width="${r*.05}" fill="none"/>
        <g stroke="#3D2A22" fill="none" stroke-width="${r*.028}" opacity=".6">
          ${Array.from({length:9},(_,j)=>{const a=(j/9)*Math.PI*2;
            return `<path d="M${Math.cos(a)*r*.22} ${Math.sin(a)*r*.22} Q ${Math.cos(a)*r*.62} ${Math.sin(a)*r*.38}, ${Math.cos(a)*r*.84} ${Math.sin(a)*r*.8}"/>`}).join("")}
        </g>
        <ellipse rx="${r}" ry="${r*.93}" fill="none" stroke="#3D2A22" stroke-width="${r*.04}" opacity=".5"/>
      </g>`).join("")}
  </svg>`;
}

/* Saffron threads: crimson stigmas with orange tips fanning over a crocus-violet glow.
   Deterministic per seed so each card looks hand-arranged but never changes on re-render. */
function kesarArt(seed, variant) {
  let h = 7; for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  h = (h + (variant === "mongra" ? 11 : 97)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 4294967296);
  const id = `k${variant}${seed}`;
  const count = variant === "mongra" ? 26 : 17;
  const pt = (a, b, c, t) => (1-t)*(1-t)*a + 2*(1-t)*t*b + t*t*c;
  let strands = "";
  for (let i = 0; i < count; i++) {
    const ang = (-64 + (128 * i) / (count - 1)) * Math.PI / 180 + (rnd() - .5) * .12;
    const len = 120 + rnd() * 52;
    const x0 = 200 + (rnd() - .5) * 26, y0 = 268;
    const x2 = x0 + Math.sin(ang) * len, y2 = y0 - Math.cos(ang) * len;
    const cx = x0 + Math.sin(ang) * len * .35 + (rnd() - .5) * 38, cy = y0 - Math.cos(ang) * len * .6;
    const bx = pt(x0, cx, x2, .8), by = pt(y0, cy, y2, .8);
    const sx = pt(x0, cx, x2, .3), sy = pt(y0, cy, y2, .3);
    const w = (variant === "mongra" ? 3.4 : 3) + rnd() * 1.1;
    strands += `<path d="M${x0} ${y0} Q${cx} ${cy} ${x2} ${y2}" stroke="${variant === "mongra" ? "#A50E1B" : "#B3261E"}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
    strands += `<path d="M${bx} ${by} L${x2} ${y2}" stroke="#E8731A" stroke-width="${w + 1.6}" fill="none" stroke-linecap="round"/>`;
    if (variant === "lacha") strands += `<path d="M${x0} ${y0} L${sx} ${sy}" stroke="#E9C46A" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  }
  const petals = [-38, 0, 38].map(r =>
    `<ellipse cx="200" cy="168" rx="34" ry="104" transform="rotate(${r} 200 268)" fill="#7A4DB8" opacity=".22"/>`).join("");
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${variant === "mongra" ? "Mongra" : "Lacha"} Kashmiri saffron threads">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A1344"/><stop offset="1" stop-color="#072718"/></linearGradient></defs>
    <rect width="400" height="300" fill="url(#${id})"/>
    <g opacity=".12" stroke="#F4F7F6" fill="none">${rings()}</g>
    ${petals}${strands}
  </svg>`;
}
