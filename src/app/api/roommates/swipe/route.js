import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { targetUserId, action } = await req.json();

    if (!targetUserId || !action) {
      return NextResponse.json({ error: "Target User ID and Action are required" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: "Target student profile not found" }, { status: 404 });
    }

    let isMatch = false;
    if (action === "like") {
      isMatch = true;

      const existingMsg = await Message.findOne({
        senderId: targetUser.name,
        receiverId: decoded.userId
      });

      if (!existingMsg) {
        await Message.create({
          senderId: targetUser.name,
          receiverId: decoded.userId,
          content: `Hello! I saw we matched on Nestld. Are you looking to team up for a hostel near the main gate?`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      isMatch,
      roommate: {
        id: targetUser._id,
        name: targetUser.name,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        phone: targetUser.phone || "+234 812 345 6789"
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Swipe Error:", error);
    return NextResponse.json(
      { error: "Internal server error processing swipe choice" },
      { status: 500 }
    );
  }
}
