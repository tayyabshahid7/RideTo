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
  getTotalOrderPrice,
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

const REQUIRED_FIELDS = [
  'first_name',
  'last_name',
  'phone',
  'user_birthdate',
  'email',
  'current_licence',
  'riding_experience',
  'card_name'
]

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
    const errors = {}
    REQUIRED_FIELDS.forEach(field => {
      if (!details[field]) {
        errors[field] = 'This field is required.'
      }
    })

    if (Object.keys(errors).length) {
      this.setState({
        errors: {
          ...this.state.errors,
          ...errors
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
  }

  async createOrder(token) {
    const { match, history } = this.props
    const { slug } = match.params
    const { course, supplier, details, hire } = this.state
    const birthdate = moment(details.user_birthdate, 'DD/MM/YYYY')
    const data = {
      ...details,
      email_optin: details.email_optin || false,
      school_course_id: course.id,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: token.id,
      expected_price: getTotalOrderPrice(course, hire),
      name: `${details.first_name} ${details.last_name}`,
      user_date: course.date,
      selected_licence: LICENCE_TYPES[course.course_type.name],
      supplier: supplier.id,
      bike_hire: hire,
      addons: [],
      accept_equipment_responsibility: true, // TODO Needs to be removed
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

  handleErrors(errors) {
    this.setState({ errors, isSaving: false })
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
            trainingDate={course && course.date}
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
                  widget={this.widget}
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
            hire={hire}
            isLoading={isLoading}
          />
        </div>
      </div>
    )
  }
}

export default PaymentContainer
