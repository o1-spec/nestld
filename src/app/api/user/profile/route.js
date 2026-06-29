import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

export async function PUT(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { department, yearOfStudy, budget, habits } = body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      { $set: { department, yearOfStudy, budget, habits } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      agency: updatedUser.agency,
      phone: updatedUser.phone,
      department: updatedUser.department,
      yearOfStudy: updatedUser.yearOfStudy,
      budget: updatedUser.budget,
      habits: updatedUser.habits,
    }}, { status: 200 });
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
