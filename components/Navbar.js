"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch("/api/auth/me").then((response) => response.ok ? response.json() : null).then((data) => setUser(data?.user || null)).catch(() => setUser(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="navbar wrap">
      <Link className="brand" href="/"><span className="brand-mark">f<span>.</span></span><span>fixmate</span></Link>
      <nav className="nav-links" aria-label="Main navigation">
        {user?.role === "client" && <Link className={pathname?.startsWith("/client") ? "active" : ""} href="/client/dashboard">My dashboard</Link>}
        {!user && <Link className={pathname === "/login" ? "active" : ""} href="/login">Sign in</Link>}
      </nav>
      <div className="nav-actions">
        {user && <button className="nav-signout" onClick={logout}>Sign out</button>}
        {user?.role === "client" && <Link className="nav-cta" href="/client/book">Book a repair <span>↗</span></Link>}
        {!user && <Link className="nav-cta" href="/login">Get started <span>↗</span></Link>}
      </div>
    </header>
  );
}
