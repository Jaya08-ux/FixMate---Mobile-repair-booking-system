"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "Alex Morgan", email: "alex@fixmate.demo", device: "", issue: "", date: "", time: "10:00 AM – 12:00 PM" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.json()).then(({ user }) => {
      if (user) setForm((current) => ({ ...current, name: user.name, email: user.email }));
    }).catch(() => {});
  }, []);

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

  async function submit(event) {
    event.preventDefault(); setError(""); setSaving(true);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create booking");
      router.push("/client/dashboard");
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return (
    <div className="form-page wrap"><Link className="back-link" href="/client/dashboard">← Back to dashboard</Link><div className="form-layout"><div className="form-intro"><span className="eyebrow">LET’S GET IT FIXED</span><h1>Book your<br /><em>repair.</em></h1><p>Tell us a little about your device. A FixMate technician will take it from here.</p><div className="promise-list"><div><span>✓</span><p><strong>Free diagnostics</strong><small>We’ll confirm the issue before any work begins.</small></p></div><div><span>✓</span><p><strong>90-day warranty</strong><small>Every repair is backed by our promise.</small></p></div><div><span>✓</span><p><strong>No surprise fees</strong><small>You approve the price before we start.</small></p></div></div></div>
      <form className="booking-form" onSubmit={submit}><div className="form-heading"><span className="step-pill">STEP 01 / BOOKING</span><h2>Repair details</h2><p>Fields marked with * are required.</p></div>{error && <div className="notice notice-error">{error}</div>}
        <div className="field-row"><label>Your name<input name="name" value={form.name} readOnly /></label><label>Email address<input name="email" type="email" value={form.email} readOnly /></label></div>
        <label>Device *<select name="device" value={form.device} onChange={update} required><option value="">Choose your device</option><option>iPhone</option><option>Samsung Galaxy</option><option>Google Pixel</option><option>OnePlus</option><option>Other smartphone</option></select></label>
        <label>What needs fixing? *<textarea name="issue" value={form.issue} onChange={update} required rows="3" placeholder="e.g. cracked screen, battery drains quickly…" /></label>
        <div className="field-row"><label>Preferred date *<input name="date" type="date" min={today} value={form.date} onChange={update} required /></label><label>Drop-off time<select name="time" value={form.time} onChange={update}><option>10:00 AM – 12:00 PM</option><option>12:00 PM – 2:00 PM</option><option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option><option>Flexible</option></select></label></div>
        <button className="button button-primary form-submit" type="submit" disabled={saving}>{saving ? "Saving your booking…" : "Confirm booking"}<span>↗</span></button><p className="form-footnote">No payment required to book. We’ll confirm your appointment shortly.</p>
      </form></div></div>
  );
}
