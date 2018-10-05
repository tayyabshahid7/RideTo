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
  'card_name'
]

const REQUIRED_ADDRESS_FIELDS = ['address_1', 'town', 'county', 'postcode']

class CheckoutPage extends Component {
  constructor(props) {
    super(props)

    const emptyAddress = {
      address_1: '',
      address_2: '',
      town: '',
      county: '',
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
        billingAddress: { ...emptyAddress }
      },
      coursePrice: 0,
      manualAddress: false,
      postcodeLookingup: false,
      addresses: [],
      errors: {
        address: {},
        billingAddress: {}
      },
      saving: false,
      showAddressSelectorModal: false,
      postcode: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  componentDidMount() {
    this.loadPrice()
  }

  async loadPrice() {
    try {
      const { supplierId, courseId, date, courseType } = this.props.checkoutData
      let response = await getPrice({
        supplierId,
        courseId,
        date,
        course_type: courseType
      })
      let price = courseId ? response.pricing.price : response.price
      this.setState({ coursePrice: price })
    } catch (error) {
      console.log('Error', error)
    }
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
    set(details, path, value)
    set(errors, path, null)
    this.setState({ details, errors })
  }

  async handlePostalcodeSubmit(postcode) {
    try {
      this.setState({ postcodeLookingup: true })
      let response = await fetchAddressWithPostcode({ postcode })
      if (response && response.addresses && response.addresses.length > 0) {
        this.setState({
          postcodeLookingup: false,
          showAddressSelectorModal: true,
          addresses: response.addresses,
          postcode
        })
      } else {
        this.setState({ postcodeLookingup: false })
      }
    } catch (error) {
      console.log('Error - ', error)
      this.setState({ postcodeLookingup: false })
    }
  }

  handleSelectAddress(addressString) {
    // "Line1,Line2,Line3,Line4,Locality,Town/City,County"
    const { postcode, details } = this.state
    let parts = addressString.split(',')
    let address = {
      address_1: parts[0].trim(),
      address_2: parts[1].trim(),
      town: parts[5].trim(),
      county: parts[6].trim(),
      postcode: postcode.trim()
    }

    details.address = address

    this.setState({
      details,
      showAddressSelectorModal: false,
      manualAddress: true
    })
  }

  validateDetails(details) {
    const errors = { address: {}, billingAddress: {} }
    let hasError = false
    REQUIRED_FIELDS.forEach(field => {
      if (!details[field]) {
        errors[field] = 'This field is required.'
        hasError = true
      }
    })

    REQUIRED_ADDRESS_FIELDS.forEach(field => {
      if (!details.address[field]) {
        errors.address[field] = 'This field is required.'
        hasError = true
      }
      if (!details.sameAddress && !details.billingAddress[field]) {
        errors.billingAddress[field] = 'This field is required.'
        hasError = true
      }
    })
    this.setState({
      errors: errors
    })

    return !hasError
  }

  async handlePayment() {
    const { details } = this.state
    const { stripe } = this.props
    if (!this.validateDetails(details)) {
      return
    }

    this.setState({ errors: {}, saving: true })
    try {
      let address = details.sameAddress
        ? details.address
        : details.billingAddress
      const response = await createStripeToken(stripe, {
        name: details.card_name,
        address_line1: address.address_1,
        address_line2: address.address_2,
        address_city: address.town,
        address_state: address.county,
        address_zip: address.postcode,
        address_country: 'GB'
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
    const { history, checkoutData, currentUser } = this.props
    const { coursePrice } = this.state
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
      expected_price: getExpectedPrice(coursePrice, addons),
      name: `${this.state.details.card_name}`,
      user_date: date,
      selected_licence: courseType,
      supplier: supplierId,
      bike_hire: bike_hire,
      addons: addonIds,
      accept_terms: true,
      source: isInstantBook() ? 'RIDETO_INSTANT' : 'RIDETO',
      accept_equipment_responsibility: true, // TODO Needs to be removed
      voucher_code: ''
    }

    try {
      const response = await createOrder(data)
      this.setState({ saving: false })
      if (response) {
        history.push(`/`)
      }
    } catch (error) {
      this.setState({ saving: false })
      if (error.response && error.response.data) {
        const { data } = error.response

        if (data.message) {
          this.handleErrors({ paymentError: data.message })
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
      coursePrice,
      errors,
      saving,
      showAddressSelectorModal,
      addresses
    } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <UserDetails
            {...this.props}
            details={details}
            errors={errors}
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
            coursePrice={coursePrice}
            onSubmit={this.handlePayment}
            saving={saving}
          />
        </div>
        {showAddressSelectorModal && (
          <AddressSelectModal
            addresses={addresses}
            isOpen={true}
            closeModal={() =>
              this.setState({ showAddressSelectorModal: false })
            }
            onSelect={this.handleSelectAddress.bind(this)}
          />
        )}
      </div>
    )
  }
}

export default injectStripe(CheckoutPage)
