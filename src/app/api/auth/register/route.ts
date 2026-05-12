import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";
import { signJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const validation = registerSchema.safeParse(await req.json());
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { email, password, name } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = await signJwtToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json(
      { message: "Registration successful", user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
