import { NextRequest } from "next/server";
import { handleDemo } from "@/lib/demoHandler";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  return handleDemo(
    async () => {
      await connectDB();
      const { name, email, password, role } = await req.json();

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json({ error: "User already exists" }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "buyer",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      });

      return Response.json(
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          message: "Account created successfully",
        },
        { status: 201 }
      );
    },
    async () => {
      return Response.json({
        _id: "demo-user-" + Date.now(),
        message: "Demo mode: Account not created",
      });
    }
  );
}
