import { signAdminToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export type AuthResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function verifyAdminPassword(
  password: string,
): Promise<AuthResult> {
  const hashBase64 = process.env.ADMIN_PASSWORD_HASH;
  if (!hashBase64) {
    console.error("ADMIN_PASSWORD_HASH is not configured");
    return { ok: false, error: "Помилка конфігурації сервера" };
  }

  const hash = Buffer.from(hashBase64, "base64").toString("utf8");
  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    return { ok: false, error: "Невірний пароль" };
  }

  const token = await signAdminToken();
  return { ok: true, token };
}
