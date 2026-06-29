import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { partnerId } = await params;

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
        { senderId: decoded.userId, receiverId: partnerId },
        { senderId: partnerId, receiverId: decoded.userId },
        { senderId: "student-user", receiverId: partnerId },
        { senderId: partnerId, receiverId: "student-user" }
      ]
    }).sort({ createdAt: 1 });

    const formatted = messages.map(m => ({
      id: m._id,
      senderId: m.senderId,
      content: m.content,
      timestamp: m.timestamp
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching message logs" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { partnerId } = await params;

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

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const newMsg = await Message.create({
      senderId: "student-user",
      receiverId: partnerId,
      content: content.trim()
    });

    const formatted = {
      id: newMsg._id,
      senderId: newMsg.senderId,
      content: newMsg.content,
      timestamp: newMsg.timestamp
    };

    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { error: "Internal server error sending message" },
      { status: 500 }
    );
  }
}
