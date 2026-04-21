"use server";

import { SESSION_COOKIE } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { verifyAdminPassword } from "@/services/auth.service";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = { error: string | null };

const AUTH_LIMIT = { maxRequests: 5, windowMs: 15 * 60_000 };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0].trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(`auth:${ip}`, AUTH_LIMIT).allowed) {
    return { error: "Забагато спроб. Спробуйте пізніше." };
  }

  const password = formData.get("password");
  if (!password || typeof password !== "string" || password.trim() === "") {
    return { error: "Пароль обов'язковий" };
  }

  const result = await verifyAdminPassword(password);
  if (!result.ok) return { error: result.error };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  redirect("/admin");
}
