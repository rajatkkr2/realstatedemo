import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "agent" | "admin";
  avatar: string;
  phone: string;
  agency?: string;
  bio?: string;
  rating?: number;
  verified?: boolean;
  totalListings?: number;
  wishlist: string[];
  viewedProperties: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "agent", "admin"], default: "buyer" },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    agency: { type: String },
    bio: { type: String },
    rating: { type: Number },
    verified: { type: Boolean, default: false },
    totalListings: { type: Number, default: 0 },
    wishlist: [{ type: String }],
    viewedProperties: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
