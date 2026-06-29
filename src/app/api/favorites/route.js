import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await Favorite.find({ userId: decoded.userId });
    const propertyIds = favorites.map(f => f.propertyId.toString());

    return NextResponse.json({ favorites: propertyIds }, { status: 200 });
  } catch (error) {
    console.error("Get Favorites Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
