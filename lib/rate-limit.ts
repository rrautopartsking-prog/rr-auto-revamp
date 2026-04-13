import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter (use Upstash Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: NextRequest,
  limit: number = 10,
  windowMs: number = 60_000
): NextResponse | null {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const key = `${ip}:${req.nextUrl.pathname}`;
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return null;
  }

  if (entry.count >= limit) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  entry.count++;
  return null;
}
