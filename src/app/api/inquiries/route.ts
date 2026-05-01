import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { mockInquiries } from "@/utils/mockData";

export async function GET() {
  return handleDemo(
    async () => {
      await connectDB();
      const inquiries = await Inquiry.find().sort({ createdAt: -1 });
      return Response.json(inquiries);
    },
    async () => {
      return Response.json(mockInquiries);
    }
  );
}

export async function POST(req: NextRequest) {
  return handleDemo(
    async () => {
      await connectDB();
      const data = await req.json();
      const inquiry = await Inquiry.create(data);
      return Response.json(inquiry, { status: 201 });
    },
    async () => {
      return Response.json({
        _id: "demo-inq-" + Date.now(),
        message: "Demo mode: Inquiry not saved",
      });
    }
  );
}
