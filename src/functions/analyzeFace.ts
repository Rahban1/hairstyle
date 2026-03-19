import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import crypto from 'crypto'
import { analyzePhotoPipeline } from './analyzePipeline'

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
  .handler(async ({ data }) => {
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

    // Run our Effect pipeline since payment is successfully verified
    const pipeline = analyzePhotoPipeline(data.base64Image)
    const result = await Effect.runPromise(pipeline)
    
    return result
  })
