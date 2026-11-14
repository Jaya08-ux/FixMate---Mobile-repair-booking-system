import { NextResponse } from "next/server";
import { changeBookingStatus } from "../../../../lib/bookings";
import { getCurrentUser } from "../../../../lib/auth";

const allowedStatuses = ["Pending", "Confirmed", "In Progress", "Ready for Pickup", "Completed", "Cancelled"];

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Please sign in to update bookings." }, { status: 401 });
    if (user.role !== "admin") return NextResponse.json({ error: "Only admins can update booking status." }, { status: 403 });
    const { id } = await params;
    const { status } = await request.json();
    if (!allowedStatuses.includes(status)) return NextResponse.json({ error: "Invalid booking status." }, { status: 400 });
    const found = await changeBookingStatus(id, status);
    if (!found) return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Could not update booking:", error);
    return NextResponse.json({ error: "Could not update booking. Check MongoDB settings." }, { status: 500 });
  }
}
