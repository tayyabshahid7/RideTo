import React, { Component } from 'react'
import moment from 'moment'
import { DATE_FORMAT } from 'common/constants'
import CheckoutPage from './CheckoutPage'
import { Elements, StripeProvider } from 'react-stripe-elements'
import { getSupplier, isInstantBook } from 'services/page'
import { createPOM } from 'utils/helper'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './styles.scss'
import { capitalizeFirstLetter, normalizePostCode } from 'utils/helper'

import { Modal } from 'reactstrap'
import POMModal from './POMModal'

const POM_NAME = 'Peace Of Mind Policy'

function addCheckoutToHeader() {
  const logoPhone = document.querySelector('.heading--logo-phone')
  logoPhone &&
    logoPhone.insertAdjacentHTML(
      'afterend',
      '<style>@media(max-width: 768px) { #checkout-title { display: none; } }</style><div id="checkout-title" style="color: rgba(255, 255, 255, 0.5); font-size: 20px; font-family: var(--font-rift-bold); margin-left: -32px;">Checkout</div>'
    )
}

function backToResults(postcode) {
  const normalizedPostCode = normalizePostCode(postcode)
  const path = `/course-location/?postcode=${normalizedPostCode}&courseType=LICENCE_CBT`

  window.location = path
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

    if (!this.trainings) {
      backToResults(supplier.postcode)
    }

    this.state = {
      loading: false,
      checkoutData: this.checkoutData || { addons: [] },
      trainings: this.trainings,
      supplier,
      instantBook: isInstantBook(),
      // hasPOM: this.checkoutData.addons.find(
      //   ({ name }) => name === 'Peace Of Mind Policy'
      // )
      //   ? true
      //   : false,
      hasPOM: false,
      isInexperienced: false
    }

    this.stripePublicKey = window.RIDETO_PAGE.stripe_key
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handeUpdateOption = this.handeUpdateOption.bind(this)
    this.handlePOMToggleClick = this.handlePOMToggleClick.bind(this)
    this.showPromoNotification = this.showPromoNotification.bind(this)
    this.handleAddPOM = this.handleAddPOM.bind(this)

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
      hasPOM: true,
      isInexperienced: false
    })
  }

  handleRemovePOM() {
    const { checkoutData } = this.state

    this.setState({
      checkoutData: {
        ...checkoutData,
        addons: checkoutData.addons.filter(addon => addon.name !== POM_NAME)
      },
      hasPOM: false,
      isInexperienced: false
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

  showPromoNotification(text = 'Promo code applied!', type = 'add') {
    toast(text, {
      toastId: 'add',
      className: styles[`toast${capitalizeFirstLetter(type)}`]
    })
  }

  closePOMModal = () => {
    this.setState({
      isInexperienced: false
    })
  }

  render() {
    const {
      checkoutData,
      loading,
      supplier,
      instantBook,
      trainings,
      hasPOM,
      isInexperienced
    } = this.state
    const offersPOM = ['LICENCE_CBT_RENEWAL', 'LICENCE_CBT'].includes(
      checkoutData.courseType
    )

    return (
      <React.Fragment>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
        <Modal
          isOpen={offersPOM && isInexperienced && !hasPOM}
          size="md"
          className={styles.modalContent}>
          <POMModal
            closeModal={this.closePOMModal}
            handleAddPOM={this.handleAddPOM}
          />
        </Modal>
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
              showPromoNotification={this.showPromoNotification}
              handeUpdateOption={this.handeUpdateOption}
            />
          </Elements>
        </StripeProvider>
      </React.Fragment>
    )
  }
}

export default CheckoutPageContainer
