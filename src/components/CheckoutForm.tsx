import { useState, useEffect } from "react"
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import { Lock, Loader2 } from "lucide-react"

export default function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsLoading(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // Do not redirect away, we want to run analysis immediately
      confirmParams: {
        // This is only used if redirect occurs (e.g. 3D Secure), but we want to stay
        // Usually, return_url is required, but with `if_required`, it's not strictly necessary 
        // unless a redirect is explicitly needed by the payment method.
        // We'll set a placeholder to the current window location.
        return_url: window.location.origin, 
      },
    })

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An error occurred with your payment.")
      } else {
        setMessage("An unexpected error occurred.")
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      {message && (
        <div id="payment-message" className="text-[var(--error)] text-xs font-semibold p-4 clinical-border bg-red-50 dark:bg-red-950/20 text-center uppercase tracking-widest">
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full clinical-button bg-[var(--text-main)] text-[var(--bg-base)] py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Lock size={16} strokeWidth={1.5} />
        )}
        <span>{isLoading ? "Processing..." : "Pay $1.00"}</span>
      </button>

      <p className="text-center text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-2">
        Secure payment powered by Stripe.
      </p>
    </form>
  )
}
