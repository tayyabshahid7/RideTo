import React, { Component } from 'react'
import { injectStripe } from 'react-stripe-elements'
import moment from 'moment'
import omit from 'lodash/omit'
import set from 'lodash/set'
import styles from './styles.scss'
import UserDetails from './UserDetails'
import OrderSummary from './OrderSummary'
import { fetchAddressWithPostcode } from 'services/misc'
import { createOrder } from 'services/widget'
import { handleStripePayment } from 'services/stripe'
import { getPrice, getLicenceAge } from 'services/course'
import {
  getUserProfile,
  getToken,
  isAuthenticated,
  removeToken
} from 'services/auth'
import { fetchUser, saveCheckoutEmail } from 'services/user'
import { isInstantBook } from 'services/page'
import { getExpectedPrice } from 'services/order'
import { tldExists } from 'tldjs'
import classnames from 'classnames'
import loadable from '@loadable/component'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'

const AddressSelectModal = loadable(() =>
  import('components/RideTo/AddressSelectModal')
)

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

const USER_FIELDS = [
  'user_birthdate',
  'phone',
  'current_licence',
  'riding_experience',
  'rider_type',
  'first_name',
  'last_name',
  'email'
]

const CARD_FIELDS = REQUIRED_FIELDS.filter(
  field => !USER_FIELDS.includes(field)
)

const NO_ADDONS_ADDRESS = {
  address_1: 'no',
  town: 'no',
  postcode: 'no'
}

const REQUIRED_ADDRESS_FIELDS = ['address_1', 'town', 'postcode']

const emptyAddress = {
  address_1: '',
  address_2: '',
  town: '',
  postcode: ''
}

