"use client";

import { useCallback, useEffect, useState } from "react";
import BookingCard from "../../../components/BookingCard";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All bookings");
  const [queueView, setQueueView] = useState("all");

  const loadBookings = useCallback(async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load bookings");
      setBookings(data); setError("");
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update booking");
      setBookings((current) => current.map((booking) => booking._id === id ? { ...booking, status } : booking));
    } catch (err) { setError(err.message); }
  }

  const filtered = queueView === "pending"
    ? bookings.filter((booking) => booking.status === "Pending")
    : queueView === "workshop"
      ? bookings.filter((booking) => ["Confirmed", "In Progress"].includes(booking.status))
      : filter === "All bookings" ? bookings : bookings.filter((booking) => booking.status === filter);
  const inProgress = bookings.filter((booking) => ["Confirmed", "In Progress"].includes(booking.status)).length;
  const pending = bookings.filter((booking) => booking.status === "Pending").length;
  return (
    <div className="dashboard-page wrap admin-page"><div className="dashboard-topline"><div><span className="eyebrow">FIXMATE WORKSPACE</span><h1>Good morning, <span>team.</span></h1><p>Your repair desk at a glance. Let’s make someone’s day.</p></div><div className="admin-live"><i /> LIVE OVERVIEW</div></div>
      <div className="dashboard-stats"><button type="button" aria-pressed={queueView === "all"} onClick={() => { setQueueView("all"); setFilter("All bookings"); }} className={`stat-card stat-card-button ${queueView === "all" ? "stat-dark" : ""}`}><span>TOTAL BOOKINGS</span><strong>{bookings.length.toString().padStart(2, "0")}</strong><small>All-time repair requests</small><i>▤</i></button><button type="button" aria-pressed={queueView === "pending"} onClick={() => setQueueView("pending")} className={`stat-card stat-card-button ${queueView === "pending" ? "stat-dark" : ""}`}><span>NEEDS ATTENTION</span><strong>{pending.toString().padStart(2, "0")}</strong><small>Waiting for confirmation</small><i>◷</i></button><button type="button" aria-pressed={queueView === "workshop"} onClick={() => setQueueView("workshop")} className={`stat-card stat-card-button ${queueView === "workshop" ? "stat-dark" : ""}`}><span>IN THE WORKSHOP</span><strong>{inProgress.toString().padStart(2, "0")}</strong><small>Confirmed or being repaired</small><i>⌁</i></button></div>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">REPAIR QUEUE</span><h2>{queueView === "pending" ? "Needs attention" : queueView === "workshop" ? "In the workshop" : "All bookings"}</h2></div><label className="filter-label">Filter by status<select value={filter} onChange={(event) => { setFilter(event.target.value); setQueueView("all"); }}><option>All bookings</option><option>Pending</option><option>Confirmed</option><option>In Progress</option><option>Ready for Pickup</option><option>Completed</option><option>Cancelled</option></select></label></div>
        {error && <div className="notice notice-error">{error}<p>Check MongoDB Atlas settings and reload.</p></div>}{loading ? <div className="empty-state"><span className="loader" />Loading bookings…</div> : filtered.length ? <div className="booking-list">{filtered.map((booking) => <BookingCard key={booking._id} booking={booking} admin onStatusChange={updateStatus} />)}</div> : <div className="empty-state"><span className="empty-icon">▤</span><h3>{bookings.length ? "No bookings in this status" : "Your queue is clear"}</h3><p>{bookings.length ? "Try another status filter." : "New repair requests will show up here."}</p></div>}</section>
      <div className="demo-note">Admin dashboard · Bookings are stored in MongoDB Atlas.</div>
    </div>
  );
}
