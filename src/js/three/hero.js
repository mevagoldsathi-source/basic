/**
 * Hero scene: warm gold dust rising slowly through green-black fog,
 * three depth layers, camera parallaxing to the pointer.
 * Three.js is a global <script> in index.html; if the CDN is blocked this
 * quietly does nothing and the hero stays a clean gradient.
 */
const LAYERS = [
  { count: 520, size: 0.20, z: -26, opacity: 0.50, speed: 0.016, color: 0xC9962A },
  { count: 340, size: 0.38, z: -10, opacity: 0.75, speed: 0.030, color: 0xE3A82B },
  { count: 120, size: 0.75, z:   6, opacity: 0.90, speed: 0.052, color: 0xF6D27A }
];

export function initHero(canvas, heroEl) {
  const THREE = window.THREE;
  if (!THREE || !canvas) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x072718, 0.05);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 120);
  camera.position.z = 22;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const sprite = new THREE.CanvasTexture(moteTexture());
  const layers = LAYERS.map(spec => {
    const pos = new Float32Array(spec.count * 3), seeds = new Float32Array(spec.count);
    for (let i = 0; i < spec.count; i++) {
      pos[i*3]   = (Math.random() - .5) * 90;
      pos[i*3+1] = (Math.random() - .5) * 70;
      pos[i*3+2] = spec.z + (Math.random() - .5) * 14;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: spec.size, map: sprite, color: spec.color, transparent: true, opacity: spec.opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);
    return { points, seeds, speed: spec.speed };
  });

  let px = 0, py = 0, t = 0, running = true, raf = null;
  const onPointer = e => { px = e.clientX / innerWidth - .5; py = e.clientY / innerHeight - .5; };
  const onResize = () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("resize", onResize);

  function frame() {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    t += 0.01;
    for (const { points, seeds, speed } of layers) {
      const attr = points.geometry.attributes.position, a = attr.array;
      for (let i = 0; i < seeds.length; i++) {
        a[i*3+1] += speed * (reduce ? .15 : 1);                 // rises
        a[i*3]   += Math.sin(t + seeds[i]) * 0.008;
        if (a[i*3+1] > 35) { a[i*3+1] = -35; a[i*3] = (Math.random() - .5) * 90; }
      }
      attr.needsUpdate = true;
    }
    camera.position.x += (px * 3 - camera.position.x) * .035;
    camera.position.y += (-py * 2 - camera.position.y) * .035;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  frame();

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; frame(); }
    else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: .02 });
  if (heroEl) io.observe(heroEl);

  return () => {
    running = false; cancelAnimationFrame(raf); io.disconnect();
    removeEventListener("pointermove", onPointer); removeEventListener("resize", onResize);
    renderer.dispose();
  };
}

function moteTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const g = c.getContext("2d"), grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,244,214,1)");
  grad.addColorStop(.35, "rgba(246,210,122,.7)");
  grad.addColorStop(1, "rgba(246,210,122,0)");
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  return c;
}
