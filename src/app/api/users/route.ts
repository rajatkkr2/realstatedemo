import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return Response.json(users);
  } catch (e) {
    console.error("GET /api/users error:", e);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
