import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

const INITIAL_SEED_PROPERTIES = [
  {
    title: "Platinum Heights Student Hostel",
    price: 250000,
    location: "Iyana-Iba, Main Gate Area",
    distance: "0.4 km from LASU Main Gate",
    type: "Hostels",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "24/7 Power", "Security", "Borehole"],
    verified: true,
    available: "Immediate",
    description: "Located just a short walk from the LASU main gate, Platinum Heights offers high-speed Wi-Fi, round-the-clock solar backup power, secure gated perimeter, and constant running water. Perfect for students looking for close proximity and a study-friendly atmosphere."
  },
  {
    title: "Blue Roof Residence Villa",
    price: 450000,
    location: "Igando, Behind Health Centre",
    distance: "2.1 km from LASU Main Gate",
    type: "2-Bedroom Flats",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    amenities: ["Generator", "Borehole", "Security"],
    verified: true,
    available: "1st July, 2026",
    description: "Spacious 2-Bedroom flat in a highly secured, quiet neighborhood behind the Igando Health Centre. Features large parking space, clean borehole water, separate prepaid meters, and 24/7 security patrol. Ideal for student groups seeking to share costs."
  },
  {
    title: "Legacy Student Suites",
    price: 320000,
    location: "Ojo-Alaba Road",
    distance: "1.5 km from LASU Main Gate",
    type: "Self-Contained",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
    amenities: ["Wifi", "Security", "Borehole"],
    verified: true,
    available: "Immediate",
    description: "Modern, tiled single self-contained apartments along the main Ojo-Alaba road. Boasts high natural ventilation, reliable water pump, security fencing, and quick transit access straight to the campus gate."
  }
];

export async function GET(req) {
  try {
    await connectDB();

    const count = await Property.countDocuments();
    if (count === 0) {
      let agent = await User.findOne({ role: "agent" });
      if (!agent) {
        agent = await User.create({
          name: "Mrs. Ngozi Alao",
          email: "ngozi@realty.com",
          password: "placeholder_hashed_password",
          role: "agent",
          agency: "Apex Accommodations Ltd",
          phone: "+234 703 987 6543"
        });
      }
      
      const seedList = INITIAL_SEED_PROPERTIES.map(p => ({
        ...p,
        agentId: agent._id,
        agentName: agent.name,
        agentPhone: agent.phone,
        agentAgency: agent.agency
      }));
      await Property.insertMany(seedList);
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 10000000;
    const types = searchParams.get("types") ? searchParams.get("types").split(",") : [];

    const query = {
      price: { $gte: minPrice, $lte: maxPrice }
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (types.length > 0) {
      query.type = { $in: types };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    const formatted = properties.map(p => ({
      id: p._id,
      title: p.title,
      price: p.price,
      location: p.location,
      distance: p.distance,
      type: p.type,
      image: p.image,
      description: p.description,
      amenities: p.amenities,
      verified: p.verified,
      available: p.available,
      agent: {
        name: p.agentName || "Independent Agent",
        phone: p.agentPhone || "+234 800 000 0000",
        agency: p.agentAgency || "Independent Agency",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
      }
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Get Properties Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching properties" },
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

    if (decoded.role !== "agent") {
      return NextResponse.json({ error: "Only verified housing agents can post properties" }, { status: 403 });
    }

    const agent = await User.findById(decoded.userId);
    if (!agent) {
      return NextResponse.json({ error: "Agent account not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, price, location, distance, type, image, description, amenities, available } = body;

    if (!title || !price || !location || !distance || !type || !image || !description || !available) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newProperty = await Property.create({
      title,
      price: Number(price),
      location,
      distance,
      type,
      image,
      description,
      amenities: amenities || [],
      available,
      agentId: agent._id,
      agentName: agent.name,
      agentPhone: agent.phone || "+234 800 000 0000",
      agentAgency: agent.agency || "Independent Agency"
    });

    const formatted = {
      id: newProperty._id,
      title: newProperty.title,
      price: newProperty.price,
      location: newProperty.location,
      distance: newProperty.distance,
      type: newProperty.type,
      image: newProperty.image,
      description: newProperty.description,
      amenities: newProperty.amenities,
      verified: newProperty.verified,
      available: newProperty.available,
      agent: {
        name: agent.name,
        phone: agent.phone || "+234 800 000 0000",
        agency: agent.agency || "Independent Agency",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
      }
    };

    return NextResponse.json({ success: true, property: formatted }, { status: 201 });
  } catch (error) {
    console.error("Create Property Error:", error);
    return NextResponse.json(
      { error: "Internal server error creating listing" },
      { status: 500 }
    );
  }
}
