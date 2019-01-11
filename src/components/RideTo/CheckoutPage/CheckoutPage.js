import React, { Component } from 'react'
import { injectStripe } from 'react-stripe-elements'
import moment from 'moment'
import { omit, set } from 'lodash'
import styles from './styles.scss'
import UserDetails from './UserDetails'
import OrderSummary from './OrderSummary'
import { fetchAddressWithPostcode } from 'services/misc'
import { createOrder, createStripeToken } from 'services/widget'
import { getPrice } from 'services/course'
import { getUserProfile, getToken, isAuthenticated } from 'services/auth'
import { fetchUser } from 'services/user'
import { isInstantBook } from 'services/page'
import { getExpectedPrice } from 'services/order'
import AddressSelectModal from 'components/RideTo/AddressSelectModal'

const getStripeError = error => {
  const field = error.code.split('_').slice(-1)[0]
  const errorId = `card_${field}`

  return {
    [errorId]: error.message
  }
}

const REQUIRED_FIELDS = [
  'user_birthdate',
  'phone',
  'current_licence',
  'riding_experience',
  'rider_type',
  'card_name',
  'card_number',
  'cvv',
  'card_zip',
  'expiry_date',
  'first_name',
  'last_name',
  'email'
]

const NO_ADDONS_ADDRESS = {
  address_1: 'no',
  town: 'no',
  postcode: 'no'
}

const REQUIRED_ADDRESS_FIELDS = ['address_1', 'town', 'postcode']

