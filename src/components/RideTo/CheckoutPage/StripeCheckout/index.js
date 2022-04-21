import { PaymentElement } from '@stripe/react-stripe-js'
import React from 'react'

export default function StripeComponent(props) {
  const { stripeElementChange, onPaymentChange } = props
  return (
    <form id="payment-form">
      <PaymentElement
        id="payment"
        onChange={element => {
          const { complete, empty, value } = element
          const { type } = value
          if (!empty && complete) {
            stripeElementChange(element, 'payment')
            onPaymentChange({ paymentType: type })
          }
        }}
      />
    </form>
  )
}
