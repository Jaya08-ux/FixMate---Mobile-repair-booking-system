"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BookPage() {
  const router = useRouter();
  const [form, setForm] = useState({ device: "", repairType: "", issue: "", date: "", time: "10:00 AM – 12:00 PM" });
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function submit(event) {
    event.preventDefault();
    try { sessionStorage.setItem("fixmate-booking", JSON.stringify(form)); router.push("/client/book/estimate"); }
    catch { setError("Could not continue. Please try again."); }
  }
  return (
    <div className="form-page wrap"><Link className="back-link" href="/client/dashboard">← Back to dashboard</Link><div className="form-layout"><div className="form-intro"><span className="eyebrow">LET’S GET IT FIXED</span><h1>Book your<br /><em>repair.</em></h1><p>Tell us a little about your device. We’ll show an approximate repair amount before you choose how to pay.</p><div className="promise-list"><div><span>✓</span><p><strong>Free diagnostics</strong><small>We’ll confirm the issue before any work begins.</small></p></div><div><span>✓</span><p><strong>90-day warranty</strong><small>Every repair is backed by our promise.</small></p></div><div><span>✓</span><p><strong>No surprise fees</strong><small>You approve the price before we start.</small></p></div></div></div>
      <form className="booking-form" onSubmit={submit}><div className="form-heading"><span className="step-pill">STEP 01 / DETAILS</span><h2>Repair details</h2><p>Fields marked with * are required.</p></div>{error && <div className="notice notice-error">{error}</div>}
        <label>Device *<select name="device" value={form.device} onChange={update} required><option value="">Choose your device</option><option>iPhone</option><option>Samsung Galaxy</option><option>Google Pixel</option><option>OnePlus</option><option>Other smartphone</option></select></label>
        <label>Repair type *<select name="repairType" value={form.repairType} onChange={update} required><option value="">Choose the closest issue</option><option value="screen">Screen repair</option><option value="battery">Battery replacement</option><option value="charging">Charging port</option><option value="camera">Camera repair</option><option value="water">Water damage</option><option value="other">Other / diagnosis needed</option></select></label>
        <label>What needs fixing? *<textarea name="issue" value={form.issue} onChange={update} required rows="3" placeholder="Add details about the problem…" /></label>
        <div className="field-row"><label>Preferred date *<input name="date" type="date" min={today} value={form.date} onChange={update} required /></label><label>Drop-off time<select name="time" value={form.time} onChange={update}><option>10:00 AM – 12:00 PM</option><option>12:00 PM – 2:00 PM</option><option>2:00 PM – 4:00 PM</option><option>4:00 PM – 6:00 PM</option><option>Flexible</option></select></label></div>
        <button className="button button-primary form-submit" type="submit">See estimate & payment options<span>↗</span></button><p className="form-footnote">Estimate is approximate; technician confirms final price after inspection.</p>
      </form></div></div>
  );
}
