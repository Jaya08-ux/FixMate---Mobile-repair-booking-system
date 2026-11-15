import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { createBooking } from "../../../../../lib/bookings";
import { estimateRepair } from "../../../../../lib/pricing";
import { resolvePickupLocation } from "../../../../../lib/locations";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "client") return NextResponse.json({ error: "Please sign in with a client account." }, { status: 401 });
    const body = await request.json();
    if (!["device", "issue", "date"].every((field) => String(body[field] || "").trim())) return NextResponse.json({ error: "Please complete your repair details first." }, { status: 400 });
    const pickupLocation = resolvePickupLocation(body);
    if (!pickupLocation) return NextResponse.json({ error: "Please select or enter a valid phone pickup location." }, { status: 400 });
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return NextResponse.json({ error: "Razorpay is not configured yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel settings, or choose COD." }, { status: 503 });
    const estimate = estimateRepair(String(body.repairType || "other"));
    const orderResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: estimate * 100, currency: "INR", receipt: `fixmate_${Date.now()}`, notes: { customer_email: user.email, device: String(body.device).slice(0, 80) } }), cache: "no-store",
    });
    const order = await orderResponse.json();
    if (!orderResponse.ok) { console.error("Razorpay order failed:", order.error?.description || order.status); return NextResponse.json({ error: "Razorpay could not create the payment order." }, { status: 502 }); }
    const booking = await createBooking({ user, device: String(body.device), issue: String(body.issue), date: String(body.date), time: String(body.time || "Flexible"), repairType: String(body.repairType || "other"), estimatedAmount: estimate, paymentMethod: "Razorpay", paymentStatus: "Payment pending", razorpayOrderId: order.id, pickupLocation });
    return NextResponse.json({ keyId, amount: order.amount, currency: order.currency, orderId: order.id, bookingId: booking._id, name: user.name, email: user.email });
  } catch (error) {
    console.error("Could not create Razorpay order:", error);
    return NextResponse.json({ error: "Could not start payment. Please try again or choose COD." }, { status: 500 });
  }
}
