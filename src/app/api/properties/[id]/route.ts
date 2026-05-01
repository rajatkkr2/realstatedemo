import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { mockProperties } from "@/utils/mockData";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleDemo(
    async () => {
      await connectDB();
      const property = await Property.findById(id);
      if (!property) {
        return Response.json({ error: "Property not found" }, { status: 404 });
      }
      return Response.json(property);
    },
    async () => {
      const property = mockProperties.find((p) => p._id === id);
      if (!property) {
        return Response.json({ error: "Property not found" }, { status: 404 });
      }
      return Response.json(property);
    }
  );
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleDemo(
    async () => {
      await connectDB();
      const data = await req.json();
      const property = await Property.findByIdAndUpdate(id, data, { new: true });
      if (!property) {
        return Response.json({ error: "Property not found" }, { status: 404 });
      }
      return Response.json(property);
    },
    async () => {
      return Response.json({
        _id: id,
        message: "Demo mode: Property not updated",
      });
    }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleDemo(
    async () => {
      await connectDB();
      const property = await Property.findByIdAndDelete(id);
      if (!property) {
        return Response.json({ error: "Property not found" }, { status: 404 });
      }
      return Response.json({ message: "Property deleted" });
    },
    async () => {
      return Response.json({
        _id: id,
        message: "Demo mode: Property not deleted",
      });
    }
  );
}
