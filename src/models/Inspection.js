import mongoose from "mongoose";

const InspectionSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    propertyName: { type: String, required: true },
    studentName: { type: String, required: true },
    studentPhone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Inspection || mongoose.model("Inspection", InspectionSchema);
