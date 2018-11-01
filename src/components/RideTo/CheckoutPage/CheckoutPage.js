import React, { Component } from 'react'
import { injectStripe } from 'react-stripe-elements'
import moment from 'moment'
import { omit, set, pick } from 'lodash'
import styles from './styles.scss'
import UserDetails from './UserDetails'
import OrderSummary from './OrderSummary'
import { fetchAddressWithPostcode } from 'services/misc'
import { createOrder, createStripeToken } from 'services/widget'
import { getPrice } from 'services/course'
import { isInstantBook } from 'services/page'
import { getExpectedPrice } from 'services/order'
import AddressSelectModal from 'components/RideTo/AddressSelectModal'
import { PHONE_NUMBER_LENGTH } from 'common/constants'

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
  'expiry_date'
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
        accept_terms: false
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
      loadingPrice: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleVoucherApply = this.handleVoucherApply.bind(this)
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  componentDidMount() {
    this.loadPrice()
  }

  async loadPrice(voucher_code) {
    try {
      const { supplierId, courseId, date, courseType } = this.props.checkoutData
      const { details } = this.state
      let params = {
        supplierId,
        courseId,
        date,
        course_type: courseType,
        voucher_code
      }
      this.setState({ loadingPrice: true })
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
    const currentUser = this.props.currentUser
    const addonsCount = this.props.checkoutData.addons.length
    const errors = { address: {}, billingAddress: {}, divId: false }
    let hasError = false

    if (!currentUser) {
      window.location = '/account/login'
      hasError = true
      return
    }

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

    if (details.phone.replace('_', '').length !== PHONE_NUMBER_LENGTH) {
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

  async handlePayment() {
    const { details } = this.state
    const {
      stripe,
      checkoutData: { addons }
    } = this.props

    if (addons.length <= 0) {
      details.address = NO_ADDONS_ADDRESS
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
        this.createOrder(token)
      }
    } catch (error) {
      console.log('Error', error)
      this.setState({ saving: false })
    }
  }

  async createOrder(token) {
    const { checkoutData, currentUser } = this.props
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
      ...pick(currentUser, ['first_name', 'last_name', 'email']),
      email_optin: details.email_optin || false,
      school_course_id: courseId,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: token.id,
      expected_price: getExpectedPrice(priceInfo, addons, checkoutData),
      name: currentUser.first_name + ' ' + currentUser.last_name,
      user_date: date,
      selected_licence: courseType,
      supplier: supplierId,
      bike_hire: bike_hire,
      addons: addonIds,
      source: isInstantBook() ? 'RIDETO_INSTANT' : 'RIDETO',
      accept_equipment_responsibility: true
    }

    try {
      const response = await createOrder(data, true)
      if (response) {
        window.location.href = `/account/dashboard/${response.id}`
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
      loadingPrice
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