import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, isInstantBook } from 'services/page'

const POM_NAME = 'Peace Of Mind Policy'

function createPOM() {
  const pom = window.RIDETO_PAGE.checkout.addons.find(
    addon => addon.name === POM_NAME
  )
  pom.price = pom.discount_price
  pom.selectedSize = pom.sizes[0]

  return pom
}

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

    this.POM = createPOM()
  }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handeUpdateOption(data) {
    this.setState({ ...data })
  }

  handleAddPOM() {
    const { checkoutData } = this.state
    const newCheckoutData = { ...checkoutData }

    if (!newCheckoutData.addons.some(addon => addon.name === POM_NAME)) {
      newCheckoutData.addons = [...newCheckoutData.addons, this.POM]
    }

    this.setState({
      checkoutData: newCheckoutData
    })
  }

  handleRemovePOM() {
    const { checkoutData } = this.state

    this.setState({
      checkoutData: {
        ...checkoutData,
        addons: checkoutData.addons.filter(addon => addon.name !== POM_NAME)
      }
    })
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
