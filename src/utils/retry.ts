/**
 * Retry utility with exponential backoff for async operations.
 * Handles transient failures in external API calls.
 */

export interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
  retryableErrors?: string[]
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.baseDelayMs * Math.pow(2, attempt)
  const jitter = Math.random() * 0.3 * exponentialDelay // Add 0-30% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelayMs)
}

/**
 * Check if an error is retryable
 */
function isRetryable(error: unknown, config: RetryConfig): boolean {
  if (!config.retryableErrors || config.retryableErrors.length === 0) {
    return true // Retry all errors by default
  }

  const errorMessage = error instanceof Error ? error.message : String(error)
  return config.retryableErrors.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  )
}

/**
 * Sleep for a given duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Execute an async function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config }
  let lastError: unknown

  for (let attempt = 0; attempt <= fullConfig.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry if this is the last attempt
      if (attempt === fullConfig.maxRetries) {
        break
      }

      // Don't retry non-retryable errors
      if (!isRetryable(error, fullConfig)) {
        throw error
      }

      const delay = calculateDelay(attempt, fullConfig)
      console.warn(`Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`, {
        error: error instanceof Error ? error.message : String(error),
      })

      await sleep(delay)
    }
  }

  throw lastError
}

/**
 * Pre-configured retry for AI API calls (Fireworks, Replicate)
 * Retries on network errors, rate limits, and transient failures
 */
export function withAIApiRetry<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(fn, {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 10000,
    retryableErrors: [
      'timeout',
      'rate limit',
      'too many requests',
      '429',
      '503',
      '502',
      'network',
      'fetch',
      'connection',
      'etimedout',
      'econnreset',
    ],
  })
}
