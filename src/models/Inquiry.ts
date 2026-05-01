import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  propertyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  status: "pending" | "replied" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "replied", "closed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);
