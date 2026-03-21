/**
 * Simple in-memory store for tracking used payment IDs.
 * Prevents replay attacks where the same payment is used for multiple analyses.
 * 
 * In production, replace with Redis or database persistence.
 */

interface PaymentRecord {
  paymentId: string
  orderId: string
  usedAt: number
}

class PaymentStore {
  private payments = new Map<string, PaymentRecord>()
  private readonly TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

  /**
   * Check if a payment has already been used
   */
  has(paymentId: string): boolean {
    this.cleanup()
    return this.payments.has(paymentId)
  }

  /**
   * Record a payment as used
   */
  record(paymentId: string, orderId: string): void {
    this.payments.set(paymentId, {
      paymentId,
      orderId,
      usedAt: Date.now(),
    })
  }

  /**
   * Clean up expired records to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.payments) {
      if (now - record.usedAt > this.TTL_MS) {
        this.payments.delete(key)
      }
    }
  }
}

// Singleton instance
export const paymentStore = new PaymentStore()
