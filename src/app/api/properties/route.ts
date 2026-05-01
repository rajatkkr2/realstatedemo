import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";
import { mockProperties } from "@/utils/mockData";

export async function GET() {
  return handleDemo(
    async () => {
      await connectDB();
      const properties = await Property.find().sort({ createdAt: -1 });
      return Response.json(properties);
    },
    async () => {
      return Response.json(mockProperties);
    }
  );
}

export async function POST(req: NextRequest) {
  return handleDemo(
    async () => {
      await connectDB();
      const data = await req.json();
      const property = await Property.create(data);
      return Response.json(property, { status: 201 });
    },
    async () => {
      return Response.json({
        _id: "demo-id-" + Date.now(),
        message: "Demo mode: Property not saved",
        ...Object.fromEntries(
          await req.json().then((d: Record<string, unknown>) => Object.entries(d))
        ),
      });
    }
  );
}
