import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  status: "pending" | "replied" | "closed";
  adminReply: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: String, required: true },
    propertyTitle: { type: String, default: "" },
    userId: { type: String, default: "guest" },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "replied", "closed"], default: "pending" },
    adminReply: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