class CheckoutPage extends Component {
  constructor(props) {
    super(props)

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
      trainings: this.props.trainings,
      showUserDetails: false,
      showCardDetails: false,
      physicalAddonsCount: this.props.checkoutData.addons.filter(
        addon => addon.name !== 'Peace Of Mind Policy'
      ).length,
      cardElement: null,
      emailSubmitted: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleVoucherApply = this.handleVoucherApply.bind(this)
    this.handleMapButtonClick = this.handleMapButtonClick.bind(this)
    this.handleChangeEmailClick = this.handleChangeEmailClick.bind(this)
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
        const details = {
          ...this.state.details,
          ...userDetails,
          ...(userDetails.birthdate
            ? {
                user_birthdate: moment(userDetails.birthdate).format(
                  'DD/MM/YYYY'
                )
              }
            : null)
        }
        const errors = {
          ...this.state.errors,
          first_name: null,
          last_name: null,
          email: null
        }
        this.setState({
          details,
          errors,
          emailSubmitted: true,
          showUserDetails: true,
          showCardDetails: true
        })
      }
    }
  }

  async loadPrice(voucher_code) {
    try {
      const { instantBook } = this.props
      const { supplierId, courseId, date, courseType } = this.props.checkoutData
      const { details, trainings } = this.state
      const isFullLicence = courseType === 'FULL_LICENCE'
      let params = {
        supplierId,
        courseId,
        date,
        course_type: courseType,
        voucher_code,
        order_source: instantBook ? 'RIDETO_INSTANT' : 'RIDETO'
      }
      this.setState({ loadingPrice: true })
      if (isFullLicence) {
        const training = trainings[0]
        let response = await getPrice({
          supplierId: training.supplier_id,
          course_type: training.course_type,
          hours: training.package_hours,
          voucher_code,
          order_source: 'RIDETO'
        })

        this.setState({
          priceInfo: { ...response },
          loadingPrice: false,
          details: {
            ...details,
            voucher_code: voucher_code && response.discount ? voucher_code : ''
          }
        })
      } else {
        let response = await getPrice(params)
        if (voucher_code && response.discount) {
          details.voucher_code = voucher_code
          this.props.showPromoNotification('Promo code applied!', 'add')
        } else {
          details.voucher_code = ''
          if (voucher_code) {
            this.props.showPromoNotification('Invalid promo code.', 'error')
          }
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
    let newDetails = { ...details }
    let newErrors = { ...errors }
    newErrors.divId = false
    set(newDetails, path, value)
    set(newErrors, path, null)
    this.setState({ details: newDetails, errors: newErrors })
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
    const { trainings } = this.props
    const { courseType } = this.props.checkoutData
    let minYears = 16
    let maxYears = 100
    let trainingDate = moment(this.props.checkoutData.date, 'YYYY-MM-DD')

    if (courseType === 'FULL_LICENCE') {
      trainingDate = moment(trainings[0].requested_date, 'YYYY-MM-DD')
      minYears = getLicenceAge(trainings[0].full_licence_type)
    }

    const date = moment(dateString, 'DD/MM/YYYY')
    const isComplete = dateString.slice(-1) !== '_'

    if (!isComplete || !date.isValid()) {
      return false
    }

    if (isComplete && minYears && maxYears && trainingDate) {
      // return (
      //   trainingDate.diff(date, 'years') >= minYears &&
      //   trainingDate.diff(date, 'years') < maxYears
      // )
      if (trainingDate.diff(date, 'years') < minYears) {
        return {
          error: true,
          message:
            'You must be at least 16 years old to do your training. (On the selected date of training)'
        }
      }
      if (trainingDate.diff(date, 'years') >= maxYears) {
        return {
          error: true,
          message: 'Please enter a valid date.'
        }
      }
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
        return 'checkout-your-email'
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

  componentDidUpdate(prevProps, prevState) {
    const { handeUpdateOption } = this.props
    const { details, showCardDetails, physicalAddonsCount } = this.state
    const needsAddress = physicalAddonsCount > 0

    if (
      !needsAddress &&
      USER_FIELDS.some(key => prevState.details[key] !== details[key]) &&
      USER_FIELDS.every(key => details[key]) &&
      !showCardDetails
    ) {
      this.setState({
        showCardDetails: true
      })
    }

    if (
      needsAddress &&
      USER_FIELDS.every(key => details[key]) &&
      REQUIRED_ADDRESS_FIELDS.every(key => details.address[key]) &&
      !showCardDetails
    ) {
      this.setState({
        showCardDetails: true
      })
    }

    if (
      prevState.details.riding_experience !== details.riding_experience &&
      [
        'Cycling experience',
        // 'On road motorcycling',
        'Off road motorcycling'
      ].includes(details.riding_experience)
    ) {
      handeUpdateOption({
        isInexperienced: true
      })
    }

    if (!isEqual(this.state.errors, prevState.errors)) {
      const errors = Object.entries(this.state.errors)
        .filter(([key, value]) => key !== 'divId')
        .filter(([key, value]) => !isEmpty(value))
        .filter(([key, value]) => key !== 'email')

      if (!errors.length) {
        return
      }

      const userError = errors.some(([key]) => USER_FIELDS.includes(key))
      const cardError = errors.some(([key]) => CARD_FIELDS.includes(key))

      if (userError) {
        this.setState({
          showUserDetails: true
        })
      }

      if (cardError) {
        this.setState({
          showCardDetails: true
        })
      }
    }

    if (
      this.state.emailSubmitted !== prevState.emailSubmitted &&
      this.state.emailSubmitted
    ) {
      this.setState({
        showUserDetails: true
      })
    }
  }

  validateDetails(details) {
    const { physicalAddonsCount } = this.state
    const { trainings } = this.props
    const { courseType } = this.props.checkoutData
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
    // DISABLE THIS WHILE POM IS THE ONLY ADDON WE SELL

    if (physicalAddonsCount > 0) {
      // Check postcode serach field only if
      // manual address form is not open
      if (!this.state.manualAddress) {
        errors['postcode'] = !details['postcode']
          ? 'This field is required.'
          : 'Please search for address'
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

    const validatedDate = this.isValidDate(details.user_birthdate)

    if (!validatedDate) {
      errors['user_birthdate'] =
        'You must be at least 16 years old to do your training. (On the selected date of training)'
      if (courseType === 'FULL_LICENCE') {
        errors['user_birthdate'] = `You must be at least ${getLicenceAge(
          trainings[0].full_licence_type
        )} years old to do your training. (On the selected date of training)`
      }
      if (!errors.divId) errors.divId = this.getErrorDivId('user_birthdate')
      hasError = true
    }

    if (validatedDate.error) {
      errors['user_birthdate'] = validatedDate.message
      if (!errors.divId) errors.divId = this.getErrorDivId('user_birthdate')
      hasError = true
    }

    if (
      !details.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) ||
      !tldExists(details.email)
    ) {
      errors['email'] = 'Please enter a valid email address'
      if (!errors.divId) errors.divId = this.getErrorDivId('email')
      hasError = true
    }

    this.setState({
      errors: errors
    })

    return !hasError
  }

  validateEmail(details) {
    const errors = { address: {}, billingAddress: {}, divId: false }
    let hasError = false

    if (!details['email']) {
      errors['email'] = 'This field is required.'
      if (!errors.divId) errors.divId = this.getErrorDivId('email')
      hasError = true
    }

    if (
      !details.email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) ||
      !tldExists(details.email)
    ) {
      errors['email'] = 'Please enter a valid email address'
      if (!errors.divId) errors.divId = this.getErrorDivId('email')
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
            errorMessage: (
              <span>
                There is a registered user with this email.{' '}
                <a href="/account/login">Login to continue</a>
              </span>
            )
          }
        }
      } catch (error) {
        return { error: false, errorMessage: '' }
      }
    }
  }

  async handlePayment() {
    const { details, physicalAddonsCount, cardElement } = this.state
    const { stripe } = this.props

    if (physicalAddonsCount <= 0) {
      details.address = NO_ADDONS_ADDRESS
    }
    // details.address = NO_ADDONS_ADDRESS

    this.setState({ saving: true })

    //Check if email already exists or user logged in
    const result = await this.checkEmail(details.email)
    if (result.error) {
      this.setState({
        errors: {
          email: result.errorMessage,
          divId: this.getErrorDivId('email')
        }
      })
      this.setState({ saving: false })
      return
    }

    if (!this.validateDetails(details)) {
      this.setState({ saving: false })
      return
    }

    this.setState({ errors: {}, saving: true })
    try {
      const { error, token } = await handleStripePayment({
        stripe,
        cardElement,
        full_name: details.card_name,
        email: details.email,
        phone: details.phone
      })

      if (error) {
        this.handleErrors({
          ...this.state.errors,
          paymentError: error.message
        })
        this.setState({ saving: false })
      } else {
        this.submitOrder(token)
      }
    } catch (error) {
      console.log('Error:', error)
      this.setState({ saving: false })
    }
  }

  async submitOrder(stripeToken) {
    const { checkoutData, trainings } = this.props
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
      accept_equipment_responsibility: true,
      trainings: trainings
    }

    try {
      const response = await createOrder(data)
      if (response) {
        const { order, token: userToken, username } = response
        if (userToken !== null) {
          // window.localStorage.setItem('token', JSON.stringify(userToken))
          window.localStorage.setItem('token', userToken)
        }
        if (username) {
          window.localStorage.setItem('username', username)
        } else {
          const { user_name } = order
          const firstName = user_name.split(' ')[0]

          window.localStorage.setItem('username', firstName)
        }
        window.localStorage.setItem('gaok', true) // Set Google Analytics Flag
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

  handlePaymentButtonClick = () => {
    this.setState({
      showCardDetails: !this.state.showCardDetails
    })
  }

  setCardElement = cardElement => {
    this.setState({
      cardElement
    })
  }

  handleEmailSubmit = async () => {
    const { checkoutData } = this.props
    const { details } = this.state

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

    if (!this.validateEmail({ email: details.email })) {
      return
    }

    const resultEmail = await saveCheckoutEmail(details.email, checkoutData)

    if (resultEmail) {
      this.setState({
        emailSubmitted: true
      })
    }
  }

  handleSignout = () => {
    removeToken()
    sessionStorage.removeItem('login-next')
    window.location.reload(true)
  }

  handleChangeEmailClick = () => {
    if (isAuthenticated()) {
      this.setState({
        errors: {
          email: (
            <React.Fragment>
              You are currently logged in, to book with a new email{' '}
              <button
                className={styles.signoutButton}
                onClick={this.handleSignout}>
                sign out
              </button>
            </React.Fragment>
          ),
          divId: this.getErrorDivId('email')
        }
      })
      return
    }

    this.setState({
      details: {
        ...this.state.details,
        first_name: '',
        last_name: '',
        // email: '',
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
        postcode: ''
      },
      manualAddress: false,
      addresses: [],
      errors: {
        address: {},
        billingAddress: {},
        divId: false
      },
      showUserDetails: false,
      showCardDetails: false,
      emailSubmitted: false
    })
  }

  render() {
    const { courseType } = this.props.checkoutData
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
      trainings,
      showCardDetails,
      physicalAddonsCount,
      emailSubmitted,
      showUserDetails
    } = this.state

    return (
      <React.Fragment>
        <div className={styles.container}>
          <div
            className={classnames(
              styles.leftPanel,
              !showUserDetails && styles.emailNotSet
            )}>
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
              trainings={trainings}
              voucher_code={voucher_code}
              loadingPrice={loadingPrice}
              handleVoucherApply={this.handleVoucherApply}
              showCardDetails={showCardDetails}
              isFullLicence={courseType === 'FULL_LICENCE'}
              handlePaymentButtonClick={this.handlePaymentButtonClick}
              needsAddress={physicalAddonsCount > 0}
              setCardElement={this.setCardElement}
              handleEmailSubmit={this.handleEmailSubmit}
              emailSubmitted={emailSubmitted}
              showUserDetails={showUserDetails}
              handleChangeEmailClick={this.handleChangeEmailClick}
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
              showCardDetails={showCardDetails}
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
      </React.Fragment>
    )
  }
}

export default injectStripe(CheckoutPage)
