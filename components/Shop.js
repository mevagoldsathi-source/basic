"use client";
import { useEffect, useState } from "react";
import { priceOf, shipFor } from "@/lib/products";
const inr = n => "₹" + n.toLocaleString("en-IN");
const KEY = "mevagold-cart";

export default function Shop({ products }) {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState({});
  const [f, setF] = useState({ name: "", phone: "", address: "", pincode: "", payment: "upi" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(null);

  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem(KEY)) || []); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(cart)); }, [cart]);

  const lines = cart.map(l => ({ ...l, p: products.find(p => p.id === l.id), unit: priceOf(l.id, l.grams) })).filter(l => l.p && l.unit != null);
  const sub = lines.reduce((s, l) => s + l.unit * l.qty, 0), ship = shipFor(sub), total = sub + ship;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const add = (id, g) => setCart(c => { const i = c.findIndex(x => x.id === id && x.grams === g);
    if (i < 0) return [...c, { id, grams: g, qty: 1 }]; const n = [...c]; n[i] = { ...n[i], qty: n[i].qty + 1 }; return n; });
  const bump = (i, d) => setCart(c => c.map((x, j) => j === i ? { ...x, qty: x.qty + d } : x).filter(x => x.qty > 0));

  async function place(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: { name: f.name, phone: f.phone, address: f.address, pincode: f.pincode }, payment: f.payment,
          items: lines.map(({ id, grams, qty }) => ({ id, grams, qty })) }) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error || "Could not place order.");
      setDone(d); setCart([]); setStep(2);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const live = products.filter(p => p.status === "live"), soon = products.filter(p => p.status !== "live");

  return (<>
    <header className="hdr">
      <a className="logo" href="#top"><b>Mevagold</b><span>Kashmir</span></a>
      <nav className="nav-links" aria-label="Primary">
        <a href="#kesar">Kesar</a><a href="#purity">Spot real kesar</a>
        <a href="#walnut">Walnuts <em className="soon-pill">soon</em></a><a href="#orchard">Our story</a>
      </nav>
      <button className="cart-btn" onClick={() => setOpen(true)} aria-label="Open cart">Cart <em className="cart-count">{count}</em></button>
    </header>

    <main id="top">
      <section className="hero"><div className="hero-in">
        <h1>Kashmir’s <em>red gold</em>,<br />picked by hand.</h1>
        <p className="hero-sub">Deep-crimson Mongra and Lacha kesar from the crocus fields of Pampore — dried with care, sealed fresh and delivered straight to your kitchen.</p>
        <div className="hero-cta"><a className="btn btn-brass" href="#kesar">Shop kesar</a><a className="btn btn-ghost" href="#purity">How to spot real kesar</a></div>
      </div></section>

      <section className="section" id="kesar">
        <div className="sec-head"><h2>Kashmiri kesar</h2><p>Two grades from one valley, sold by the gram in sealed packs.</p></div>
        <div className="catalog">{live.map(p => { const g = pick[p.id] || p.sizes[0]; return (
          <article className="card" key={p.id}>
            <h3>{p.name}</h3><p>{p.grade} · {p.note}</p>
            <p>{inr(p.perGram)}/g</p>
            <div>{p.sizes.map(s => <button key={s} className={"chip" + (s === g ? " on" : "")} onClick={() => setPick({ ...pick, [p.id]: s })}>{s}g</button>)}</div>
            <button className="btn btn-green" onClick={() => { add(p.id, g); setOpen(true); }}>Add {g}g · {inr(p.perGram * g)}</button>
          </article>); })}</div>
      </section>

      <section className="how" id="purity"><div className="section">
        <div className="sec-head"><h2>How to know it’s real</h2><p>Three things you can check at home, with any brand — including ours.</p></div>
        <div className="how-grid">
          <div className="how-card"><h3>The cold-water test</h3><p>Real kesar releases a golden-yellow colour slowly over several minutes while the threads stay red. Dyed threads bleed red straight away.</p></div>
          <div className="how-card"><h3>Aroma &amp; taste</h3><p>Genuine saffron smells floral, like honey and hay, and tastes faintly bitter.</p></div>
          <div className="how-card"><h3>How to use it</h3><p>Soak 8–10 threads in two tablespoons of warm milk or water for 15–20 minutes, then add the whole infusion.</p></div>
        </div></div></section>

      <div className="story" id="orchard"><div className="section"><div>
        <h2>One flower, three threads</h2>
        <p>Each crocus gives only three crimson stigmas, picked by hand within hours of the flower opening.</p>
        <p>Pampore’s karewa soil and cold, clear autumns are why Kashmiri saffron carries a Geographical Indication tag.</p>
      </div></div></div>

      <section className="section soon-section" id="walnut">
        <div className="sec-head"><h2>Walnuts — <em>coming soon</em></h2><p>Kupwara and Sopore walnuts are on their way. Kesar comes first.</p></div>
        <div className="catalog">{soon.map(p => <article className="card soon" key={p.id}>
          <span className="ribbon">Coming soon</span><h3>{p.name}</h3><p>{p.grade} · {p.note}</p>
          <button className="btn" disabled>Coming soon</button></article>)}</div>
      </section>
    </main>
    <footer><div className="foot-note"><span>© {new Date().getFullYear()} Mevagold. All rights reserved.</span><span>Made with ♥ from Kashmir</span></div></footer>

    <div className="scrim" style={{ display: open ? "block" : "none" }} onClick={() => setOpen(false)} />
    <aside className="drawer" style={{ transform: open ? "none" : "translateX(100%)" }} role="dialog" aria-label="Your cart">
      <div className="drawer-top"><h2>Your cart</h2><button className="x" onClick={() => setOpen(false)} aria-label="Close cart">×</button></div>
      <div className="lines">{lines.length === 0 && <p>Your cart is empty.</p>}
        {lines.map((l, i) => <div className="line" key={l.id + l.grams}>
          <b>{l.p.name} · {l.grams}g</b><span>{inr(l.unit * l.qty)}</span>
          <div><button onClick={() => bump(i, -1)}>−</button> {l.qty} <button onClick={() => bump(i, 1)}>+</button></div></div>)}</div>
      {lines.length > 0 && <div className="drawer-foot">
        <div className="row"><span>Subtotal</span><span>{inr(sub)}</span></div>
        <div className="row"><span>Shipping</span><span>{ship ? inr(ship) : "Free"}</span></div>
        <div className="row total"><span>Total</span><span>{inr(total)}</span></div>
        <button className="btn btn-green btn-wide" onClick={() => { setOpen(false); setStep(1); }}>Proceed to checkout</button></div>}
    </aside>

    {step > 0 && <div className="modal" style={{ display: "flex" }} role="dialog" aria-modal="true"><div className="modal-card">
      <div className="modal-head"><div className="modal-title-row"><h2>{step === 1 ? "Delivery details" : "Order placed"}</h2>
        <button className="x" onClick={() => setStep(0)} aria-label="Close">×</button></div></div>
      <div className="modal-body">{step === 1 ? (
        <form onSubmit={place}>
          {[["name", "Full name"], ["phone", "Phone (10 digits)"], ["address", "Address"], ["pincode", "Pincode"]].map(([k, label]) =>
            <label key={k}>{label}<input required value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /></label>)}
          <label><input type="radio" checked={f.payment === "upi"} onChange={() => setF({ ...f, payment: "upi" })} /> UPI (pay after we confirm)</label>
          <label><input type="radio" checked={f.payment === "cod"} onChange={() => setF({ ...f, payment: "cod" })} /> Cash on delivery</label>
          {err && <p role="alert">{err}</p>}
          <button className="btn btn-green btn-wide" disabled={busy}>{busy ? "Placing…" : `Place order · ${inr(total)}`}</button>
        </form>) : (<div><p>Thank you. Your order <b>{done?.orderId}</b> for {inr(done?.total || 0)} is saved.</p>
          <p>We’ll contact you on your phone to confirm.</p></div>)}</div>
    </div></div>}
  </>);
}
