/*
 * Rate limiting for the lead endpoint.
 *
 * 1) Upstash Redis (optional): used when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
 *    Shared across all serverless instances, so it is the reliable option in production.
 * 2) In-memory fallback: BEST-EFFORT ONLY. On serverless platforms (Vercel) each instance has its
 *    own memory and instances are recycled, so limits are not enforced globally.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_TRACKED = 5000;

const memory = new Map<string, number[]>();

function memoryLimit(key: string, now: number): RateResult {
  const recent = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    const oldest = recent[0] ?? now;
    return { allowed: false, retryAfterSec: Math.ceil((oldest + WINDOW_MS - now) / 1000) };
  }
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > MAX_TRACKED) {
    // Drop the oldest entries to bound memory use.
    for (const k of memory.keys()) {
      memory.delete(k);
      if (memory.size <= MAX_TRACKED * 0.8) break;
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

type RateResult = { allowed: boolean; retryAfterSec: number };

async function upstashLimit(key: string, url: string, token: string): Promise<RateResult> {
  const windowSec = WINDOW_MS / 1000;
  const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSec), "NX"],
      ["TTL", key],
    ]),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
  const data: unknown = await res.json();
  const results = Array.isArray(data) ? data.map((d: { result?: unknown }) => d?.result) : [];
  const count = Number(results[0]);
  const ttl = Number(results[2]);
  if (!Number.isFinite(count)) throw new Error("Unexpected Upstash response");
  return count > MAX_REQUESTS
    ? { allowed: false, retryAfterSec: ttl > 0 ? ttl : windowSec }
    : { allowed: true, retryAfterSec: 0 };
}

export async function checkRateLimit(ip: string): Promise<RateResult> {
  const key = `lead:rl:${ip}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      return await upstashLimit(key, url, token);
    } catch (err) {
      console.error("[lead] Upstash rate limit failed, using in-memory fallback:", err instanceof Error ? err.message : err);
    }
  }
  return memoryLimit(key, Date.now());
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip")?.trim() || "unknown";
}
