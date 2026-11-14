import { NextResponse } from "next/server";
import { createBooking, listBookings } from "../../../lib/bookings";
import { getCurrentUser } from "../../../lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to view bookings." }, { status: 401 });
    return NextResponse.json(await listBookings(user));
  } catch (error) {
    console.error("Could not load bookings:", error);
    return NextResponse.json({ error: "Could not load bookings. Check MongoDB settings." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in before booking a repair." }, { status: 401 });
    if (user.role !== "client") return NextResponse.json({ error: "Only client accounts can create bookings." }, { status: 403 });
    const body = await request.json();
    const required = ["device", "issue", "date"];
    if (required.some((field) => !String(body[field] || "").trim())) {
      return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
    }
    const booking = await createBooking({ user, device: String(body.device), issue: String(body.issue), date: String(body.date), time: String(body.time || "Flexible") });
    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Could not create booking:", error);
    return NextResponse.json({ error: "Could not save booking. Check MongoDB settings." }, { status: 500 });
  }
}
