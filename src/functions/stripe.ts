import { createServerFn } from '@tanstack/react-start'
import Stripe from 'stripe'

export const createPaymentIntentFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    // Check if the Stripe key exists
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("No STRIPE_SECRET_KEY found. Running in mock payment mode.")
      return { clientSecret: null, mockMode: true }
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-12-18.acacia', // Latest Stripe API version format
      })

      // Create a PaymentIntent with the order amount ($1.00 USD = 100 cents)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100, // $1.00
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        clientSecret: paymentIntent.client_secret,
        mockMode: false
      }
    } catch (error) {
      console.error("Stripe Error:", error)
      throw new Error("Failed to initialize payment gateway.")
    }
  })
