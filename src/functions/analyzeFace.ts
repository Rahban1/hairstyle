import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import crypto from 'crypto'
import { analyzePhotoPipeline } from './analyzePipeline'
import { paymentStore } from '../utils/paymentStore'
import { strictRateLimiter } from '../utils/rateLimiter'

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  // Fallback to a hash of user agent + timestamp if no IP available
  const ua = request.headers.get('user-agent') || 'unknown'
  return `anon-${Buffer.from(ua).toString('base64').slice(0, 16)}`
}

export const analyzeFaceFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { 
    base64Image: string,
    razorpay_payment_id: string,
    razorpay_order_id: string,
    razorpay_signature: string
  }) => {
    if (!data.base64Image) {
      throw new Error('Image data is required')
    }
    if (!data.razorpay_payment_id || !data.razorpay_order_id || !data.razorpay_signature) {
      throw new Error('Payment verification data is missing')
    }
    return data
  })
  .handler(async ({ data, request }) => {
    // Rate limiting: 5 requests per hour per IP
    const clientIp = getClientIp(request)
    const rateLimit = strictRateLimiter.check(clientIp)
    
    if (!rateLimit.allowed) {
      const minutesLeft = Math.ceil((rateLimit.resetTime - Date.now()) / 60000)
      console.error("Rate limit exceeded", { clientIp, resetInMinutes: minutesLeft })
      throw new Error(`Too many requests. Please try again in ${minutesLeft} minutes.`)
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      throw new Error("Server configuration error: missing payment secret")
    }

    // Server-side Payment Verification
    // Securely validates that the payment actually occurred and wasn't forged
    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== data.razorpay_signature) {
      console.error("Signature Mismatch!", { expectedSignature, received: data.razorpay_signature })
      throw new Error("Invalid payment signature. Unauthorized request.")
    }

    // Check for replay attack: prevent same payment from being used multiple times
    if (paymentStore.has(data.razorpay_payment_id)) {
      console.error("Payment replay attempt detected", { paymentId: data.razorpay_payment_id })
      throw new Error("Payment has already been used for analysis.")
    }

    // Record this payment as used
    paymentStore.record(data.razorpay_payment_id, data.razorpay_order_id)

    // Run our Effect pipeline since payment is successfully verified
    const pipeline = analyzePhotoPipeline(data.base64Image)
    const result = await Effect.runPromise(pipeline)
    
    return result
  })
