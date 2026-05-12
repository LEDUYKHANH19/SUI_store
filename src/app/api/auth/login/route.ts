import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/validations";
import prisma from "@/lib/prisma";
import { signJwtToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const validation = loginSchema.safeParse(await req.json());

    if (!validation.success) {
      return NextResponse.json(
        {
          // Truy cập đúng: validation (kết quả) -> error (đối tượng lỗi) -> errors (mảng chi tiết)
          error: validation.error.errors[0].message
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signJwtToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json(
      { message: "Login successful", user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 200 }
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
