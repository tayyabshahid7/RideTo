import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { DATE_FORMAT } from 'common/constants'
import moment from 'moment'
import React, { Component } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Modal } from 'reactstrap'
import { getExpectedPrice } from 'services/order'
import { getSupplier, isInstantBook } from 'services/page'
import {
  capitalizeFirstLetter,
  createPOM,
  normalizePostCode
} from 'utils/helper'
import { getPriceV2 } from '../../../services/course'
import {
  createPaymentIntentSecretClient,
  updatePaymentIntentSecretClient
} from '../../../services/stripe'
import CheckoutPage from './CheckoutPage'
import POMModal from './POMModal'
import styles from './styles.scss'

const POM_NAME = 'Peace Of Mind Policy'

const stripePromise = loadStripe(window.RIDETO_PAGE.stripe_key, {
  locale: 'en-GB'
})

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
      hasPOM: this.checkoutData.addons.find(
        ({ name }) => name === 'Peace Of Mind Policy'
      )
        ? true
        : false,
      isInexperienced: false,
      priceInfo: {
        price: 0,
        priceBeforeFee: 0,
        fee: 0,
        discount: 0,
        bike_hire_cost: 0
      },
      loadingPrice: true,
      clientSecret: '',
      stripePaymentIntentID: '',
      paymentType: 'card'
    }

    this.stripePublicKey = window.RIDETO_PAGE.stripe_key
    this.handleSetDate = this.handleSetDate.bind(this)
    this.handleUpdateOption = this.handleUpdateOption.bind(this)
    this.handlePOMToggleClick = this.handlePOMToggleClick.bind(this)
    this.showPromoNotification = this.showPromoNotification.bind(this)
    this.handleAddPOM = this.handleAddPOM.bind(this)

    this.POM = createPOM()
  }

  async componentDidMount() {
    await this.getInitialPrice()
    await this.fetchSecretClient()
  }

  async fetchSecretClient() {
    const { priceInfo, checkoutData, supplier, paymentType } = this.state
    const { addons, courseType } = checkoutData
    const { price: expected_price } = await getExpectedPrice(
      priceInfo,
      addons,
      checkoutData,
      paymentType
    )
    this.setState({ totalPrice: expected_price })
    const { client_secret, id } = await createPaymentIntentSecretClient(
      expected_price,
      supplier.id,
      courseType
    )

    if (client_secret) {
      this.setState({
        clientSecret: client_secret,
        stripePaymentIntentID: id
      })
    }
  }

  async getInitialPrice() {
    try {
      const { instantBook, checkoutData, trainings } = this.state
      const { supplierId, courseId, date, courseType, addons } = checkoutData
      const isFullLicence = courseType === 'FULL_LICENCE'
      const hasHighwayCode = !!addons.find(
        ({ name }) => name === 'Highway Code Book'
      )
      let params = {
        supplierId,
        courseId,
        date,
        course_type: courseType,
        order_source: instantBook ? 'RIDETO_INSTANT' : 'RIDETO',
        highway_code: hasHighwayCode
      }
      if (isFullLicence) {
        const training = trainings[0]
        let response = await getPriceV2({
          supplierId: training.supplier_id,
          course_type: training.course_type,
          hours: training.package_hours,
          order_source: 'RIDETO',
          highway_code: hasHighwayCode
        })
        this.setState({
          priceInfo: { ...response }
        })
      } else {
        let response = await getPriceV2(params)
        this.setState({
          priceInfo: { ...response }
        })
      }
    } catch (error) {
      console.log('Error', error)
    }
  }

  handleSetDate(date) {
    this.setState({ date: moment(date).format(DATE_FORMAT) })
  }

  handleUpdateOption(data) {
    this.setState({ ...data })
  }

  async handleAddPOM() {
    const { checkoutData, stripePaymentIntentID, priceInfo } = this.state
    const newCheckoutData = { ...checkoutData }

    if (!newCheckoutData.addons.some(addon => addon.name === POM_NAME)) {
      newCheckoutData.addons = [...newCheckoutData.addons, this.POM]
    }

    this.setState(
      {
        checkoutData: newCheckoutData,
        hasPOM: true,
        isInexperienced: false
      },
      async () => {
        const { price, fee, priceBeforeFee } = await getExpectedPrice(
          this.state.priceInfo,
          this.state.checkoutData.addons,
          this.state.checkoutData,
          this.state.paymentType
        )
        await updatePaymentIntentSecretClient(stripePaymentIntentID, {
          amount: price
        })

        this.setState({
          priceInfo: { ...priceInfo, price, fee, priceBeforeFee }
        })
        return
      }
    )
  }

  async handleRemovePOM() {
    const { checkoutData, stripePaymentIntentID, priceInfo } = this.state

    this.setState(
      {
        checkoutData: {
          ...checkoutData,
          addons: checkoutData.addons.filter(addon => addon.name !== POM_NAME)
        },
        hasPOM: false,
        isInexperienced: false
      },
      async () => {
        const { price, fee, priceBeforeFee } = await getExpectedPrice(
          this.state.priceInfo,
          this.state.checkoutData.addons,
          this.state.checkoutData,
          this.state.paymentType
        )
        await updatePaymentIntentSecretClient(stripePaymentIntentID, {
          amount: price
        })
        this.setState({
          priceInfo: { ...priceInfo, price, fee, priceBeforeFee }
        })
        return
      }
    )
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
      isInexperienced,
      clientSecret,
      stripePaymentIntentID,
      priceInfo
    } = this.state
    const offersPOM = ['LICENCE_CBT_RENEWAL', 'LICENCE_CBT'].includes(
      checkoutData.courseType
    )

    // Set stripe element appearance
    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#141414',
        colorText: '#141414',
        borderRadius: '0',
        spacingUnit: '5px',
        fontFamily: 'ProximaNova, Helvetica, Arial, sans-serif',
        colorIconHover: '#141414'
      },
      rules: {
        '.Label': {
          textTransform: 'capitalize'
        }
      }
    }
    const proximaNova = {
      family: 'ProximaNova',
      src:
        'url(https://bike-tests.s3.eu-west-2.amazonaws.com/ProximaNovaAltRegular-webfont.woff)',
      weight: '400'
    }
    const stripeOptions = {
      appearance,
      clientSecret,
      locale: 'en-GB',
      fonts: [proximaNova]
    }
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
        {clientSecret && (
          <Elements stripe={stripePromise} options={stripeOptions}>
            <CheckoutPage
              checkoutData={checkoutData}
              loading={loading}
              supplier={supplier}
              instantBook={instantBook}
              trainings={trainings}
              handlePOMToggleClick={this.handlePOMToggleClick}
              hasPOM={hasPOM}
              showPromoNotification={this.showPromoNotification}
              handleUpdateOption={this.handleUpdateOption}
              clientSecret={clientSecret}
              stripePaymentIntentID={stripePaymentIntentID}
              priceInfo={priceInfo}
            />
          </Elements>
        )}
      </React.Fragment>
    )
  }
}

export default CheckoutPageContainer
