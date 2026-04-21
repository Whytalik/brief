import {
  badRequest,
  created,
  forbidden,
  internalError,
  ok,
  tooManyRequests,
  unauthorized,
} from "@/lib/api-response";
import { getTokenFromRequest, verifyAdminToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { briefService } from "@/services/brief.service";
import { createBriefSchema } from "@/schemas/brief";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

// GET /api/brief — list all briefs (admin only)
export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyAdminToken(token))) return unauthorized();

  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  try {
    const briefs = await briefService.getAll();
    return ok(briefs);
  } catch (err) {
    console.error("[GET /api/brief]", err);
    return internalError();
  }
}

// POST /api/brief — create a brief (public)
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Невірний формат JSON");
  }

  let input;
  try {
    input = createBriefSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return badRequest(err.issues.map((e) => e.message).join(", "));
    }
    return badRequest();
  }

  const turnstile = await verifyTurnstile(input.cfToken);
  if (!turnstile.success) {
    return forbidden("Перевірка на ботів не пройдена");
  }

  try {
    const brief = await briefService.create(
      input.rawData as Record<string, unknown>,
    );
    return created(brief);
  } catch (err) {
    console.error("[POST /api/brief]", err);
    return internalError();
  }
}
