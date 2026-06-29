import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Message from "@/models/Message";
import { verifyAuth } from "@/lib/auth";

const SEED_STUDENTS = [
  { name: "Segun Adegoke", email: "segun@lasu.edu.ng", password: "hashed_placeholder", role: "student", department: "Economics", yearOfStudy: "300L", budget: 250000, habits: { cleanliness: "Quiet Study", sleep: "Night Owl", noise: 2, smoke: false } },
  { name: "Mary Okon", email: "mary@lasu.edu.ng", password: "hashed_placeholder", role: "student", department: "Biochemistry", yearOfStudy: "200L", budget: 300000, habits: { cleanliness: "Clean Freak", sleep: "Early Bird", noise: 1, smoke: false } },
  { name: "Kolawole Benson", email: "kola@lasu.edu.ng", password: "hashed_placeholder", role: "student", department: "Mechanical Engineering", yearOfStudy: "400L", budget: 350000, habits: { cleanliness: "Quiet Study", sleep: "Night Owl", noise: 3, smoke: false } },
];

export async function GET(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentCount = await User.countDocuments({ role: "student" });
    if (studentCount <= 1) {
      await User.insertMany(SEED_STUDENTS);
    }

    const roommates = await User.find({ role: "student", _id: { $ne: decoded.userId } });

    const AVATARS = [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
    ];

    const formatted = roommates.map((r, i) => ({
      id: r._id,
      name: r.name,
      avatar: AVATARS[i % AVATARS.length],
      department: r.department || "General Studies",
      yearOfStudy: r.yearOfStudy || "100L",
      budget: r.budget || 200000,
      bio: `Looking for a roommate to share an apartment around Ojo campus. I value cleanliness and quiet study time.`,
      habits: r.habits || { cleanliness: "Quiet Study", sleep: "Early Bird", noise: 2, smoke: false },
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Roommates Deck Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
