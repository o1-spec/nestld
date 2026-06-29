import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.userId.toString();

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const partners = {};
    messages.forEach(m => {
      const isSender = m.senderId === userId;
      const partnerKey = isSender ? m.receiverId : m.senderId;
      if (!partners[partnerKey]) {
        partners[partnerKey] = {
          id: partnerKey,
          name: partnerKey,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          role: "Contact",
          lastMessage: m.content,
          timestamp: m.createdAt,
        };
      }
    });

    return NextResponse.json(Object.values(partners), { status: 200 });
  } catch (error) {
    console.error("Get Chats Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
