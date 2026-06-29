import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    distance: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    verified: { type: Boolean, default: false },
    available: { type: String, required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agentName: { type: String },
    agentPhone: { type: String },
    agentAgency: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);
