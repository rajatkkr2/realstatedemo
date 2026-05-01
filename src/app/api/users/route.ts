import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { mockUsers, mockAgents } from "@/utils/mockData";

export async function GET() {
  return handleDemo(
    async () => {
      await connectDB();
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      return Response.json(users);
    },
    async () => {
      return Response.json([...mockUsers, ...mockAgents]);
    }
  );
}
