import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const SEED_STUDENTS = [
  {
    name: "Segun Adegoke",
    email: "segun@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Economics",
    yearOfStudy: "300L",
    budget: 250000,
    habits: {
      cleanliness: "Quiet Study",
      sleep: "Night Owl",
      noise: 2,
      smoke: false
    }
  },
  {
    name: "Mary Okon",
    email: "mary@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Biochemistry",
    yearOfStudy: "200L",
    budget: 300000,
    habits: {
      cleanliness: "Clean Freak",
      sleep: "Early Bird",
      noise: 1,
      smoke: false
    }
  },
  {
    name: "Kolawole Benson",
    email: "kola@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Mechanical Engineering",
    yearOfStudy: "400L",
    budget: 350000,
    habits: {
      cleanliness: "Quiet Study",
      sleep: "Night Owl",
      noise: 3,
      smoke: false
    }
  }
];

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

    const studentCount = await User.countDocuments({ role: "student" });
    if (studentCount <= 1) {
      await User.insertMany(SEED_STUDENTS);
    }

    const roommates = await User.find({
      role: "student",
      _id: { $ne: decoded.userId }
    });

    const formatted = roommates.map(r => ({
      id: r._id,
      name: r.name,
      department: r.department || "General Studies",
      yearOfStudy: r.yearOfStudy || "100L",
      budget: r.budget || 200000,
      bio: `Looking for a roommate to share an apartment around Ojo campus. I value cleanliness and quiet study time.`,
      habits: r.habits || {
        cleanliness: "Quiet Study",
        sleep: "Early Bird",
        noise: 2,
        smoke: false
      }
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Roommates Deck Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching roommates deck" },
      { status: 500 }
    );
  }
}
