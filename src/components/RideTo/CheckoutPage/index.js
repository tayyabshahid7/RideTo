import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, getCurrentUser } from 'services/page'

class CheckoutPageContainer extends Component {
  constructor(props) {
    super(props)
    try {
      this.checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))
    } catch (error) {
      console.log('Error', error)
      // window.location = '/'
    }
    const supplier = getSupplier()
    const currentUser = getCurrentUser()
    this.state = {
      loading: false,
      checkoutData: this.checkoutData || { addons: [] },
      supplier,
      currentUser
    }

    this.stripePublicKey = window.RIDE_TO_DATA.stripe_public_key

    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handeUpdateOption(data) {
    this.setState({ ...data })
  }

  render() {
    const { checkoutData, loading, supplier, currentUser } = this.state

    return (
      <StripeProvider apiKey={this.stripePublicKey}>
        <Elements>
          <CheckoutPage
            checkoutData={checkoutData}
            loading={loading}
            supplier={supplier}
            currentUser={currentUser}
          />
        </Elements>
      </StripeProvider>
    )
  }
}

export default CheckoutPageContainer
