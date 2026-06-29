import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyAuth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { decoded, error } = await verifyAuth(req);
    if (error || !decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 data URI for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataURI = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "nestld/properties",
      resource_type: "image",
      transformation: [
        { width: 1200, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto:good", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    }, { status: 200 });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
