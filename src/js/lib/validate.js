/** Returns an empty string when valid, otherwise a message for the customer. */
export function validateCustomer(v) {
  if (v.name.length < 3) return "Enter the name the parcel should be addressed to.";
  if (!/^(\+?91)?[6-9]\d{9}$/.test(v.phone)) return "Enter a valid 10-digit Indian mobile number.";
  if (v.address.length < 12) return "Add a fuller address — house, street and a landmark help our courier.";
  if (!v.city) return "Enter your city or district.";
  if (!/^\d{6}$/.test(v.pincode)) return "Pincode must be 6 digits.";
  return "";
}

export function validatePaymentRef(ref) {
  if (ref.trim().length < 6) return "Enter the transaction ID from your payment app so we can verify it.";
  return "";
}
