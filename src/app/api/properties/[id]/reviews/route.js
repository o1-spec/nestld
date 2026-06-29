import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const reviews = await Review.find({ propertyId: id }).sort({ createdAt: -1 });

    let securityAvg = 0;
    let waterAvg = 0;
    let powerAvg = 0;
    let locationAvg = 0;

    if (reviews.length > 0) {
      const sum = reviews.reduce(
        (acc, r) => {
          acc.security += r.rating.security;
          acc.water += r.rating.water;
          acc.power += r.rating.power;
          acc.location += r.rating.location;
          return acc;
        },
        { security: 0, water: 0, power: 0, location: 0 }
      );
      securityAvg = Number((sum.security / reviews.length).toFixed(1));
      waterAvg = Number((sum.water / reviews.length).toFixed(1));
      powerAvg = Number((sum.power / reviews.length).toFixed(1));
      locationAvg = Number((sum.location / reviews.length).toFixed(1));
    }

    const formatted = reviews.map(r => ({
      id: r._id,
      studentName: r.studentName,
      comment: r.comment,
      rating: r.rating
    }));

    return NextResponse.json(
      {
        propertyId: id,
        averages: {
          security: securityAvg || 5.0,
          water: waterAvg || 5.0,
          power: powerAvg || 5.0,
          location: locationAvg || 5.0
        },
        reviews: formatted
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching safety reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
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

    const student = await User.findById(decoded.userId);
    if (!student) {
      return NextResponse.json({ error: "Student account not found" }, { status: 404 });
    }

    const body = await req.json();
    const { comment, rating } = body;

    if (!comment || !rating || !rating.security || !rating.water || !rating.power || !rating.location) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newReview = await Review.create({
      propertyId: id,
      studentName: student.name,
      comment,
      rating: {
        security: Number(rating.security),
        water: Number(rating.water),
        power: Number(rating.power),
        location: Number(rating.location)
      }
    });

    const formatted = {
      id: newReview._id,
      studentName: newReview.studentName,
      comment: newReview.comment,
      rating: newReview.rating
    };

    return NextResponse.json({ success: true, review: formatted }, { status: 201 });
  } catch (error) {
    console.error("Create Review Error:", error);
    return NextResponse.json(
      { error: "Internal server error creating safety review" },
      { status: 500 }
    );
  }
}
