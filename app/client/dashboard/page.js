"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BookingCard from "../../../components/BookingCard";

export default function ClientDashboard() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [bookingView, setBookingView] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      const session = await response.json();
      if (!response.ok) throw new Error(session.error || "Could not load your account");
      setUser(session.user);
      const bookingsResponse = await fetch("/api/bookings");
      const data = await bookingsResponse.json();
      if (!bookingsResponse.ok) throw new Error(data.error || "Could not load bookings");
      setBookings(data);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const active = bookings.filter((booking) => !["Completed", "Cancelled"].includes(booking.status));
  const visibleBookings = bookingView === "active" ? active : bookings;
  return (
    <div className="dashboard-page wrap">
      <div className="dashboard-topline"><div><span className="eyebrow">CLIENT SPACE</span><h1>Hey, {user?.name?.split(" ")[0] || "there"} <span>✳</span></h1><p>Here’s what’s happening with your repairs.</p></div><Link className="button button-primary" href="/client/book">+ New booking</Link></div>
      <div className="dashboard-stats"><button type="button" aria-pressed={bookingView === "active"} onClick={() => setBookingView("active")} className={`stat-card stat-card-button ${bookingView === "active" ? "stat-dark" : ""}`}><span>ACTIVE REPAIRS</span><strong>{active.length.toString().padStart(2, "0")}</strong><small>Currently in the workshop</small><i>⌁</i></button><button type="button" aria-pressed={bookingView === "all"} onClick={() => setBookingView("all")} className={`stat-card stat-card-button ${bookingView === "all" ? "stat-dark" : ""}`}><span>ALL BOOKINGS</span><strong>{bookings.length.toString().padStart(2, "0")}</strong><small>Your repair history</small><i>↗</i></button><article className="stat-card"><span>YOUR ACCOUNT</span><strong className="stat-avatar">{user?.name?.[0] || "•"}</strong><small>{user?.email || "Loading account…"}</small><i>✳</i></article></div>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">YOUR ACTIVITY</span><h2>{bookingView === "active" ? "Active repairs" : "All bookings"}</h2></div><span className="subtle-count">{visibleBookings.length} shown</span></div>
        {loading ? <div className="empty-state"><span className="loader" />Loading your bookings…</div> : error ? <div className="notice notice-error">{error}<p>Check MongoDB Atlas settings if this keeps happening.</p></div> : visibleBookings.length ? <div className="booking-list">{visibleBookings.map((booking) => <BookingCard key={booking._id} booking={booking} />)}</div> : <div className="empty-state"><span className="empty-icon">▯</span><h3>{bookingView === "active" && bookings.length ? "No active repairs" : "No repairs booked yet"}</h3><p>{bookingView === "active" && bookings.length ? "Choose All Bookings to see your repair history." : "When you book a repair, you’ll see its progress here."}</p><Link className="button button-primary" href="/client/book">Book your first repair <span>↗</span></Link></div>}
      </section>
      <div className="demo-note">Signed in as <strong>{user?.email || "your client account"}</strong></div>
    </div>
  );
}
