# Assets

Drop real files here and point to them from config/data:

| File | Used by |
|---|---|
| `upi-qr.png` | set `CONFIG.payment.qrImage = "/public/assets/upi-qr.png"` in `src/js/config.js` |
| `kernels.jpg` | set `image: "/public/assets/kernels.jpg"` on the product in `src/js/data/products.js` |
| `inshell.jpg` | same, for the inshell product |
| `og-cover.jpg` | add `<meta property="og:image">` in `index.html` |

Product photos: shoot 4:3, minimum 1200×900, and compress to under 250 KB
(squoosh.app) so the catalogue stays fast on Jio 4G.
