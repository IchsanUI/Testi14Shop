/**
 * Simple in-memory sliding-window rate limiter.
 *
 * For single-instance deployments (typical in dev / small production).
 * For multi-instance deployments, replace with a Redis-based implementation
 * (e.g. @upstash/ratelimit) to share state across processes.
 */

type RateLimitEntry = {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

function cleanup(entry: RateLimitEntry, windowMs: number, now: number) {
  const cutoff = now - windowMs
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)
}

/**
 * Check and record a request.
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key) ?? { timestamps: [] }

  cleanup(entry, windowMs, now)

  const remaining = Math.max(0, maxRequests - entry.timestamps.length)

  if (remaining === 0) {
    const oldest = Math.min(...entry.timestamps)
    const resetAt = oldest + windowMs
    return { allowed: false, remaining: 0, resetAt }
  }

  // Record this request
  entry.timestamps.push(now)
  store.set(key, entry)

  const resetAt = Math.max(...entry.timestamps) + windowMs
  return { allowed: true, remaining: remaining - 1, resetAt }
}

/**
 * Extract a rate-limit key from the request.
 * Prefers x-forwarded-for (for proxied deployments) over x-real-ip.
 */
export function getClientKey(request: Request | Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'
  return ip
}
