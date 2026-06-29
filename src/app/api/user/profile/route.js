import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function PUT(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized session access" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid session credentials" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { department, yearOfStudy, budget, habits } = body;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      {
        $set: {
          department,
          yearOfStudy,
          budget,
          habits,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    const userResponse = {
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
    };

    return NextResponse.json(
      { success: true, user: userResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile Update Error:", error);
    return NextResponse.json(
      { error: "Internal server profile update error" },
      { status: 500 }
    );
  }
}
