import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

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

    const favorites = await Favorite.find({ userId: decoded.userId });
    const propertyIds = favorites.map(f => f.propertyId.toString());

    return NextResponse.json({ favorites: propertyIds }, { status: 200 });
  } catch (error) {
    console.error("Get Favorites Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching favorites" },
      { status: 500 }
    );
  }
}
