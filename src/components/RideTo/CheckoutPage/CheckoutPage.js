import loadable from '@loadable/component'
import { ElementsConsumer } from '@stripe/react-stripe-js'
import classnames from 'classnames'
// import { handleStripePayment } from 'services/stripe'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import set from 'lodash/set'
import moment from 'moment'
import React, { Component } from 'react'
import {
  getToken,
  getUserProfile,
  isAuthenticated,
  removeToken
} from 'services/auth'
import { createPlatformOrder } from 'services/checkout'
import { getLicenceAge } from 'services/course'
import { fetchAddressWithPostcode } from 'services/misc'
import { getExpectedPrice } from 'services/order'
import { isInstantBook } from 'services/page'
import { fetchUser, saveCheckoutEmail } from 'services/user'
import { tldExists } from 'tldjs'
import { getPriceV2 } from '../../../services/course'
import { updatePaymentIntentSecretClient } from '../../../services/stripe'
import OrderSummary from './OrderSummary'
import styles from './styles.scss'
import UserDetails from './UserDetails'

const AddressSelectModal = loadable(() =>
  import('components/RideTo/AddressSelectModal')
)

const REQUIRED_FIELDS = [
  'user_birthdate',
  'phone',
  'current_licence',
  'riding_experience',
  'rider_type',
  // 'card_name',
  // 'card_number',
  // 'cvv',
  // 'card_zip',
  // 'expiry_date',
  'first_name',
  'last_name',
  'email'
]

const REQUIRED_USER_FIELDS = [
  'user_birthdate',
  'phone',
  'current_licence',
  'riding_experience',
  'rider_type',
  'first_name',
  'last_name',
  'email'
]

const USER_FIELDS = [
  ...REQUIRED_USER_FIELDS,
  // 'driving_licence_number',
  'prev_cbt_date'
]

