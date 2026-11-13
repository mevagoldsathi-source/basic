# Going live

Three stages. Do them in order; each one works on its own.

---

## Stage 0 — verify locally

```bash
cd mevagold
npx serve . -l 5173
```

Walk the whole flow once at <http://localhost:5173>:

- [ ] Snow renders in the hero and follows your cursor
- [ ] Weight buttons change the price and the per-100g line
- [ ] Add to cart opens the drawer, counter increments
- [ ] Quantity +/− and Remove work, totals recalculate
- [ ] Free-shipping threshold flips at ₹1,500
- [ ] Refresh the page — the cart survives
- [ ] Checkout rejects a bad phone number and a 5-digit pincode
- [ ] Payment step shows your UPI details, rejects a short transaction ID
- [ ] Confirmation shows an order ID and a working WhatsApp link
- [ ] Resize to a 375px-wide window and repeat

Open DevTools → Console. It should be empty.

---

## Stage 1 — put it on the internet

### Netlify (easiest, free, custom domain included)

```bash
cd mevagold
git init
git add .
git commit -m "Mevagold storefront"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mevagold.git
git branch -M main
git push -u origin main
```

On [netlify.com](https://netlify.com): **Add new site → Import an existing project
→ GitHub → mevagold**.

| Field | Value |
|---|---|
| Build command | *(leave empty)* |
| Publish directory | `.` |
| Functions directory | `server/netlify/functions` |

Deploy. You get `something-random.netlify.app` immediately.
Every `git push` redeploys automatically.

### Alternatives

- **Vercel** — same flow, framework preset "Other", output directory `.`
- **Cloudflare Pages** — build command empty, output directory `/`
- **GitHub Pages** — free but no serverless functions, so stay on `handoff` or `sheets`
- **Hostinger / any cPanel host** — upload the folder contents to `public_html/` over FTP

---

## Stage 2 — your domain

Buy `mevagold.in` (BigRock, GoDaddy, Namecheap, or Cloudflare Registrar —
cheapest and no upsells).

In Netlify: **Domain settings → Add custom domain**. Then at your registrar,
point the nameservers at Netlify's, or add:

```
A      @      75.2.60.5
CNAME  www    your-site.netlify.app
```

HTTPS provisions itself within an hour. `.in` domains run about ₹700/year.

---

## Stage 3 — automate the orders

You launched on `handoff`, where the customer taps a button to send you the
order. That's fine for the first fifty. When it gets tiring:

### Option A — Formspree (10 minutes, orders by email)

1. Sign up at [formspree.io](https://formspree.io), create a form, copy the ID
2. In `src/js/config.js`:
   ```js
   ACTIVE_CHANNEL: "formspree",
   endpoints: { formspree: "https://formspree.io/f/YOUR_ID", ... }
   ```
3. Push. Free tier covers 50 submissions/month.

### Option B — Google Sheets (30 minutes, a real order book)

Follow the setup comment at the top of `server/google-apps-script/Code.gs`.
Then set `ACTIVE_CHANNEL: "sheets"` and paste your `/exec` URL.

You get a filterable sheet with a `status` column — mark rows SHIPPED as you
pack them. This is what you want once you're doing a few orders a day.

### Option C — your own function (server-side validation)

The Netlify function is already in the repo. Set `ACTIVE_CHANNEL: "api"`,
add `SHEETS_WEBHOOK_URL` under **Site settings → Environment variables**, push.

It recomputes the subtotal server-side, so a customer editing prices in DevTools
can't underpay.

---

## When payments outgrow UPI screenshots

Razorpay accepts individuals and sole proprietors and takes about 2% per
transaction. You'll need PAN, a bank account and a GST number (or a declaration
if you're below the threshold).

When you get approved, write `src/js/services/adapters/razorpay.js` with the
same `{ name, async send(order) }` shape, register it in `orderGateway.js`, and
flip `ACTIVE_CHANNEL`. The cart, catalogue and checkout UI don't change at all.
That's the whole point of the adapter layer.

---

## Housekeeping before launch

- [ ] Real product photos in `public/assets/`, wired up in `data/products.js`
- [ ] Real UPI QR at `public/assets/upi-qr.png`, `qrImage` set in `config.js`
- [ ] Add `og-cover.jpg` and an `<meta property="og:image">` tag so WhatsApp
      link previews look right — this matters a lot for how you'll actually sell
- [ ] Write Shipping, Returns and Privacy pages. Razorpay and most gateways
      require them, and buyers look for them.
- [ ] Test the WhatsApp link on a real phone, not just desktop
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) on the live URL
