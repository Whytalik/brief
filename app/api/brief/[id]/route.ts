import {
  badRequest,
  internalError,
  notFound,
  ok,
  tooManyRequests,
} from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { updateBriefSchema } from "@/schemas/brief";
import { BriefStatus, Prisma } from "@/generated/prisma";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/brief/[id] — get one brief
export async function GET(request: NextRequest, { params }: RouteContext) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  const { id } = await params;

  try {
    const brief = await prisma.brief.findUnique({ where: { id } });
    if (!brief) return notFound("Бриф не знайдено");
    return ok(brief);
  } catch (err) {
    console.error("[GET /api/brief/[id]]", err);
    return internalError();
  }
}

// PUT /api/brief/[id] — update a brief
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Невірний формат JSON");
  }

  let input;
  try {
    input = updateBriefSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return badRequest(err.errors.map((e) => e.message).join(", "));
    }
    return badRequest();
  }

  try {
    const existing = await prisma.brief.findUnique({ where: { id } });
    if (!existing) return notFound("Бриф не знайдено");

    const updated = await prisma.brief.update({
      where: { id },
      data: {
        ...(input.status && { status: input.status as BriefStatus }),
        ...(input.rawData && {
          rawData: input.rawData as Prisma.InputJsonValue,
        }),
      },
    });
    return ok(updated);
  } catch (err) {
    console.error("[PUT /api/brief/[id]]", err);
    return internalError();
  }
}

// DELETE /api/brief/[id] — delete a brief
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  const { id } = await params;

  try {
    const existing = await prisma.brief.findUnique({ where: { id } });
    if (!existing) return notFound("Brief not found");

    await prisma.brief.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (err) {
    console.error("[DELETE /api/brief/[id]]", err);
    return internalError();
  }
}
