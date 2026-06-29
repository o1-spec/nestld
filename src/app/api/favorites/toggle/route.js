import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { verifyAuth } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
