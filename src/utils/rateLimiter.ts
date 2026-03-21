/**
 * Simple in-memory rate limiter for API endpoints.
 * Prevents abuse by limiting requests per IP address.
 * 
 * In production, replace with Redis for distributed rate limiting
 * across multiple server instances.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10, // 10 requests
  windowMs: 60 * 60 * 1000, // per hour
}

class RateLimiter {
  private requests = new Map<string, RateLimitEntry>()
  private config: RateLimitConfig

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Check if a request is allowed for the given identifier
   * @returns Object with allowed status and remaining requests
   */
  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry || now > entry.resetTime) {
      // New window or expired window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs,
      })
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      }
    }

    // Within current window
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      }
    }

    entry.count++
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Reset rate limit for a specific identifier (useful for testing)
   */
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.requests) {
      if (now > entry.resetTime) {
        this.requests.delete(key)
      }
    }
  }
}

// Default rate limiter instance (10 requests per hour per IP)
export const defaultRateLimiter = new RateLimiter()

// Stricter rate limiter for expensive operations (5 requests per hour)
export const strictRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000,
})

export { RateLimiter }
export type { RateLimitConfig }
