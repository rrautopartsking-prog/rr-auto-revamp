import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const hasDB = !!process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("user:password@host") &&
  !process.env.DATABASE_URL.includes("localhost");

// Fallback admin when no DB is configured
const MOCK_ADMIN = {
  id: "mock-admin-001",
  email: "rrautopartsking@gmail.com",
  name: "Super Admin",
  role: "SUPER_ADMIN",
  password: "Admin@123!",
};

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    let user: { id: string; email: string; name: string; role: string } | null = null;

    if (hasDB) {
      const { prisma } = await import("@/lib/prisma");
      const bcrypt = await import("bcryptjs");
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (!dbUser || !dbUser.isActive) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }
      const isValid = await bcrypt.default.compare(password, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }
      user = { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role };
      await prisma.user.update({ where: { id: dbUser.id }, data: { lastLoginAt: new Date() } });
    } else {
      // Mock login — no DB needed
      if (email !== MOCK_ADMIN.email || password !== MOCK_ADMIN.password) {
        return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
      }
      user = { id: MOCK_ADMIN.id, email: MOCK_ADMIN.email, name: MOCK_ADMIN.name, role: MOCK_ADMIN.role };
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ success: true, data: user });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
