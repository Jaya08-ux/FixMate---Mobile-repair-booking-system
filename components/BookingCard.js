import StatusBadge from "./StatusBadge";

export default function BookingCard({ booking, admin = false, onStatusChange }) {
  const date = booking.date ? new Date(`${booking.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "Date not set";
  return (
    <article className="booking-card">
      <div className="booking-device-icon">▯</div>
      <div className="booking-main"><div className="booking-title-row"><h3>{booking.device}</h3><StatusBadge status={booking.status} /></div><p>{booking.issue}</p><div className="booking-meta"><span>▦ {date}</span><span>◷ {booking.time || "Time flexible"}</span>{booking.pickupLocation && <span>⌖ Pickup: {booking.pickupLocation}</span>}{admin && <span>✉ {booking.email}</span>}</div><div className="booking-payment"><strong>{booking.estimatedAmount == null ? "No estimate saved" : `Approx. ₹${Number(booking.estimatedAmount).toLocaleString("en-IN")}`}</strong><span>{booking.paymentMethod || "Payment not selected"} · {booking.paymentStatus || "Pending"}</span>{admin && booking.razorpayOrderId && <span>Order {booking.razorpayOrderId}</span>}{admin && booking.razorpayPaymentId && <span>Payment {booking.razorpayPaymentId}</span>}</div></div>
      {admin && <label className="status-select-label">Update status<select value={booking.status} onChange={(event) => onStatusChange(booking._id, event.target.value)}><option>Pending</option><option>Confirmed</option><option>In Progress</option><option>Ready for Pickup</option><option>Completed</option><option>Cancelled</option></select></label>}
    </article>
  );
}
