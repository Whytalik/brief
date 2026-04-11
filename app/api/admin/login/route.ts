import { badRequest, internalError, tooManyRequests } from "@/lib/api-response";
import { SESSION_COOKIE, signAdminToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
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
    if (err instanceof ZodError) return badRequest(err.errors[0].message);
    return badRequest();
  }

  const hashBase64 = process.env.ADMIN_PASSWORD_HASH;
  if (!hashBase64) {
    console.error("ADMIN_PASSWORD_HASH is not configured");
    return internalError();
  }

  const hash = Buffer.from(hashBase64, "base64").toString("utf8");

  const valid = await bcrypt.compare(input.password, hash);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signAdminToken();

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  return response;
}
