"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isRegister = mode === "register";

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await fetch(`/api/auth/${isRegister ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in");
      router.push(data.user.role === "admin" ? "/admin/dashboard" : "/client/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <div className="auth-page wrap">
      <section className="auth-card">
        <aside className="auth-aside">
          <Link className="auth-brand" href="/"><span className="auth-brand-mark">f<span>.</span></span> fixmate</Link>
          <div className="auth-aside-copy">
            <span className="auth-kicker"><i /> YOUR PHONE, IN GOOD HANDS</span>
            <h1>Good care.<br /><em>Good as new.</em></h1>
            <p>Repairs made refreshingly simple. Book in minutes and follow every update along the way.</p>
          </div>
          <div className="auth-art" aria-hidden="true">
            <div className="auth-art-halo" />
            <div className="auth-phone"><div className="auth-phone-notch" /><div className="auth-phone-shine">✳</div><div className="auth-phone-word">FIXED<br />WITH<br />CARE.</div><div className="auth-phone-line" /></div>
            <div className="auth-repair-chip"><span>✓</span><div><b>Repair updates</b><small>Every step, right here</small></div></div>
            <div className="auth-rating"><b>★ 4.9</b><small>customer rating</small></div>
          </div>
          <div className="auth-aside-footer"><span>✳</span> Thoughtful repairs. Clear updates.</div>
        </aside>

        <div className="auth-form-side">
          <Link className="auth-back" href="/">← Back to home</Link>
          <div className="auth-form-heading">
            <span className="auth-kicker">{isRegister ? "A BETTER REPAIR EXPERIENCE" : "YOUR FIXMATE ACCOUNT"}</span>
            <h2>{isRegister ? "Create your account" : "Welcome back"}</h2>
            <p>{isRegister ? "A few details and you’re ready to book." : "Sign in to pick up where you left off."}</p>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" role="tab" aria-selected={!isRegister} className={!isRegister ? "selected" : ""} onClick={() => changeMode("login")}>Sign in</button>
            <button type="button" role="tab" aria-selected={isRegister} className={isRegister ? "selected" : ""} onClick={() => changeMode("register")}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {isRegister && <label>Full name<input name="name" value={form.name} onChange={update} required placeholder="e.g. Alex Morgan" autoComplete="name" /></label>}
            <label>Email address<input name="email" type="email" value={form.email} onChange={update} required placeholder="you@example.com" autoComplete="email" /></label>
            <label>Password<input name="password" type="password" value={form.password} onChange={update} required minLength={isRegister ? 8 : undefined} placeholder={isRegister ? "At least 8 characters" : "Enter your password"} autoComplete={isRegister ? "new-password" : "current-password"} /><small>{isRegister ? "Use at least 8 characters." : "Your password is stored securely."}</small></label>
            {error && <div className="notice notice-error">{error}</div>}
            <button className="button button-primary auth-submit" disabled={saving}>{saving ? "One moment…" : isRegister ? "Create my account" : "Sign in to FixMate"}<span>↗</span></button>
          </form>

          <p className="auth-footnote">{isRegister ? "Already have an account? " : "New to FixMate? "}<button type="button" onClick={() => changeMode(isRegister ? "login" : "register")}>{isRegister ? "Sign in" : "Create an account"}</button></p>
          <div className="auth-form-footer"><span>SECURE ACCOUNT ACCESS</span><span>FIXMATE © 2026</span></div>
        </div>
      </section>
    </div>
  );
}
