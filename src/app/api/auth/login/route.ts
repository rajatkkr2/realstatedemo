import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { demoUser } from "@/utils/mockData";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-realstate-2050-secret-key";

export async function POST(req: NextRequest) {
  return handleDemo(
    async () => {
      await connectDB();
      const { email, password } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return Response.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return Response.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      });
    },
    async () => {
      return Response.json({
        user: demoUser,
        token: "demo-token-2050",
        message: "Demo mode: Mock login successful",
      });
    }
  );
}