class CheckoutPage extends Component {
  constructor(props) {
    super(props)

    const emptyAddress = {
      address_1: '',
      address_2: '',
      town: '',
      postcode: ''
    }

    this.state = {
      details: {
        first_name: '',
        last_name: '',
        email: '',
        user_birthdate: '',
        phone: '',
        current_licence: '',
        riding_experience: '',
        rider_type: '',
        address: { ...emptyAddress },
        card_name: '',
        sameAddress: true,
        billingAddress: { ...emptyAddress },
        card_number: false,
        cvv: false,
        expiry_date: false,
        postcode: '',
        voucher_code: '',
        accept_terms: false,
        email_optin: false
      },
      priceInfo: {
        price: 0,
        discount: 0,
        bike_hire_cost: 0
      },
      manualAddress: false,
      postcodeLookingup: false,
      addresses: [],
      errors: {
        address: {},
        billingAddress: {},
        divId: false
      },
      saving: false,
      showAddressSelectorModal: false,
      voucher_code: '',
      loadingPrice: false,
      showMap: false,
      trainings: this.props.trainings
    }

    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleVoucherApply = this.handleVoucherApply.bind(this)
    this.handleMapButtonClick = this.handleMapButtonClick.bind(this)
    this.recordGAEcommerceData = this.recordGAEcommerceData.bind(this)
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  async componentDidMount() {
    await this.loadPrice() // need to wait since getLoggedInUserDetails also sets state of details
    this.getLoggedInUserDetails()
  }

  async getLoggedInUserDetails() {
    const userAuthenticated = isAuthenticated()
    if (userAuthenticated) {
      const user = getUserProfile(getToken())
      if (user) {
        const userDetails = await fetchUser(user.username)
        const details = { ...this.state.details, ...userDetails }
        const errors = {
          ...this.state.errors,
          first_name: null,
          last_name: null,
          email: null
        }
        this.setState({ details, errors })
      }
    }
  }

  async loadPrice(voucher_code) {
    try {
      const { supplierId, courseId, date, courseType } = this.props.checkoutData
      const { details, trainings } = this.state
      const isFullLicence = courseType === 'FULL_LICENCE'
      let params = {
        supplierId,
        courseId,
        date,
        course_type: courseType,
        voucher_code
      }
      this.setState({ loadingPrice: true })
      if (isFullLicence) {
        let fullPrice = 0
        const newTrainings = await Promise.all(
          trainings.map(async training => {
            const price = await getPrice({ courseId: 2993 })
            fullPrice += parseInt(price.price, 10)

            return {
              ...training,
              price: price.price
            }
          })
        )

        this.setState({
          priceInfo: { ...this.state.priceInfo, price: fullPrice },
          trainings: newTrainings
        })
      } else {
        let response = await getPrice(params)
        if (voucher_code && response.discount) {
          details.voucher_code = voucher_code
        } else {
          details.voucher_code = ''
        }
        this.setState({
          priceInfo: { ...response },
          loadingPrice: false,
          details
        })
      }
    } catch (error) {
      this.setState({ loadingPrice: false })
      console.log('Error', error)
    }
  }

  handleVoucherApply() {
    const { voucher_code } = this.state
    this.loadPrice(voucher_code)
  }

  handleErrors(errors) {
    this.setState({ errors })
  }

  handleChange(data) {
    let { details } = this.state
    this.setState({ details: { ...details, ...data } })
  }

  handleValueChange(path, value) {
    let { details, errors } = this.state
    errors.divId = false
    set(details, path, value)
    set(errors, path, null)
    this.setState({ details, errors })
  }

  async handlePostalcodeSubmit(postcode) {
    try {
      this.setState({ postcodeLookingup: true })
      let response = await fetchAddressWithPostcode({
        postcode: postcode.trim()
      })
      if (response && response.addresses && response.addresses.length > 0) {
        this.setState({
          postcodeLookingup: false,
          showAddressSelectorModal: true,
          addresses: response.addresses
        })
      } else {
        let { errors } = this.state
        errors.postcode = 'No address has been found with postal code'
        this.setState({ postcodeLookingup: false, errors })
      }
    } catch (error) {
      console.log('Error - ', error)
      let { errors } = this.state
      errors.postcode = `${error}`
      this.setState({ postcodeLookingup: false, errors })
    }
  }

  handleSelectAddress(addressString) {
    // "Line1,Line2,Line3,Line4,Locality,Town/City,County"
    const { details } = this.state
    let parts = addressString.split(',')
    let address = {
      address_1: parts[0].trim(),
      address_2: parts[1].trim(),
      town: parts[5].trim(),
      postcode: details.postcode.trim()
    }

    details.address = address

    this.setState({
      details,
      showAddressSelectorModal: false,
      manualAddress: true
    })
  }

  handleMapButtonClick() {
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }))
  }

  isValidDate(dateString) {
    const minYears = 16
    const trainingDate = moment(this.props.checkoutData.date, 'YYYY-MM-DD')
    const date = moment(dateString, 'DD/MM/YYYY')
    const isComplete = dateString.slice(-1) !== '_'

    if (isComplete && minYears && trainingDate) {
      return trainingDate.diff(date, 'years') >= minYears
    }

    return isComplete || date.isValid()
  }

  getErrorDivId(field) {
    switch (field) {
      case 'user_birthdate':
      case 'phone':
      case 'current_licence':
      case 'riding_experience':
      case 'rider_type':
      case 'first_name':
      case 'last_name':
      case 'email':
        return 'checkout-your-details'
      case 'card_name':
      case 'card_number':
      case 'cvv':
      case 'card_zip':
      case 'expiry_date':
        return 'checkout-payment-details'
      default:
        break
    }
  }

  validateDetails(details) {
    const addonsCount = this.props.checkoutData.addons.length
    const errors = { address: {}, billingAddress: {}, divId: false }
    let hasError = false

    //Check if all required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!details[field]) {
        errors[field] = 'This field is required.'
        if (!errors.divId) errors.divId = this.getErrorDivId(field)
        hasError = true
      }
    })

    // Check delivery address only if there are addons
    if (addonsCount > 0) {
      // Check postcode serach field only if
      // manual address form is not open
      if (!details['postcode'] && !this.state.manualAddress) {
        errors['postcode'] = 'This field is required.'
        if (!errors.divId) errors.divId = 'checkout-delivery-address'
        hasError = true
      }

      // Check Address form only if address form is open
      if (this.state.manualAddress) {
        REQUIRED_ADDRESS_FIELDS.forEach(field => {
          if (!details.address[field]) {
            errors.address[field] = 'This field is required.'
            if (!errors.divId) errors.divId = 'checkout-delivery-address'
            hasError = true
          }
          if (!details.sameAddress && !details.billingAddress[field]) {
            errors.billingAddress[field] = 'This field is required.'
            if (!errors.divId) errors.divId = 'checkout-delivery-address'
            hasError = true
          }
        })
      }
    }

    if (!details.phone.match(/^\+44\d{10}$/)) {
      errors['phone'] = 'Invalid phone number'
      if (!errors.divId) errors.divId = this.getErrorDivId('phone')
      hasError = true
    }

    if (!this.isValidDate(details.user_birthdate)) {
      errors['user_birthdate'] =
        'You must be at least 16 years old to do your training. (On the selected date of training)'
      if (!errors.divId) errors.divId = this.getErrorDivId('user_birthdate')
      hasError = true
    }

    this.setState({
      errors: errors
    })

    return !hasError
  }

  async checkEmail(email) {
    const userAuthenticated = isAuthenticated()
    if (userAuthenticated) {
      const user = getUserProfile(getToken())
      if (user.email === email) {
        return { error: false, errorMessage: '' }
      } else {
        return {
          error: true,
          errorMessage:
            'You are already logged in with other email. Try using that email'
        }
      }
    } else {
      try {
        const userDetails = await fetchUser(email)
        if (userDetails.error) {
          return { error: false, errorMessage: '' }
        } else {
          return {
            error: true,
            errorMessage:
              'There is a registered user with this email. Login to continue'
          }
        }
      } catch (error) {
        return { error: false, errorMessage: '' }
      }
    }
  }

  async handlePayment() {
    const { details } = this.state
    const {
      stripe,
      checkoutData: { addons }
    } = this.props

    if (addons.length <= 0) {
      details.address = NO_ADDONS_ADDRESS
    }

    //Check if email already exists or user logged in
    const result = await this.checkEmail(details.email)
    if (result.error) {
      this.setState({
        errors: {
          email: result.errorMessage,
          divId: this.getErrorDivId('email')
        }
      })
      return
    }

    if (!this.validateDetails(details)) {
      return
    }

    this.setState({ errors: {}, saving: true })
    try {
      const response = await createStripeToken(stripe, {
        name: details.card_name
      })

      if (response.error) {
        this.handleErrors({
          ...this.state.errors,
          ...getStripeError(response.error)
        })
      } else {
        const { token } = response
        this.submitOrder(token)
      }
    } catch (error) {
      console.log('Error', error)
      this.setState({ saving: false })
    }
  }

  async submitOrder(stripeToken) {
    const { checkoutData } = this.props
    const { priceInfo } = this.state
    const details = omit(this.state.details, [
      'card_name',
      'billingAddress',
      'sameAddress'
    ])
    const {
      addons,
      date,
      courseType,
      supplierId,
      bike_hire,
      courseId
    } = checkoutData
    const addonIds = addons.map(addon => {
      let ad = { addon_id: addon.id }
      if (addon.selectedSize) {
        ad.size_id = addon.selectedSize.id
      }
      return ad
    })
    const birthdate = moment(details.user_birthdate, 'DD/MM/YYYY')

    const data = {
      ...details,
      // email_optin: details.email_optin || false,
      school_course_id: courseId,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: stripeToken.id,
      expected_price: getExpectedPrice(priceInfo, addons, checkoutData),
      name: `${details.first_name} ${details.last_name}`,
      user_date: date,
      selected_licence: courseType,
      supplier: supplierId,
      bike_hire: bike_hire,
      addons: addonIds,
      source: isInstantBook() ? 'RIDETO_INSTANT' : 'RIDETO',
      accept_equipment_responsibility: true
    }

    try {
      const response = await createOrder(data)
      if (response) {
        const { order, token: userToken } = response
        if (userToken !== null) {
          window.localStorage.setItem('token', JSON.stringify(userToken))
        }
        this.recordGAEcommerceData(order) //Ecommerce tracking trigger
        window.location.href = `/account/dashboard/${order.id}`
      } else {
        this.setState({ saving: false })
      }
    } catch (error) {
      this.setState({ saving: false })

      if (error.response && error.response.data) {
        const { data } = error.response

        if (data.message) {
          this.handleErrors({ paymentError: data.message })
        } else if (error.response.status === 403) {
          this.handleErrors({
            paymentError: 'Your session has expired. Redirecting to login...'
          })
          window.location = '/account/login' // Session expired or user not logged in
        } else {
          this.handleErrors(data)
          window.document.body.scrollIntoView()
        }
      }
    }
  }

  recordGAEcommerceData(order) {
    if (order) {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        transactionId: order.friendly_id,
        transactionAffiliation: 'RideTo',
        transactionTotal: order.revenue,
        transactionProducts: [
          {
            sku: order.friendly_id,
            name: order.selected_licence,
            category: order.supplier_name,
            price: order.revenue,
            quantity: 1
          }
        ],
        event: 'rideto.ecom-purchase.completed'
      })
    }
  }

  render() {
    const {
      details,
      manualAddress,
      postcodeLookingup,
      priceInfo,
      errors,
      saving,
      showAddressSelectorModal,
      addresses,
      voucher_code,
      loadingPrice,
      showMap,
      trainings
    } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <UserDetails
            {...this.props}
            details={details}
            errors={errors}
            priceInfo={priceInfo}
            onDetailChange={this.handleValueChange}
            onPaymentChange={this.handleOnPaymentChange}
            onChange={this.onUpdate}
            manualAddress={manualAddress}
            onPostalCodeSubmit={this.handlePostalcodeSubmit}
            postcodeLookingup={postcodeLookingup}
            showMap={showMap}
            handleMapButtonClick={this.handleMapButtonClick}
          />
        </div>
        <div className={styles.rightPanel}>
          <OrderSummary
            {...this.props}
            errors={errors}
            details={details}
            priceInfo={priceInfo}
            onSubmit={this.handlePayment}
            saving={saving}
            onChange={this.onUpdate}
            onDetailChange={this.handleValueChange}
            voucher_code={voucher_code}
            handleVoucherApply={this.handleVoucherApply}
            loadingPrice={loadingPrice}
            showMap={showMap}
            handleMapButtonClick={this.handleMapButtonClick}
            trainings={trainings}
          />
        </div>
        {showAddressSelectorModal && (
          <AddressSelectModal
            addresses={addresses}
            isOpen={true}
            onClose={() => this.setState({ showAddressSelectorModal: false })}
            onSelect={this.handleSelectAddress.bind(this)}
          />
        )}
      </div>
    )
  }
}

export default injectStripe(CheckoutPage)
