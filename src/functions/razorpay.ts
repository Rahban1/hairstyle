import { createServerFn } from '@tanstack/react-start'
import Razorpay from 'razorpay'

export const createRazorpayOrderFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Payment gateway is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.")
    }

    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })

      // Create a Razorpay Order for 89 INR (Approx $1 USD)
      const amount = 8900 
      const currency = 'INR'

      const options = {
        amount,
        currency,
        receipt: `receipt_hair_ai_${Date.now()}`,
        payment_capture: 1, // Auto-capture the payment
      }

      const order = await razorpay.orders.create(options)

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      }
    } catch (error) {
      console.error("Razorpay Error:", error)
      throw new Error("Failed to initialize payment gateway.")
    }
  })