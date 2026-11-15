import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { getBookingsCollection } from "../../../../../lib/db";
import { updateBookingPayment } from "../../../../../lib/bookings";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "client") return NextResponse.json({ error: "Please sign in to verify payment." }, { status: 401 });
    const { bookingId, razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = await request.json();
    if (!ObjectId.isValid(bookingId) || !orderId || !paymentId || !signature) return NextResponse.json({ error: "Payment details are incomplete." }, { status: 400 });
    const bookings = await getBookingsCollection();
    const booking = await bookings.findOne({ _id: new ObjectId(bookingId), email: user.email, paymentMethod: "Razorpay", razorpayOrderId: orderId });
    if (!booking) return NextResponse.json({ error: "Payment order does not match this booking." }, { status: 400 });
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ error: "Razorpay verification is not configured." }, { status: 503 });
    const expected = createHmac("sha256", secret).update(`${booking.razorpayOrderId}|${paymentId}`).digest();
    let received;
    try { received = Buffer.from(signature, "hex"); } catch { received = Buffer.alloc(0); }
    if (received.length !== expected.length || !timingSafeEqual(received, expected)) return NextResponse.json({ error: "Razorpay payment signature is invalid." }, { status: 400 });
    await updateBookingPayment(bookingId, { paymentStatus: "Paid", razorpayPaymentId: paymentId, paidAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Could not verify Razorpay payment:", error);
    return NextResponse.json({ error: "Could not verify payment. Contact FixMate support before retrying." }, { status: 500 });
  }
}
