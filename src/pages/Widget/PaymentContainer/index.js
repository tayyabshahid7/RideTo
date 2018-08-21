import React from 'react'
import moment from 'moment'
import { Elements, StripeProvider } from 'react-stripe-elements'

import CheckoutForm from 'pages/Widget/components/CheckoutForm'
import CustomerDetailsForm from 'pages/Widget/components/CustomerDetailsForm'
import OrderDetails from 'pages/Widget/components/OrderDetails'
import BookingSummary from 'pages/Widget/components/BookingSummary'
import { fetchWidgetSingleCourse } from 'services/course'
import {
  createOrder,
  createStripeToken,
  getInitialSuppliers
} from 'services/widget'
import { parseQueryString } from 'services/api'

import styles from './PaymentContainer.scss'

// Map course type names to LICENCE_TYPES
const LICENCE_TYPES = {
  'CBT Training': 'LICENCE_CBT',
  'CBT Training Renewal': 'LICENCE_CBT_RENEWAL'
}

const getStripeError = error => {
  const field = error.code.split('_').slice(-1)[0]
  const errorId = `card_${field}`

  return {
    [errorId]: error.message
  }
}

class PaymentContainer extends React.Component {
  constructor(props) {
    super(props)

    this.stripePublicKey = window.RIDE_TO_DATA.stripe_public_key
    this.widget = window.RIDE_TO_DATA.widget_initial
    this.suppliers = getInitialSuppliers()

    const query = parseQueryString(window.location.search.slice(1))

    this.state = {
      course: null,
      supplier: null,
      isSaving: false,
      hire: query.hire || null,
      errors: {},
      details: {}
    }

    this.handlePayment = this.handlePayment.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)

    window.document.body.scrollIntoView()
  }

  async componentDidMount() {
    const { match } = this.props
    const { courseId } = match.params

    const course = await fetchWidgetSingleCourse(0, courseId)
    const supplier = this.suppliers.filter(
      ({ id }) => id === course.supplier
    )[0]

    this.setState({
      course,
      supplier
    })
  }

  handleChangeDetails(details, errors = {}) {
    this.setState({
      details,
      errors: {
        ...this.state.errors,
        ...errors
      }
    })
  }

  validateDetails(details) {
    if (!details.card_name) {
      this.setState({
        errors: {
          ...this.state.errors,
          card_name: 'This field is required.'
        }
      })
      return false
    }

    return true
  }

  async handlePayment(stripe) {
    const { details } = this.state
    if (!this.validateDetails(details)) {
      return
    }

    this.setState({ errors: {}, isSaving: true })
    const response = await createStripeToken(stripe, details.card_name)

    if (response.error) {
      this.handleErrors({
        ...this.state.errors,
        ...getStripeError(response.error)
      })
    } else {
      const { token } = response
      this.createOrder(token)
    }
  }

  async createOrder(token) {
    const { match, history } = this.props
    const { slug } = match.params
    const { course, supplier, details } = this.state
    const birthdate = moment(details.user_birthdate, 'DD/MM/YYYY')
    const data = {
      ...details,
      school_course_id: course.id,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: token.id,
      expected_price: this.getTotalPrice(),
      name: `${details.first_name} ${details.last_name}`,
      user_date: course.date,
      selected_licence: LICENCE_TYPES[course.course_type.name],
      addons: [],
      supplier: supplier.id,
      email_optin: false,
      accept_equipment_responsibility: true, // TODO Needs to be removed
      bike_hire: this.state.hire,
      source: 'WIDGET',
      rider_type: 'RIDER_TYPE_SOCIAL',
      voucher_code: ''
    }

    try {
      const response = await createOrder(data)

      if (response) {
        history.push(`/widget/${slug}/confirmation?supplier=${supplier.id}`)
      }
    } catch (error) {
      if (error.response && error.response.data) {
        this.handleErrors(error.response.data)
        window.document.body.scrollIntoView()
      }
    }
  }

  handleErrors(errors) {
    this.setState({ errors, isSaving: false })
  }

  getTotalPrice() {
    // TODO Need to do pricing
    return 100 * 100
  }

  render() {
    const { course, supplier, details, errors, hire, isSaving } = this.state
    const isLoading = !Boolean(course) || !Boolean(supplier)

    return (
      <div className={styles.paymentContainer}>
        <BookingSummary
          course={course}
          supplier={supplier}
          hire={hire}
          isLoading={isLoading}
        />
        <div className={styles.paymentDetails}>
          <h3 className={styles.heading}>Contact Details</h3>
          <CustomerDetailsForm
            details={details}
            errors={errors}
            onChange={this.handleChangeDetails}
          />

          <StripeProvider apiKey={this.stripePublicKey}>
            <div>
              <h3 className={styles.heading}>Payment Details</h3>
              <div className={styles.cardSecure}>
                Your card details are stored with our secure payment provider
                Stripe.
              </div>
              <Elements>
                <CheckoutForm
                  details={details}
                  errors={errors}
                  isSaving={isSaving}
                  onChange={this.handleChangeDetails}
                  onSubmit={this.handlePayment}
                />
              </Elements>
            </div>
          </StripeProvider>
        </div>

        <div className={styles.orderDetails}>
          <h3 className={styles.heading}>Your Training</h3>
          <OrderDetails
            course={course}
            supplier={supplier}
            isLoading={isLoading}
          />
        </div>
      </div>
    )
  }
}

export default PaymentContainer
