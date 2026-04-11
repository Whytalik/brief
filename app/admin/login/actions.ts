"use server";

import { SESSION_COOKIE, signAdminToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
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
    return { error: "Пароль обов’язковий" };
  }

  const hashBase64 = process.env.ADMIN_PASSWORD_HASH;
  if (!hashBase64) {
    console.error("ADMIN_PASSWORD_HASH is not configured");
    return { error: "Помилка конфігурації сервера" };
  }

  const hash = Buffer.from(hashBase64, "base64").toString("utf8");
  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    return { error: "Невірний пароль" };
  }

  const token = await signAdminToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });

  redirect("/admin");
}
