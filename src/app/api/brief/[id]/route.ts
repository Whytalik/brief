import {
  badRequest,
  internalError,
  notFound,
  ok,
  tooManyRequests,
  unauthorized,
} from "@/lib/api-response";
import { getTokenFromRequest, verifyAdminToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { briefService } from "@/services/brief.service";
import { updateBriefSchema } from "@/schemas/brief";
import type { NextRequest } from "next/server";
import { ZodError } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/brief/[id] — get one brief (admin only)
export async function GET(request: NextRequest, { params }: RouteContext) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyAdminToken(token))) return unauthorized();

  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  const { id } = await params;

  try {
    const brief = await briefService.getById(id);
    if (!brief) return notFound("Бриф не знайдено");
    return ok(brief);
  } catch (err) {
    console.error("[GET /api/brief/[id]]", err);
    return internalError();
  }
}

// PUT /api/brief/[id] — update a brief (admin only)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyAdminToken(token))) return unauthorized();

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
      return badRequest(err.issues.map((e) => e.message).join(", "));
    }
    return badRequest();
  }

  try {
    const updated = await briefService.update(id, input);
    if (!updated) return notFound("Бриф не знайдено");
    return ok(updated);
  } catch (err) {
    console.error("[PUT /api/brief/[id]]", err);
    return internalError();
  }
}

// DELETE /api/brief/[id] — delete a brief (admin only)
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyAdminToken(token))) return unauthorized();

  const ip = getClientIp(request);
  if (!checkRateLimit(ip).allowed) return tooManyRequests();

  const { id } = await params;

  try {
    const deleted = await briefService.remove(id);
    if (!deleted) return notFound("Бриф не знайдено");
    return ok({ deleted: true });
  } catch (err) {
    console.error("[DELETE /api/brief/[id]]", err);
    return internalError();
  }
}
