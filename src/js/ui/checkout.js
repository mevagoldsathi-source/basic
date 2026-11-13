import { CONFIG } from "../config.js";
import { money, esc, newOrderId } from "../lib/format.js";
import { validateCustomer, validatePaymentRef } from "../lib/validate.js";
import { $, on } from "../lib/dom.js";
import { qrMarkup } from "../art/qr.js";
import { cart } from "./cart.js";
import { toast } from "./toast.js";
import { overlay } from "./overlay.js";
import { OrderGateway, waLink, mailLink } from "../services/orderGateway.js";
import { buildOrder, orderToText } from "../services/orderModel.js";

/**
 * Three steps: delivery details → payment → confirmation.
 * Each step renders into #modalBody; nothing else in the app knows
 * about the internals of the flow.
 */
export const checkout = {
  step: 1,
  customer: { name: "", phone: "", address: "", city: "", pincode: "" },
  payment: { ref: "", fileName: "" },
  orderId: "",
  order: null,

  open() {
    if (!cart.items.length) return toast("Your cart is empty");
    this.step = 1;
    this.orderId = newOrderId();
    $("#modal").classList.add("on");
    $("#modal").setAttribute("aria-hidden", "false");
    overlay.claim("checkout");
    this.render();
  },

  close() {
    $("#modal").classList.remove("on");
    $("#modal").setAttribute("aria-hidden", "true");
    overlay.release("checkout");
  },

  isOpen() { return $("#modal").classList.contains("on"); },

  go(step) { this.step = step; this.render(); },

  render() {
    ["s1", "s2", "s3"].forEach((id, i) => $("#" + id).classList.toggle("on", i < this.step));
    const body = $("#modalBody");
    body.innerHTML = "";
    if (this.step === 1) this.renderDetails(body);
    if (this.step === 2) this.renderPayment(body);
    if (this.step === 3) this.renderDone(body);
    $(".modal-card").scrollTop = 0;
  },

  /* ---------- step 1 ---------- */
  renderDetails(body) {
    $("#mTitle").textContent = "Delivery details";
    const c = this.customer;
    body.innerHTML = `
      <div class="field"><label for="f-name">Full name</label>
        <input id="f-name" autocomplete="name" value="${esc(c.name)}" placeholder="Aaqib Rather"></div>
      <div class="field"><label for="f-phone">Phone number</label>
        <input id="f-phone" type="tel" inputmode="numeric" autocomplete="tel" value="${esc(c.phone)}" placeholder="10-digit mobile"></div>
      <div class="field"><label for="f-addr">Shipping address</label>
        <textarea id="f-addr" autocomplete="street-address" placeholder="House, street, locality, landmark">${esc(c.address)}</textarea></div>
      <div class="two">
        <div class="field"><label for="f-city">City / district</label>
          <input id="f-city" autocomplete="address-level2" value="${esc(c.city)}" placeholder="Srinagar"></div>
        <div class="field"><label for="f-pin">Pincode</label>
          <input id="f-pin" inputmode="numeric" maxlength="6" autocomplete="postal-code" value="${esc(c.pincode)}" placeholder="190001"></div>
      </div>
      <p class="err" id="f-err"></p>
      <div class="row total"><span>Total</span><span>${money(cart.total())}</span></div>
      <button class="btn btn-green btn-wide" id="toPay">Continue to payment</button>
      <p class="ship-note">We only use your number to confirm the parcel and share tracking.</p>`;

    on($("#toPay"), "click", () => {
      const values = {
        name: $("#f-name").value.trim(),
        phone: $("#f-phone").value.replace(/\s/g, ""),
        address: $("#f-addr").value.trim(),
        city: $("#f-city").value.trim(),
        pincode: $("#f-pin").value.trim()
      };
      const problem = validateCustomer(values);
      if (problem) { $("#f-err").textContent = problem; return; }
      this.customer = values;
      this.go(2);
    });
  },

  /* ---------- step 2 ---------- */
  renderPayment(body) {
    $("#mTitle").textContent = "Pay & confirm";
    const P = CONFIG.payment;
    body.innerHTML = `
      <div class="amount-due"><span>Amount to pay</span><b>${money(cart.total())}</b></div>
      <div class="pay-grid">
        <div class="qr">${qrMarkup({ amount: cart.total(), note: this.orderId })}<div class="qr-cap">${esc(P.upiId)}</div></div>
        <div class="bank">
          <div><span>Account name</span><span>${esc(P.accountName)}</span></div>
          <div><span>Account number</span><span>${esc(P.accountNumber)}</span></div>
          <div><span>IFSC</span><span>${esc(P.ifsc)}</span></div>
          <div><span>Bank</span><span>${esc(P.bank)}</span></div>
        </div>
      </div>
      <p class="ship-note">Scan the code in any UPI app, or transfer the exact amount to the account above. Then drop the reference below so we can match your parcel.</p>
      <div class="field"><label for="f-ref">UPI / UTR transaction ID</label>
        <input id="f-ref" value="${esc(this.payment.ref)}" placeholder="e.g. 412398457712"></div>
      <label class="file-drop" for="f-shot">
        <b id="shotLabel">${this.payment.fileName ? esc(this.payment.fileName) : "Attach payment screenshot"}</b>
        <small>Optional · JPG or PNG</small>
        <input id="f-shot" type="file" accept="image/*">
      </label>
      <p class="err" id="p-err"></p>
      <div class="two">
        <button class="btn btn-line" id="backStep">Back</button>
        <button class="btn btn-green" id="placeOrder">Place order</button>
      </div>`;

    on($("#f-shot"), "change", e => {
      const file = e.target.files[0];
      if (!file) return;
      this.payment.fileName = file.name;
      $("#shotLabel").textContent = file.name;
    });

    on($("#backStep"), "click", () => this.go(1));

    on($("#placeOrder"), "click", async () => {
      const ref = $("#f-ref").value.trim();
      const problem = validatePaymentRef(ref);
      if (problem) { $("#p-err").textContent = problem; return; }
      this.payment.ref = ref;

      const button = $("#placeOrder");
      button.disabled = true;
      button.textContent = "Placing order…";

      this.order = buildOrder({
        orderId: this.orderId,
        customer: this.customer,
        payment: this.payment,
        cart
      });
      await OrderGateway.send(this.order);
      this.go(3);
    });
  },

  /* ---------- step 3 ---------- */
  renderDone(body) {
    $("#mTitle").textContent = "Order placed";
    const o = this.order;
    body.innerHTML = `
      <div class="done">
        <div class="seal"><svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5"/></svg></div>
        <h3>Thank you, ${esc(o.customer.name.split(" ")[0])}</h3>
        <div class="order-id">${o.orderId}</div>
        <p>We'll verify your payment reference and confirm on WhatsApp within a few hours. Your walnuts are packed the morning they ship.</p>
        <div class="channels">
          <a class="btn btn-green btn-wide" href="${waLink(o)}" target="_blank" rel="noopener">Send order on WhatsApp</a>
          <a class="btn btn-line btn-wide" href="${mailLink(o)}">Email the order instead</a>
          <button class="btn btn-line btn-wide" id="copyOrder">Copy order summary</button>
        </div>
        <p class="ship-note">Keep your order number handy for any follow-up.</p>
      </div>`;

    on($("#copyOrder"), "click", async () => {
      try {
        await navigator.clipboard.writeText(orderToText(o));
        toast("Order summary copied");
      } catch {
        toast("Copy blocked by the browser — use WhatsApp or email");
      }
    });

    cart.clear();
  }
};
