import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

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

    const { propertyId } = await req.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    const existing = await Favorite.findOne({ userId: decoded.userId, propertyId });
    let isFavorited = false;

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
    } else {
      await Favorite.create({ userId: decoded.userId, propertyId });
      isFavorited = true;
    }

    return NextResponse.json({ success: true, isFavorited }, { status: 200 });
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    return NextResponse.json(
      { error: "Internal server error toggling favorite" },
      { status: 500 }
    );
  }
}
