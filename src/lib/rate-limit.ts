/**
 * Rate Limiting Utilities
 * Simple in-memory rate limiter for API endpoints
 * Prevents abuse and resource exhaustion
 */

const requestLog = new Map<string, number[]>();
const RATE_LIMITS = {
  'generate-codes': { maxRequests: 100, windowMs: 60000 }, // 100 per minute
  'reserve': { maxRequests: 50, windowMs: 60000 }, // 50 per minute
  'orders': { maxRequests: 200, windowMs: 60000 }, // 200 per minute
};

export function getRateLimitKey(ip: string | null, endpoint: string): string {
  // Use IP if available, fallback to endpoint
  return `${endpoint}:${ip || 'unknown'}`;
}

export function checkRateLimit(
  key: string,
  endpoint: keyof typeof RATE_LIMITS,
): { allowed: boolean; remaining: number; resetAt: number } {
  const limit = RATE_LIMITS[endpoint];
  if (!limit) {
    return { allowed: true, remaining: -1, resetAt: 0 };
  }

  const now = Date.now();
  const requests = requestLog.get(key) || [];

  // Remove old requests outside the window
  const recentRequests = requests.filter((time) => now - time < limit.windowMs);

  if (recentRequests.length < limit.maxRequests) {
    // Request allowed
    recentRequests.push(now);
    requestLog.set(key, recentRequests);
    return {
      allowed: true,
      remaining: limit.maxRequests - recentRequests.length,
      resetAt: recentRequests[0] + limit.windowMs,
    };
  } else {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: recentRequests[0] + limit.windowMs,
    };
  }
}

export function cleanupOldRequests() {
  // Run periodically to clean up old entries (prevent memory leak)
  const now = Date.now();
  for (const [key, requests] of requestLog.entries()) {
    const maxWindow = Math.max(...Object.values(RATE_LIMITS).map((l) => l.windowMs));
    const valid = requests.filter((time) => now - time < maxWindow);
    if (valid.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, valid);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupOldRequests, 5 * 60 * 1000);
}
