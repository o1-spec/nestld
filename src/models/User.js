import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "agent"], default: "student" },
    agency: { type: String },
    phone: { type: String },
    department: { type: String },
    yearOfStudy: { type: String },
    budget: { type: Number },
    habits: {
      cleanliness: { type: String },
      sleep: { type: String },
      noise: { type: Number },
      smoke: { type: Boolean }
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
