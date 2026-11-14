import { NextResponse } from "next/server";
import { findUserByEmail, hashPassword, safeCompare, saveAdminAccount, startSession, verifyPassword } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !password) return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
    let user;

    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && cleanEmail === process.env.ADMIN_EMAIL.toLowerCase() && safeCompare(password, process.env.ADMIN_PASSWORD)) {
      user = await saveAdminAccount(cleanEmail, await hashPassword(process.env.ADMIN_PASSWORD));
    } else {
      user = await findUserByEmail(cleanEmail);
      if (!user || user.role !== "client" || !(await verifyPassword(password, user.passwordHash))) {
        return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
      }
    }

    await startSession(user._id);
    return NextResponse.json({ user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json({ error: "Could not sign in. Check MongoDB settings." }, { status: 500 });
  }
}
