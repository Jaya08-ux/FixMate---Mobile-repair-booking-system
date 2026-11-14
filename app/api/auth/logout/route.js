import { NextResponse } from "next/server";
import { endSession } from "../../../../lib/auth";

export async function POST() {
  try {
    await endSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json({ error: "Could not sign out." }, { status: 500 });
  }
}
