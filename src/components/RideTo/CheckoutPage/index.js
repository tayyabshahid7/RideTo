import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'

class CheckoutPageContainer extends Component {
  constructor(props) {
    super(props)
    try {
      this.checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))
    } catch (error) {
      console.log('Error', error)
      // window.location = '/'
    }
    this.state = {
      loading: false,
      checkoutData: this.checkoutData || { addons: [] }
    }

    this.stripePublicKey = window.RIDE_TO_DATA.stripe_public_key

    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  loadData() {}

  // async loadPlaceInfo() {
  //   const { postcode, navigation } = this.state
  //   if (postcode) {
  //     let response = await fetchLocationInfoWithPostCode(postcode)
  //     if (response && response.result) {
  //       navigation[0].subtitle = `${response.result.admin_district}, ${
  //         response.result.region
  //       } ${postcode.toUpperCase()}`
  //     }
  //     this.setState({ navigation })
  //   }
  // }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handeUpdateOption(data) {
    this.setState({ ...data })
  }

  render() {
    const { checkoutData, loading } = this.state

    return (
      <StripeProvider apiKey={this.stripePublicKey}>
        <Elements>
          <CheckoutPage checkoutData={checkoutData} loading={loading} />
        </Elements>
      </StripeProvider>
    )
  }
}

export default CheckoutPageContainer
