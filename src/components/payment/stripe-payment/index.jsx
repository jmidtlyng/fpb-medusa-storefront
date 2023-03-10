import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import React, { useMemo } from "react"
import { useCart } from "../../../hooks/use-cart"
import InjectableCardForm from "./injectable-card-form"

const STRIPE_KEY = "pk_test_51MZOYJHzWEklJxhJxv82ZeNHthYBnUYXf0k8VDL8cQUY6dv98UdTBTepZiAMZBDEEUdamMUTylUn4PSkNG6ApIAx00nHYrpkiM"
const stripePromise = loadStripe(STRIPE_KEY)

const StripePayment = () => {
  const { cart } = useCart()

  const stripeSession = useMemo(() => {
    if (cart.payment_sessions) {
      return cart.payment_sessions.find(s => s.provider_id === "stripe")
    }

    return null
  }, [cart.payment_sessions])

  if (!stripeSession) {
    return null
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: stripeSession.data.client_secret,
      }}
    >
      <InjectableCardForm session={stripeSession} />
    </Elements>
  )
}

export default StripePayment
