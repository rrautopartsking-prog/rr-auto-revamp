import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const ADMIN_PATHS = ["/admin"];
const ADMIN_API_PATHS = ["/api/leads", "/api/products", "/api/blog", "/api/reviews", "/api/upload", "/api/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin UI routes
  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("auth_token");
      return response;
    }

    // Inject user info into headers for server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Protect admin API routes (except GET /api/products and GET /api/blog which are public)
  if (ADMIN_API_PATHS.some((p) => pathname.startsWith(p))) {
    const isPublicGet =
      req.method === "GET" &&
      (pathname.startsWith("/api/products") || pathname.startsWith("/api/blog"));

    if (!isPublicGet) {
      const token =
        req.cookies.get("auth_token")?.value ||
        req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }

      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/leads/:path*", "/api/products/:path*", "/api/blog/:path*", "/api/reviews/:path*", "/api/upload/:path*", "/api/dashboard/:path*"],
};
