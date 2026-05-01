import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return Response.json(inquiries);
  } catch (e) {
    console.error("GET /api/inquiries error:", e);
    return Response.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    if (!data.userName || !data.userEmail || !data.message || !data.propertyId) {
      return Response.json({ error: "Name, email, message and propertyId are required" }, { status: 400 });
    }
    const inquiry = await Inquiry.create(data);
    return Response.json(inquiry, { status: 201 });
  } catch (e) {
    console.error("POST /api/inquiries error:", e);
    return Response.json({ error: "Failed to create inquiry" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, status, adminReply } = await req.json();
    const update: Record<string, string> = {};
    if (status) update.status = status;
    if (adminReply) update.adminReply = adminReply;
    const inquiry = await Inquiry.findByIdAndUpdate(id, update, { new: true });
    if (!inquiry) return Response.json({ error: "Inquiry not found" }, { status: 404 });
    return Response.json(inquiry);
  } catch (e) {
    console.error("PUT /api/inquiries error:", e);
    return Response.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
