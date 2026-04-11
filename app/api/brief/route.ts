import {
  badRequest,
  created,
  forbidden,
  internalError,
  ok,
  tooManyRequests,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createBriefSchema } from "@/schemas/brief";
import { Prisma } from "@/generated/prisma";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

// GET /api/brief — list all briefs
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) return tooManyRequests();

  try {
    const briefs = await prisma.brief.findMany({
      orderBy: { createdAt: "desc" },
    });
    return ok(briefs);
  } catch (err) {
    console.error("[GET /api/brief]", err);
    return internalError();
  }
}

// POST /api/brief — create a brief
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) return tooManyRequests();

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
      return badRequest(err.errors.map((e) => e.message).join(", "));
    }
    return badRequest();
  }

  const turnstile = await verifyTurnstile(input.cfToken);
  if (!turnstile.success) {
    return forbidden("Перевірка на ботів не пройдена");
  }

  try {
    const brief = await prisma.brief.create({
      data: {
        rawData: input.rawData as Prisma.InputJsonValue,
        status: "NEW",
      },
    });
    return created(brief);
  } catch (err) {
    console.error("[POST /api/brief]", err);
    return internalError();
  }
}
