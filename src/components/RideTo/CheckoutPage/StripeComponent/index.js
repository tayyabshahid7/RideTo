import { PaymentElement } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

export default function StripeComponent(props) {
  const [paymentType, setPaymentType] = useState('')
  const { stripeElementChange, onPaymentChange, onChange } = props

  const options = {
    paymentMethodOrder: ['card', 'klarna'],
    wallets: { applePay: 'auto', googlePay: 'auto' }
  }

  return (
    <form id="payment-form">
      <PaymentElement
        id="payment"
        options={options}
        onChange={element => {
          const { complete, empty, value } = element
          const { type } = value
          if (paymentType !== type) {
            setPaymentType(type)
            onPaymentChange({ paymentType: type })
          }
          if (!empty && complete) {
            stripeElementChange(element, 'payment')
            onChange({ paymentDetailsReady: true })
          } else {
            onChange({ paymentDetailsReady: false })
          }
        }}
      />
    </form>
  )
}
