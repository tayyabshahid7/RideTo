import { PaymentElement } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

export default function StripeComponent(props) {
  const [paymentType, setPaymentType] = useState('')
  const { stripeElementChange, onPaymentChange } = props

  return (
    <form id="payment-form">
      <PaymentElement
        id="payment"
        onChange={element => {
          const { complete, empty, value } = element
          const { type } = value
          if (paymentType !== type) {
            setPaymentType(type)
            onPaymentChange({ paymentType: type })
          }
          if (!empty && complete) {
            stripeElementChange(element, 'payment')
          }
        }}
      />
    </form>
  )
}
