import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

MessageSchema.index({ senderId: 1, receiverId: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
