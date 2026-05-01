import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Property from "@/models/Property";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const pincode = searchParams.get("pincode");
    const area = searchParams.get("area");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");
    if (pincode) filter.pincode = pincode;
    if (area) filter.area = new RegExp(area, "i");
    if (type) filter.propertyType = type;
    if (status) filter.status = status;

    const properties = await Property.find(filter).sort({ createdAt: -1 });
    return Response.json(properties);
  } catch (e) {
    console.error("GET /api/properties error:", e);
    return Response.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const property = await Property.create(data);
    return Response.json(property, { status: 201 });
  } catch (e) {
    console.error("POST /api/properties error:", e);
    return Response.json({ error: "Failed to create property" }, { status: 500 });
  }
}
