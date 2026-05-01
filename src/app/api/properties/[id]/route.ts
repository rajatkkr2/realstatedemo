import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const property = await Property.findById(id);
    if (!property) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return Response.json(property);
  } catch (e) {
    console.error("GET /api/properties/[id] error:", e);
    return Response.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const data = await req.json();
    const property = await Property.findByIdAndUpdate(id, data, { new: true });
    if (!property) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }
    return Response.json(property);
  } catch (e) {
    console.error("PUT /api/properties/[id] error:", e);
    return Response.json({ error: "Failed to update property" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return Response.json({ error: "Property not found" }, { status: 404 });
    }
    return Response.json({ message: "Property deleted" });
  } catch (e) {
    console.error("DELETE /api/properties/[id] error:", e);
    return Response.json({ error: "Failed to delete property" }, { status: 500 });
  }
}
