import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb";
import { priceOf, shipFor } from "@/lib/products";

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const c = b.customer || {};
  if (!c.name?.trim() || !/^\d{10}$/.test(c.phone || "") || !c.address?.trim() || !/^\d{6}$/.test(c.pincode || ""))
    return NextResponse.json({ error: "Enter name, 10-digit phone, address and 6-digit pincode." }, { status: 400 });
  if (!["upi", "cod"].includes(b.payment)) return NextResponse.json({ error: "Choose a payment method." }, { status: 400 });
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 20)
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  let subtotal = 0; const items = [];
  for (const i of b.items) {
    const qty = Math.min(Math.max(parseInt(i.qty) || 0, 1), 20);
    const unit = priceOf(i.id, i.grams);
    if (unit == null) return NextResponse.json({ error: "An item in your cart is unavailable." }, { status: 400 });
    subtotal += unit * qty; items.push({ id: i.id, grams: i.grams, qty, unit });
  }
  const shipping = shipFor(subtotal);
  const orderId = "MG" + Date.now().toString(36).toUpperCase();
  await (await db()).collection("orders").insertOne({
    orderId, items, subtotal, shipping, total: subtotal + shipping, payment: b.payment,
    customer: { name: c.name.trim(), phone: c.phone, address: c.address.trim(), pincode: c.pincode },
    status: "new", paid: false, createdAt: new Date(),
  });
  return NextResponse.json({ orderId, total: subtotal + shipping });
}
