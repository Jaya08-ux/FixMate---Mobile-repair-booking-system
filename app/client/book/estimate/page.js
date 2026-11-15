"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const prices = { screen: 4999, battery: 2499, charging: 1799, camera: 2999, water: 3999, other: 1499 };
const money = (amount) => `₹${Number(amount).toLocaleString("en-IN")}`;

export default function EstimatePage() {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);
  useEffect(() => {
    try { const value = JSON.parse(sessionStorage.getItem("fixmate-booking") || "null"); if (!value) router.replace("/client/book"); else setForm(value); } catch { router.replace("/client/book"); }
    const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => setRazorpayReady(true); script.onerror = () => setError("Razorpay checkout could not load. You can still choose Cash on Delivery."); document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [router]);

  async function chooseCOD() {
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not create booking");
      sessionStorage.setItem("fixmate-booking-success", "Your booking has been completed successfully!");
      sessionStorage.removeItem("fixmate-booking"); router.push("/client/dashboard");
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  async function chooseRazorpay() {
    if (!razorpayReady || !window.Razorpay) { setError("Razorpay checkout is not ready yet. Please try again or choose COD."); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/payments/razorpay/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Could not start Razorpay payment");
      const checkout = new window.Razorpay({ key: data.keyId, amount: data.amount, currency: data.currency, name: "FixMate", description: `${form.device} ${form.repairType} repair estimate`, order_id: data.orderId, prefill: { name: data.name, email: data.email }, handler: async (result) => {
        try {
          const verifyResponse = await fetch("/api/payments/razorpay/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: data.bookingId, ...result }) });
          const verified = await verifyResponse.json(); if (!verifyResponse.ok) throw new Error(verified.error || "Payment verification failed");
          sessionStorage.setItem("fixmate-booking-success", "Your booking has been completed and payment confirmed!");
          sessionStorage.removeItem("fixmate-booking"); router.push("/client/dashboard");
        } catch (err) { setError(err.message); }
      }, modal: { ondismiss: () => setSaving(false) } });
      checkout.open();
    } catch (err) { setError(err.message); setSaving(false); }
  }

  if (!form) return <div className="form-page wrap"><div className="empty-state"><span className="loader" />Loading your estimate…</div></div>;
  const amount = prices[form.repairType] || prices.other;
  const pickupLocation = form.pickupLocation === "Other" ? form.customPickupLocation : form.pickupLocation;
  return <div className="form-page wrap"><Link className="back-link" href="/client/book">← Edit repair details</Link><div className="estimate-card booking-form"><div className="form-heading"><span className="step-pill">STEP 02 / ESTIMATE</span><h2>Review your estimate</h2><p>Approximate starting amount for the selected repair.</p></div><div className="estimate-summary"><span>{form.device} · {form.repairType.replaceAll("_", " ")}</span><strong>{money(amount)}</strong><small>{form.issue}</small><small>Appointment: {form.date} · {form.time}</small><small>Phone pickup: {pickupLocation}</small></div><div className="estimate-notice">This is an approximate estimate, not a final quote. A technician will inspect the device and confirm the final price before repair work begins.</div>{error && <div className="notice notice-error">{error}</div>}<div className="payment-actions"><button className="button button-primary form-submit" disabled={saving} onClick={chooseRazorpay}>Pay {money(amount)} with Razorpay <span>↗</span></button><button className="button button-light form-submit" disabled={saving} onClick={chooseCOD}>Book with Cash on Delivery <span>↗</span></button></div><p className="form-footnote">{saving ? "Processing…" : "Razorpay payment is verified securely on the server. COD amount is due after the repair is completed."}</p></div></div>;
}
