import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "nexus-realstate-2050-secret-key";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: role || "buyer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return Response.json(
      {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
        },
        token,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/auth/register error:", e);
    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
