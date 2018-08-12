import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import CheckoutForm from 'pages/Widget/components/CheckoutForm'
import CustomerDetailsForm from 'pages/Widget/components/CustomerDetailsForm'

import styles from './PaymentContainer.scss'

class PaymentContainer extends React.Component {
  constructor(props) {
    super(props)

    this.stripePublicKey = window.RIDE_TO_DATA.stripe_public_key
  }

  render() {
    return (
      <div className={styles.paymentContainer}>
        <h3>Contact Details</h3>
        <CustomerDetailsForm />

        <StripeProvider apiKey={this.stripePublicKey}>
          <div className="example">
            <h3>Payment Details</h3>
            <div>
              Your card details are stored with our secure payment provider
              Stripe.
            </div>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </StripeProvider>
      </div>
    )
  }
}

export default PaymentContainer
