import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, isInstantBook } from 'services/page'

class CheckoutPageContainer extends Component {
  constructor(props) {
    super(props)
    try {
      this.checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))
      this.trainings = JSON.parse(sessionStorage.getItem('trainings'))
    } catch (error) {
      console.log('Error', error)
    }
    const supplier = getSupplier()

    this.state = {
      loading: false,
      checkoutData: this.checkoutData || { addons: [] },
      trainings: this.trainings,
      supplier,
      instantBook: isInstantBook()
    }

    this.stripePublicKey = window.RIDETO_PAGE.stripe_key
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
    const {
      checkoutData,
      loading,
      supplier,
      instantBook,
      trainings
    } = this.state

    return (
      <StripeProvider apiKey={this.stripePublicKey}>
        <Elements>
          <CheckoutPage
            checkoutData={checkoutData}
            loading={loading}
            supplier={supplier}
            instantBook={instantBook}
            trainings={trainings}
          />
        </Elements>
      </StripeProvider>
    )
  }
}

export default CheckoutPageContainer
