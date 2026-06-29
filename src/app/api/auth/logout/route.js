import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.headers.set("Set-Cookie", clearAuthCookie());
  return res;
}
