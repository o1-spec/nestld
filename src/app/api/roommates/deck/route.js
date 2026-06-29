import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";

const SEED_STUDENTS = [
  {
    name: "Adebayo Temitope",
    email: "adebayo@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Mechanical Engineering",
    yearOfStudy: "300L",
    budget: 200000,
    age: 21,
    gender: "Male",
    bio: "Hey there! Looking for a neat roommate to split a self-contained room near Iyana-Iba or LASU Road. I'm highly focused, clean up after myself, and mostly stay up coding or reading.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    habits: {
      cleanliness: "Quiet Study",
      sleep: "Night Owl",
      noise: 2,
      smoke: false
    }
  },
  {
    name: "Chioma Nwachukwu",
    email: "chioma@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Law Faculty",
    yearOfStudy: "200L",
    budget: 250000,
    age: 20,
    gender: "Female",
    bio: "Law student here! Looking for a friendly, respectful female student to share a flat with. I enjoy cooking, music, and quiet study sessions. Very neat and organized.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    habits: {
      cleanliness: "Clean Freak",
      sleep: "Early Bird",
      noise: 1,
      smoke: false
    }
  },
  {
    name: "Olamide Benson",
    email: "olamide@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Computer Science",
    yearOfStudy: "400L",
    budget: 180000,
    age: 22,
    gender: "Male",
    bio: "Finalist CS student looking for a calm roommate. I spend most of my day at labs or on my laptop. Love peace and quiet. Let's team up to secure an affordable place around PPL axis.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    habits: {
      cleanliness: "Quiet Study",
      sleep: "Night Owl",
      noise: 1,
      smoke: false
    }
  },
  {
    name: "Fatima Bello",
    email: "fatima@lasu.edu.ng",
    password: "hashed_placeholder",
    role: "student",
    department: "Economics",
    yearOfStudy: "100L",
    budget: 300000,
    age: 18,
    gender: "Female",
    bio: "Freshman student looking for a roommate. I am outgoing, love making friends, and hosting study groups. I'm looking for a self-contain or flatmate around Main Gate area to share the bills.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300",
    habits: {
      cleanliness: "Quiet Study",
      sleep: "Night Owl",
      noise: 4,
      smoke: false
    }
  }
];

export async function GET(req) {
  try {
    await connectDB();
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const studentCount = await User.countDocuments({ role: "student" });
    // If there is only the currently logged in student, seed the database with potential matches
    if (studentCount <= 1) {
      await User.insertMany(SEED_STUDENTS);
    }

    const roommates = await User.find({ role: "student", _id: { $ne: decoded.userId } });

    const formatted = roommates.map((r) => ({
      id: r._id,
      name: r.name,
      age: r.age || 20,
      gender: r.gender || "Male",
      avatar: r.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      department: r.department || "General Studies",
      yearOfStudy: r.yearOfStudy || "100L",
      budget: r.budget || 200000,
      bio: r.bio || "Looking for a roommate to share an apartment around Ojo campus.",
      habits: r.habits || { cleanliness: "Quiet Study", sleep: "Early Bird", noise: 2, smoke: false }
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Roommates Deck Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
