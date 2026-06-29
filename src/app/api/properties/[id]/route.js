import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
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

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Hostel property listing not found" }, { status: 404 });
    }

    if (property.agentId.toString() !== decoded.userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this listing" }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Listing deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Property Error:", error);
    return NextResponse.json(
      { error: "Internal server error deleting property" },
      { status: 500 }
    );
  }
}
