import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { partnerId } = await params;

    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.userId.toString();

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    const formatted = messages.map(m => ({
      id: m._id,
      senderId: m.senderId,
      content: m.content,
      timestamp: m.createdAt,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { partnerId } = await params;

    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = decoded.userId.toString();
    const body = await req.json();
    const { content, senderOverride } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // senderOverride lets mock agent replies store under the agent's id
    const senderId = senderOverride || userId;
    const receiverId = senderOverride ? userId : partnerId;

    const newMsg = await Message.create({
      senderId,
      receiverId,
      content: content.trim(),
    });

    return NextResponse.json({
      id: newMsg._id,
      senderId: newMsg.senderId,
      content: newMsg.content,
      timestamp: newMsg.createdAt,
    }, { status: 201 });
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
