import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetUserId, action } = await req.json();
    if (!targetUserId || !action) {
      return NextResponse.json({ error: "Target user ID and action are required" }, { status: 400 });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    let isMatch = false;
    if (action === "like") {
      isMatch = true;
      const existingMsg = await Message.findOne({
        senderId: targetUser._id.toString(),
        receiverId: decoded.userId.toString(),
      });
      if (!existingMsg) {
        await Message.create({
          senderId: targetUser._id.toString(),
          receiverId: decoded.userId.toString(),
          content: `Hello! I saw we matched on Nestld! Are you looking to team up for a hostel near the main gate?`,
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
        phone: targetUser.phone || "+234 812 345 6789",
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Swipe Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