// const CARD_FIELDS = REQUIRED_FIELDS.filter(
//   field => !USER_FIELDS.includes(field)
// )

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
        driving_licence_number: '',
        prev_cbt_date: '',
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
        email_optin: true
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
      loadingPrice: this.props.loadingPrice,
      showMap: false,
      trainings: this.props.trainings,
      showUserDetails: false,
      showCardDetails: false,
      paymentDetailsReady: false,
      physicalAddonsCount: this.props.checkoutData.addons.filter(
        addon => addon.name !== 'Peace Of Mind Policy'
      ).length,
      cardElement: null,
      emailSubmitted: false,
      clientSecret: this.props.clientSecret,
      stripePaymentIntentID: this.props.stripePaymentIntentID,
      totalPrice: 0,
      paymentType: 'card',
      bike_type: this.props.trainings[0].bike_type
    }

    this.handleChange = this.handleChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
    this.handlePayment = this.handlePayment.bind(this)
    this.handleValueChange = this.handleValueChange.bind(this)
    this.handleVoucherApply = this.handleVoucherApply.bind(this)
    this.handleMapButtonClick = this.handleMapButtonClick.bind(this)
    this.handleChangeEmailClick = this.handleChangeEmailClick.bind(this)
    this.handleOnPaymentChange = this.handleOnPaymentChange.bind(this)
    this.handleErrors = this.handleErrors.bind(this)
    this.isValidDate = this.isValidDate.bind(this)
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  async handleOnPaymentChange(data) {
    const {
      priceInfo,
      handleUpdateOption,
      stripePaymentIntentID,
      checkoutData,
      instantBook
    } = this.props
    const { voucher_code, trainings } = this.state
    const { addons, courseType } = checkoutData
    this.setState({ ...data }, async () => {
      const isFullLicence = courseType === 'FULL_LICENCE'
      const hours = isFullLicence ? trainings[0].package_hours : 0
      const order_source = instantBook ? 'RIDETO_INSTANT' : 'RIDETO'
      const paymentType = this.state.paymentType
      const params = {
        priceInfo,
        checkoutData,
        addons,
        hours,
        voucher_code,
        order_source,
        paymentType
      }
      const {
        price,
        fee,
        priceBeforeFee,
        priceWithoutAddon
      } = await getExpectedPrice(params)
      await updatePaymentIntentSecretClient(stripePaymentIntentID, {
        payment_type: this.state.paymentType,
        amount: price
      })

      handleUpdateOption({
        paymentType: this.state.paymentType,
        priceInfo: {
          ...priceInfo,
          price: price,
          fee: fee,
          priceBeforeFee: priceBeforeFee,
          priceWithoutAddon: priceWithoutAddon
        }
      })

      return
    })
  }

  async componentDidMount() {
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
      const {
        instantBook,
        handleUpdateOption,
        stripePaymentIntentID
      } = this.props
      const {
        supplierId,
        courseId,
        date,
        courseType,
        addons,
        bike_hire
      } = this.props.checkoutData
      const { details, trainings, paymentType } = this.state

      const isFullLicence = courseType === 'FULL_LICENCE'
      const hasHighwayCode = !!addons.find(
        ({ name }) => name === 'Highway Code Book'
      )
      let params = {
        supplierId,
        courseId,
        date,
        course_type: courseType,
        voucher_code,
        order_source: instantBook ? 'RIDETO_INSTANT' : 'RIDETO',
        highway_code: hasHighwayCode,
        payment_type: paymentType,
        intent_id: stripePaymentIntentID,
        addons,
        bike_hire
      }
      this.setState({ loadingPrice: true })
      if (isFullLicence) {
        const training = trainings[0]
        let response = await getPriceV2({
          supplierId: training.supplier_id,
          course_type: training.course_type,
          hours: training.package_hours,
          voucher_code,
          order_source: 'RIDETO',
          highway_code: hasHighwayCode,
          payment_type: paymentType,
          intent_id: stripePaymentIntentID,
          addons,
          bike_hire
        })

        if (voucher_code && response.discount) {
          this.props.showPromoNotification('Promo code applied!', 'add')
        } else {
          if (voucher_code) {
            this.props.showPromoNotification('Invalid promo code.', 'error')
          }
        }
        const price = response.price + response.bike_hire_cost
        response = { ...response, price }
        handleUpdateOption({ priceInfo: { ...response } })

        this.setState({
          priceInfo: { ...response },
          loadingPrice: false,
          details: {
            ...details,
            voucher_code: voucher_code && response.discount ? voucher_code : ''
          }
        })
      } else {
        let response = await getPriceV2(params)
        if (voucher_code && response.discount) {
          details.voucher_code = voucher_code
          this.props.showPromoNotification('Promo code applied!', 'add')
        } else {
          details.voucher_code = ''
          if (voucher_code) {
            this.props.showPromoNotification('Invalid promo code.', 'error')
          }
        }
        const price = response.price + response.bike_hire_cost
        response = { ...response, price }
        handleUpdateOption({ priceInfo: { ...response } })
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
    const { handleUpdateOption } = this.props
    handleUpdateOption({ voucher_code: voucher_code })
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
    const bikeType = trainings[0].bike_type

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

      if (
        bikeType === 'BIKE_TYPE_MANUAL' &&
        trainingDate.diff(date, 'years') < 17
      ) {
        return {
          error: true,
          message:
            'You must be at least 17 years old to do your training. (On the selected date of training)'
        }
      }
    }

    return isComplete || date.isValid()
  }

  isValidCbtPrevDate(dateString) {
    if (this.props.checkoutData.courseType !== 'LICENCE_CBT_RENEWAL') {
      return ''
    }

    let trainingDate = moment(this.props.checkoutData.date, 'YYYY-MM-DD')

    const date = moment(dateString, 'DD/MM/YYYY')
    const isComplete = dateString.slice(-1) !== '_'

    if (!isComplete || !date.isValid()) {
      return 'invalid'
    }

    if (moment().isBefore(date)) {
      return 'future'
    }

    if (trainingDate.diff(date, 'years', true) > 2) {
      return 'over'
    }

    return ''
  }

  getErrorDivId(field) {
    switch (field) {
      case 'driving_licence_number':
      case 'user_birthdate':
      case 'phone':
      case 'current_licence':
      case 'prev_cbt_date':
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

  async componentDidUpdate(prevProps, prevState) {
    const { handleUpdateOption } = this.props
    const { details, showCardDetails, physicalAddonsCount } = this.state
    const needsAddress = physicalAddonsCount > 0
    if (
      !needsAddress &&
      REQUIRED_USER_FIELDS.some(
        key => prevState.details[key] !== details[key]
      ) &&
      REQUIRED_USER_FIELDS.every(key => details[key]) &&
      !showCardDetails
    ) {
      this.setState({
        showCardDetails: true
      })
    }

    if (
      needsAddress &&
      REQUIRED_USER_FIELDS.every(key => details[key]) &&
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
        'On road motorcycling',
        'Off road motorcycling'
      ].includes(details.riding_experience)
    ) {
      handleUpdateOption({
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
      // const cardError = errors.some(([key]) => CARD_FIELDS.includes(key))

      if (userError) {
        this.setState({
          showUserDetails: true
        })
      }

      // if (cardError) {
      //   this.setState({
      //     showCardDetails: true
      //   })
      // }
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

    const validatedCbtPrevDate = this.isValidCbtPrevDate(details.prev_cbt_date)
    if (validatedCbtPrevDate) {
      errors['prev_cbt_date'] = validatedCbtPrevDate
      if (!errors.divId) errors.divId = this.getErrorDivId('prev_cbt_date')
      hasError = true
    }

    if (details.driving_licence_number) {
      const drivingLicenceRegex = /^^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$$/
      if (
        !drivingLicenceRegex.test(
          details.driving_licence_number
            .split(' ')
            .join('')
            .toUpperCase()
        )
      ) {
        errors['driving_licence_number'] =
          'Please enter a valid driving licence number'
        if (!errors.divId)
          errors.divId = this.getErrorDivId('driving_licence_number')
        hasError = true
      }
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
      errors
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
    const { details, physicalAddonsCount } = this.state
    const {
      context,
      stripePaymentIntentID,
      paymentType,
      supplier,
      priceInfo
    } = this.props
    const { stripe, elements } = context

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }
    if (physicalAddonsCount <= 0) {
      details.address = NO_ADDONS_ADDRESS
    }
    // details.address = NO_ADDONS_ADDRESS

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

    await updatePaymentIntentSecretClient(stripePaymentIntentID, {
      payment_type: paymentType
    })

    await stripe.paymentRequest({
      country: 'GB',
      currency: 'gbp',
      total: {
        label: 'Rideto Training',
        amount: priceInfo.price
      },
      requestPayerName: true,
      requestPayerEmail: true
    })

    const { order } = await this.submitOrder(stripePaymentIntentID)
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${order.id}/thank-you/?supplier=${supplier.slug}`
        }
      })

      if (error) {
        this.handleErrors({
          ...this.state.errors,
          paymentError: error.message
        })
        this.setState({ saving: false })
      } else {
      }
    } catch (error) {
      console.log('Error:', error)
      this.setState({ saving: false })
    }
  }

  async submitOrder(stripeToken) {
    const { paymentType, voucher_code } = this.state
    const { checkoutData, trainings, priceInfo } = this.props
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
    const isFullLicence = courseType === 'FULL_LICENCE'
    const hours = isFullLicence ? trainings[0].package_hours : 0
    const params = {
      priceInfo,
      addons,
      voucher_code,
      checkoutData,
      hours,
      paymentType
    }
    const { price } = await getExpectedPrice(params)
    const data = {
      ...details,
      // email_optin: details.email_optin || false,
      school_course_id: courseId,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: stripeToken,
      expected_price: price,
      name: `${details.first_name} ${details.last_name}`,
      user_date: date,
      selected_licence: courseType,
      supplier: supplierId,
      bike_hire: bike_hire,
      addons: addonIds,
      source: isInstantBook() ? 'RIDETO_INSTANT' : 'RIDETO',
      accept_equipment_responsibility: true,
      trainings: trainings,
      third_party_optin: false,
      stripe_payment_type: paymentType
    }

    try {
      const response = await createPlatformOrder(data)
      if (response) {
        const {
          order,
          token: userToken,
          username,
          skip_card_validation: skipCardValidation
        } = response
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

        // If order price is 0, we skip the payment
        if (skipCardValidation) {
          window.location.href = `/${order.id}/thank-you/`
        }

        return { order, username }
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
    const { details, stripePaymentIntentID } = this.state

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

    const resultEmail = await saveCheckoutEmail(
      details.email,
      checkoutData,
      stripePaymentIntentID
    )

    if (!resultEmail.error) {
      this.setState({
        emailSubmitted: true
      })
    } else if (resultEmail.error) {
      this.setState({
        errors: {
          email: resultEmail.errorMessage,
          divId: this.getErrorDivId('email')
        }
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
        driving_licence_number: '',
        prev_cbt_date: '',
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
    const { checkoutData, priceInfo } = this.props
    const { courseType } = checkoutData

    const {
      details,
      manualAddress,
      postcodeLookingup,
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
      showUserDetails,
      clientSecret,
      paymentType,
      paymentDetailsReady
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
              isValidDate={this.isValidDate}
              errors={errors}
              priceInfo={priceInfo}
              onDetailChange={this.handleValueChange}
              getErrorDivId={this.getErrorDivId}
              onPaymentChange={this.handleOnPaymentChange}
              onChange={this.onUpdate}
              handleErrors={this.handleErrors}
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
              isRenewal={courseType === 'LICENCE_CBT_RENEWAL'}
              handlePaymentButtonClick={this.handlePaymentButtonClick}
              needsAddress={physicalAddonsCount > 0}
              setCardElement={this.setCardElement}
              handleEmailSubmit={this.handleEmailSubmit}
              emailSubmitted={emailSubmitted}
              showUserDetails={showUserDetails}
              handleChangeEmailClick={this.handleChangeEmailClick}
              clientSecret={clientSecret}
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
              clientSecret={clientSecret}
              paymentType={paymentType}
              paymentDetailsReady={paymentDetailsReady}
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

// export default CheckoutPage

const withContext = Component => {
  return props => {
    return (
      <ElementsConsumer>
        {context => {
          return <Component {...props} context={context} />
        }}
      </ElementsConsumer>
    )
  }
}

export default withContext(CheckoutPage)
