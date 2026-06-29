import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    studentName: { type: String, required: true },
    comment: { type: String, required: true },
    rating: {
      security: { type: Number, required: true },
      water: { type: Number, required: true },
      power: { type: Number, required: true },
      location: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
