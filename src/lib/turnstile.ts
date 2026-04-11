const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstile(
  token: string,
): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return { success: false, errorCodes: ["missing-secret"] };
  }

  let response: Response;
  try {
    const body = new URLSearchParams({ secret, response: token });
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  } catch {
    return { success: false, errorCodes: ["fetch-error"] };
  }

  if (!response.ok) {
    return { success: false, errorCodes: ["http-error"] };
  }

  const data = (await response.json()) as {
    success: boolean;
    "error-codes"?: string[];
  };
  return {
    success: data.success === true,
    errorCodes: data["error-codes"],
  };
}
