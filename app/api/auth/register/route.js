import { NextResponse } from "next/server";
import { createClientAccount, hashPassword, startSession } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanName || !/^\S+@\S+\.\S+$/.test(cleanEmail) || String(password || "").length < 8) {
      return NextResponse.json({ error: "Enter your name, a valid email, and a password with at least 8 characters." }, { status: 400 });
    }
    if (process.env.ADMIN_EMAIL && cleanEmail === process.env.ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({ error: "That email is reserved for the FixMate administrator." }, { status: 400 });
    }
    let user;
    try {
      user = await createClientAccount({ name: cleanName, email: cleanEmail, passwordHash: await hashPassword(password) });
    } catch (error) {
      if (error.code === 11000) return NextResponse.json({ error: "An account with that email already exists. Please sign in." }, { status: 409 });
      throw error;
    }
    await startSession(user._id);
    return NextResponse.json({ user: { name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch (error) {
    console.error("Registration failed:", error);
    return NextResponse.json({ error: "Could not create your account. Check MongoDB settings." }, { status: 500 });
  }
}
