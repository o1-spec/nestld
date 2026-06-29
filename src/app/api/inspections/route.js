import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Inspection from "@/models/Inspection";
import Property from "@/models/Property";
import User from "@/models/User";

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

    let bookings;
    if (decoded.role === "agent") {
      bookings = await Inspection.find({ agentId: decoded.userId }).sort({ createdAt: -1 });
    } else {
      bookings = await Inspection.find({ studentId: decoded.userId }).sort({ createdAt: -1 });
    }

    const formatted = bookings.map(b => ({
      id: b._id,
      propertyId: b.propertyId,
      propertyName: b.propertyName,
      studentName: b.studentName,
      studentPhone: b.studentPhone,
      date: b.date,
      time: b.time
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Inspections Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching bookings" },
      { status: 500 }
    );
  }
}

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

    const student = await User.findById(decoded.userId);
    if (!student) {
      return NextResponse.json({ error: "Student account not found" }, { status: 404 });
    }

    const body = await req.json();
    const { propertyId, propertyName, studentPhone, date, time } = body;

    if (!propertyId || !propertyName || !studentPhone || !date || !time) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property listing not found" }, { status: 404 });
    }

    const newBooking = await Inspection.create({
      propertyId,
      propertyName,
      studentName: student.name,
      studentPhone,
      date,
      time,
      studentId: student._id,
      agentId: property.agentId
    });

    const formatted = {
      id: newBooking._id,
      propertyId: newBooking.propertyId,
      propertyName: newBooking.propertyName,
      studentName: newBooking.studentName,
      studentPhone: newBooking.studentPhone,
      date: newBooking.date,
      time: newBooking.time
    };

    return NextResponse.json({ success: true, booking: formatted }, { status: 201 });
  } catch (error) {
    console.error("Create Inspection Error:", error);
    return NextResponse.json(
      { error: "Internal server error scheduling inspection" },
      { status: 500 }
    );
  }
}
