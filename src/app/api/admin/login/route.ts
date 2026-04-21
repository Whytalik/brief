import { badRequest, tooManyRequests } from "@/lib/api-response";
import { SESSION_COOKIE } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyAdminPassword } from "@/services/auth.service";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required").max(128),
});

const AUTH_LIMIT = { maxRequests: 5, windowMs: 15 * 60_000 };

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`auth:${ip}`, AUTH_LIMIT).allowed)
    return tooManyRequests();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  let input: { password: string };
  try {
    input = loginSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) return badRequest(err.issues[0].message);
    return badRequest();
  }

  const result = await verifyAdminPassword(input.password);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
