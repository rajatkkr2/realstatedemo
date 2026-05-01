import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  state: string;
  country: string;
  propertyType: string;
  bhk: number;
  sqft: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  yearBuilt: number;
  status: "Available" | "Sold" | "Draft";
  amenities: string[];
  images: string[];
  videos: string[];
  agent: string;
  featured: boolean;
  views: number;
  likes: number;
  coordinates: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    propertyType: { type: String, required: true },
    bhk: { type: Number, required: true },
    sqft: { type: Number, required: true },
    bathrooms: { type: Number, default: 1 },
    floor: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 1 },
    yearBuilt: { type: Number, default: 2050 },
    status: { type: String, enum: ["Available", "Sold", "Draft"], default: "Draft" },
    amenities: [{ type: String }],
    images: [{ type: String }],
    videos: [{ type: String }],
    agent: { type: String, required: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
