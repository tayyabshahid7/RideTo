import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

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
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    )
  }
}

export default injectStripe(CheckoutForm)
