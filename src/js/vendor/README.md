# vendor/

Third-party code, kept local so the site works offline and never depends on
an external CDN for something this small.

## qrcode.mjs

Source: [`qrcode-generator`](https://www.npmjs.com/package/qrcode-generator)
by Kazuhiko Arase. MIT licensed. Pure JS, zero dependencies, generates the
QR matrix only — `src/js/art/qr.js` turns that matrix into the SVG you see
on the checkout screen.

To update: `npm pack qrcode-generator` and copy `dist/qrcode.mjs` over this
file — the public API (`qrcode()`, `.addData()`, `.make()`, `.isDark()`,
`.getModuleCount()`) has been stable for years.
