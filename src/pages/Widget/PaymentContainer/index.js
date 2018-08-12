import React from 'react'
import { Elements, StripeProvider } from 'react-stripe-elements'

import CheckoutForm from 'pages/Widget/components/CheckoutForm'
import CustomerDetailsForm from 'pages/Widget/components/CustomerDetailsForm'
import OrderDetails from 'pages/Widget/components/OrderDetails'
import { fetchWidgetSingleCourse } from 'services/course'
import { createStripeToken } from 'services/booking'
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
      details: {}
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

  handlePayment(stripe) {
    const { details } = this.state
    createStripeToken(stripe, details.card_name)
  }

  handleChangeDetails(details) {
    console.log(details)
    this.setState({ details })
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
