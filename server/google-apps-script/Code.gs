/**
 * Google Sheets order log — the Phase-2 destination.
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet named "Mevagold Orders".
 *  2. Extensions → Apps Script, paste this file, save.
 *  3. Deploy → New deployment → type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *  4. Copy the /exec URL into CONFIG.endpoints.sheets in src/js/config.js
 *     and set CONFIG.ACTIVE_CHANNEL = "sheets".
 */
const HEADERS = [
  "orderId", "placedAt", "name", "phone", "address", "city", "pincode",
  "items", "subtotal", "shipping", "total", "paymentRef", "screenshot", "status"
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const row = payload.row || payload;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  sheet.appendRow([
    row.orderId, row.placedAt, row.name, row.phone, row.address, row.city,
    row.pincode, row.items, row.subtotal, row.shipping, row.total,
    row.paymentRef, row.screenshot, "PENDING VERIFICATION"
  ]);

  // Optional: also email yourself
  // MailApp.sendEmail("orders@mevagold.com", "New order " + row.orderId, JSON.stringify(row, null, 2));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("Mevagold order endpoint is live.");
}
