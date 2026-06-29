import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(req) {
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

    const messages = await Message.find({
      $or: [
        { senderId: decoded.userId },
        { receiverId: decoded.userId },
        { senderId: "student-user" },
        { receiverId: "student-user" }
      ]
    }).sort({ createdAt: -1 });

    const partners = {};
    messages.forEach(m => {
      const isSender = m.senderId === decoded.userId || m.senderId === "student-user";
      const partnerName = isSender ? m.receiverId : m.senderId;

      if (!partners[partnerName]) {
        partners[partnerName] = {
          id: partnerName,
          name: partnerName,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          role: partnerName.includes("Agent") || partnerName.includes("Mrs.") || partnerName.includes("Hon.") || partnerName.includes("Prince") ? "Housing Agent" : "LASU Student",
          lastMessage: m.content,
          timestamp: m.timestamp
        };
      }
    });

    return NextResponse.json(Object.values(partners), { status: 200 });
  } catch (error) {
    console.error("Get Chats Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching chat inbox" },
      { status: 500 }
    );
  }
}
