import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, isInstantBook } from 'services/page'
import { getUserProfile, getToken } from 'services/auth'
import { fetchUser } from 'services/user'

class CheckoutPageContainer extends Component {
  constructor(props) {
    super(props)
    try {
      this.checkoutData = JSON.parse(sessionStorage.getItem('checkout-data'))
    } catch (error) {
      console.log('Error', error)
    }
    const supplier = getSupplier()
    this.state = {
      loading: false,
      checkoutData: this.checkoutData || { addons: [] },
      supplier,
      instantBook: isInstantBook(),
      currentUser: null
    }

    this.stripePublicKey = window.RIDETO_PAGE.stripe_key
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
  }

  async componentDidMount() {
    const user = getUserProfile(getToken())
    if (user) {
      const currentUser = await fetchUser(user.username)
      this.setState({ currentUser })
    } else {
      const { supplier } = this.state
      const next = `/${supplier.slug}/checkout`
      window.location = `/account/login?next=${next}`
    }
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
      currentUser,
      instantBook
    } = this.state

    return (
      <StripeProvider apiKey={this.stripePublicKey}>
        <Elements>
          <CheckoutPage
            checkoutData={checkoutData}
            loading={loading}
            supplier={supplier}
            currentUser={currentUser}
            instantBook={instantBook}
          />
        </Elements>
      </StripeProvider>
    )
  }
}

export default CheckoutPageContainer
