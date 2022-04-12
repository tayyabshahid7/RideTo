import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import CheckoutForm from './CheckoutForm'
import styles from './StripeCheckout.module.scss'
import { STRIPE_KEY } from '../../../../common/constants'

const stripePromise = loadStripe(STRIPE_KEY)

export default function StripeComponent(props) {
  const { stripeClientSecret: clientSecret } = props
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#141414',
      colorText: '#141414',
      borderRadius: '0',
      spacingUnit: '5px',
      fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif',
      colorIconHover: '#141414'
    }
  }
  const options = {
    clientSecret,
    appearance
  }

  return (
    <div className={styles.app}>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm handleSubmit={props.handleSubmit} />
        </Elements>
      )}
    </div>
  )
}
