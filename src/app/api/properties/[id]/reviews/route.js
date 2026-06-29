import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const reviews = await Review.find({ propertyId: id }).sort({ createdAt: -1 });

    let securityAvg = 0, waterAvg = 0, powerAvg = 0, locationAvg = 0;
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

    return NextResponse.json({
      propertyId: id,
      averages: {
        security: securityAvg || 5.0,
        water: waterAvg || 5.0,
        power: powerAvg || 5.0,
        location: locationAvg || 5.0,
      },
      reviews: reviews.map(r => ({
        id: r._id,
        studentName: r.studentName,
        comment: r.comment,
        rating: r.rating,
      })),
    }, { status: 200 });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await User.findById(decoded.userId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const { comment, rating } = await req.json();
    if (!comment || !rating?.security || !rating?.water || !rating?.power || !rating?.location) {
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
        location: Number(rating.location),
      },
    });

    return NextResponse.json({ success: true, review: {
      id: newReview._id,
      studentName: newReview.studentName,
      comment: newReview.comment,
      rating: newReview.rating,
    }}, { status: 201 });
  } catch (error) {
    console.error("Create Review Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
