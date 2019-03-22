import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, isInstantBook } from 'services/page'
import { createPOM } from 'utils/helper'

const POM_NAME = 'Peace Of Mind Policy'

function addCheckoutToHeader() {
  const logoPhone = document.querySelector('.heading--logo-phone')
  logoPhone.insertAdjacentHTML(
    'afterend',
    '<div style="font-size: 2rem; color: #fff; position: relative; left: -25px;">Checkout</div>'
  )
}

class CheckoutPageContainer extends Component {
  constructor(props) {
    super(props)

    addCheckoutToHeader()

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
      instantBook: isInstantBook(),
      hasPOM: false
    }

    this.stripePublicKey = window.RIDETO_PAGE.stripe_key
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
    this.handlePOMToggleClick = this.handlePOMToggleClick.bind(this)

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
      checkoutData: newCheckoutData,
      hasPOM: true
    })
  }

  handleRemovePOM() {
    const { checkoutData } = this.state

    this.setState({
      checkoutData: {
        ...checkoutData,
        addons: checkoutData.addons.filter(addon => addon.name !== POM_NAME)
      },
      hasPOM: false
    })
  }

  handlePOMToggleClick() {
    const { hasPOM } = this.state

    if (hasPOM) {
      this.handleRemovePOM()
    } else {
      this.handleAddPOM()
    }
  }

  render() {
    const {
      checkoutData,
      loading,
      supplier,
      instantBook,
      trainings,
      hasPOM
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
            handlePOMToggleClick={this.handlePOMToggleClick}
            hasPOM={hasPOM}
          />
        </Elements>
      </StripeProvider>
    )
  }
}

export default CheckoutPageContainer
