import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken, buildAuthCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id, role: user.role, email: user.email });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      agency: user.agency,
      phone: user.phone,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      budget: user.budget,
      habits: user.habits,
    };

    const res = NextResponse.json(
      { success: true, token, user: userResponse },
      { status: 200 }
    );
    res.headers.set("Set-Cookie", buildAuthCookie(token));
    return res;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server login error" },
      { status: 500 }
    );
  }
}
