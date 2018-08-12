import React from 'react'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement,
  injectStripe
} from 'react-stripe-elements'

import LabelField from 'pages/Widget/components/LabelField'

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  async submit(ev) {
    // User clicked submit
  }

  render() {
    return (
      <div className="checkout">
        <LabelField label="Card Number" name="card_number">
          <CardNumberElement
            style={{ base: { fontSize: '18px', theme: 'light' } }}
          />
        </LabelField>
        <LabelField label="Expiry Date" name="card_expiry">
          <CardExpiryElement />
        </LabelField>
        <LabelField label="CVC/CV2" name="card_cvc">
          <CardCVCElement />
        </LabelField>
        <LabelField label="Billing Postcode" name="card_postcode">
          <PostalCodeElement />
        </LabelField>

        <button onClick={this.submit}>Confirm and Pay</button>
      </div>
    )
  }
}

export default injectStripe(CheckoutForm)
