import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import CheckoutForm from 'pages/Widget/components/CheckoutForm'
import CustomerDetailsForm from 'pages/Widget/components/CustomerDetailsForm'
import OrderDetails from 'pages/Widget/components/OrderDetails'
import { fetchWidgetSingleCourse } from 'services/course'
import { createOrder, createStripeToken } from 'services/booking'
import { parseQueryString } from 'services/api'

import styles from './PaymentContainer.scss'

class PaymentContainer extends React.Component {
  constructor(props) {
    super(props)

    this.stripePublicKey = window.RIDE_TO_DATA.stripe_public_key
    this.widget = window.RIDE_TO_DATA.widget_initial
    this.suppliers = window.RIDE_TO_DATA.widget_locations

    const query = parseQueryString(window.location.search.slice(1))

    this.state = {
      course: null,
      supplier: null,
      hire: query.hire || null,
      details: {
        current_licence: 'None',
        email: 'stuart.quin@gmail.com',
        first_name: 'Stuart',
        last_name: 'Quin',
        phone: '123123123123123',
        riding_experience: 'Bike',
        user_birthdate: '08/01/1987'
      }
    }

    this.handlePayment = this.handlePayment.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)
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

  handleChangeDetails(details) {
    this.setState({ details })
  }

  async handlePayment(stripe) {
    const { details } = this.state
    const response = await createStripeToken(stripe, details.card_name)

    if (response.error) {
      console.log(response.error)
    } else {
      const { token } = response
      this.createOrder(token)
    }
  }

  async createOrder(token) {
    const { course, supplier, details } = this.state
    const data = {
      ...details,
      token: token.id,
      expected_price: this.getTotalPrice(),
      name: `${details.first_name} ${details.last_name}`,
      user_date: course.date,
      selected_licence: course.course_type.name,
      supplier: supplier.id,
      email_optin: false,
      accept_equipment_responsibility: true, // TODO Needs to be removed
      bike_hire: this.state.hire
    }
    const response = await createOrder(data)
    console.log(response)
  }

  getTotalPrice() {
    // TODO Need to do pricing
    return 100
  }

  render() {
    const { course, supplier, details } = this.state

    return (
      <div className={styles.paymentContainer}>
        <div className={styles.paymentDetails}>
          <h3>Contact Details</h3>
          <CustomerDetailsForm
            details={details}
            onChange={this.handleChangeDetails}
          />

          <StripeProvider apiKey={this.stripePublicKey}>
            <div className="example">
              <h3>Payment Details</h3>
              <div>
                Your card details are stored with our secure payment provider
                Stripe.
              </div>
              <Elements>
                <CheckoutForm
                  details={details}
                  onChange={this.handleChangeDetails}
                  onSubmit={this.handlePayment}
                />
              </Elements>
            </div>
          </StripeProvider>
        </div>

        <div className={styles.orderDetails}>
          {course && supplier ? (
            <OrderDetails course={course} supplier={supplier} />
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    )
  }
}

export default PaymentContainer
