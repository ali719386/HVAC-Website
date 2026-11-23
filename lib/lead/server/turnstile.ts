/** Cloudflare Turnstile is enforced only when BOTH the secret and the public site key are set. */
export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    const data: { success?: boolean } = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("[lead] Turnstile verification failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
