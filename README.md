# Mevagold

Premium Kashmiri kesar storefront (walnuts coming soon). Vanilla ES modules, no build step required.

---

## Run it on your machine

You need **any** static file server. Opening `index.html` by double-clicking will
**not** work — browsers block ES modules on `file://`. Pick one:

### Option A — Node (recommended)

```bash
cd mevagold
npx serve . -l 5173
```

Open <http://localhost:5173>. Done.

### Option B — Python (already installed on Mac/Linux)

```bash
cd mevagold
python3 -m http.server 5173
```

### Option C — VS Code

Install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.

### Option D — Vite (when you want hot reload and a production build)

```bash
npm install
npm run dev:vite      # dev server with instant reload
npm run build         # outputs dist/
```

---

## Project layout

```
mevagold/
├─ index.html                  markup only — no logic, no styles
├─ package.json                scripts + optional Vite
├─ netlify.toml                deploy + function config
├─ .env.example                copy to .env if you use the serverless function
│
├─ public/assets/              photos, real UPI QR, favicon
│
├─ src/
│  ├─ styles/
│  │  ├─ main.css              entry — imports everything below in order
│  │  ├─ tokens.css            colours, type, spacing. Rebrand starts here.
│  │  ├─ base.css              reset, layout shell, buttons, toast
│  │  ├─ header.css  hero.css  catalog.css  sections.css
│  │  └─ cart.css    checkout.css
│  │
│  └─ js/
│     ├─ main.js               entry — wires modules, owns nothing
│     ├─ config.js             ⭐ business settings: prices policy, UPI, WhatsApp
│     ├─ data/products.js      ⭐ the catalogue
│     ├─ lib/                  dom, format, storage, validate  (pure helpers)
│     ├─ ui/                   catalog, cart, checkout, header, toast, overlay
│     ├─ art/                  generated product SVGs, QR, jaal motif
│     ├─ three/hero.js         hero gold-dust scene
│     └─ services/
│        ├─ orderModel.js      canonical order shape + text/row formatters
│        ├─ orderGateway.js    picks an adapter, falls back on failure
│        └─ adapters/          handoff · formspree · sheets · api
│
├─ server/
│  ├─ netlify/functions/order.js      optional serverless receiver
│  └─ google-apps-script/Code.gs      Google Sheets order log
│
└─ docs/DEPLOY.md              step-by-step go-live guide
```

**The rule that keeps this scalable:** UI modules never talk to the network, and
service modules never touch the DOM. `main.js` is the only file that imports both.

---

## Before you go live

Everything you need to change lives in two files.

### `src/js/config.js`

| Setting | Replace with |
|---|---|
| `whatsapp` | your number, digits only, with country code — `919XXXXXXXXX` |
| `founderEmail` | the inbox that should receive orders |
| `payment.upiId` | your real UPI ID |
| `payment.accountName` / `accountNumber` / `ifsc` / `bank` | your bank details |
| `payment.qrImage` | `"/public/assets/upi-qr.png"` after you save your QR there |
| `shipping.flat` / `freeAbove` | your actual delivery policy |
| `ACTIVE_CHANNEL` | see *Order routing* below |

### `src/js/data/products.js`

Prices, names, descriptions, weights. Each product has a `category` ("kesar" or "walnut") and a `status` ("live" or "soon"). To launch walnuts, set their status to `"live"`. Adding a product is one more object
in the array — the grid, cart and checkout all pick it up automatically.

---

## Order routing

`ACTIVE_CHANNEL` in `config.js` decides where a placed order goes. All four
adapters receive the identical order object, so switching is a one-word change.

| Channel | Needs | Good for |
|---|---|---|
| `handoff` *(default)* | nothing | Day one. Formats the order and opens WhatsApp/email for the customer to send. |
| `formspree` | free Formspree form ID | Orders land in your inbox automatically. |
| `sheets` | Apps Script web app URL | A live order sheet you can filter and mark shipped. |
| `api` | Netlify function deployed | Server-side validation before anything else. |

If a network channel fails, the gateway falls back to `handoff` rather than
losing the order.

---

## Deploying

See **[docs/DEPLOY.md](docs/DEPLOY.md)** for the full walkthrough.

Shortest path: push to GitHub → connect the repo on Netlify → publish
directory `.` → done. No build command needed.
