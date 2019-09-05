import React from 'react'
import moment from 'moment'
import { Elements, StripeProvider } from 'react-stripe-elements'
import CheckoutForm from 'pages/Widget/components/CheckoutForm'
import CustomerDetailsForm from 'pages/Widget/components/CustomerDetailsForm'
import OrderDetails from 'pages/Widget/components/OrderDetails'
import BookingSummary from 'pages/Widget/components/BookingSummary'
import { fetchWidgetSingleCourse, getPrice } from 'services/course'
import {
  createOrder,
  getTotalOrderPrice,
  getInitialSuppliers
} from 'services/widget'
import { parseQueryString } from 'services/api'
import styles from './PaymentContainer.scss'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { capitalizeFirstLetter } from 'utils/helper'
import { handleStripePayment } from 'services/stripe'

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
      details: {
        current_licence: '',
        riding_experience: ''
      },
      trainings: JSON.parse(window.sessionStorage.getItem('widgetTrainings')),
      isFullLicence: this.props.match.params.courseId === 'FULL_LICENCE',
      totalPrice: 0,
      voucher_code: '',
      discount: 0,
      cardElement: null
    }

    this.handlePayment = this.handlePayment.bind(this)
    this.handleChangeDetails = this.handleChangeDetails.bind(this)
    this.handleVoucherApply = this.handleVoucherApply.bind(this)
    this.handleVoucherCodeChange = this.handleVoucherCodeChange.bind(this)

    this.setPrice = this.setPrice.bind(this)

    window.document.body.scrollIntoView()
  }

  async setPrice(voucher_code) {
    const { match } = this.props
    const { courseId } = match.params
    const { isFullLicence, trainings, hire } = this.state

    let course
    let supplier
    let totalPrice
    let discount = 0

    if (isFullLicence) {
      const training = trainings[0]

      course = {
        course_type: {
          name: 'Full Licence'
        }
      }
      supplier = this.suppliers.filter(
        ({ id }) => id === training.supplier_id
      )[0]

      let response = await getPrice({
        supplierId: training.supplier_id,
        course_type: training.course_type,
        hours: training.package_hours,
        full_licence_course_id: training.school_course_id,
        ...(voucher_code && { voucher_code })
      })

      totalPrice = response.price
      discount = response.discount
    } else {
      course = await fetchWidgetSingleCourse(0, courseId)
      if (voucher_code) {
        const training = trainings[0]

        let response = await getPrice({
          supplierId: training.supplier_id,
          course_type: training.course_type,
          full_licence_course_id: training.school_course_id,
          ...(voucher_code && { voucher_code })
        })

        if (response.discount > 0) {
          discount = response.discount
        }
      }
      supplier = this.suppliers.filter(({ id }) => id === course.supplier)[0]
      totalPrice = getTotalOrderPrice(course, hire, discount)
    }

    this.setState({
      course,
      supplier,
      totalPrice,
      discount
    })
  }

  componentDidMount() {
    this.setPrice()
  }

  handleVoucherCodeChange({ voucher_code }) {
    this.setState({
      voucher_code
    })
  }

  handleVoucherApply() {
    const { voucher_code } = this.state

    this.setPrice(voucher_code)
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

    if (this.state.errors.user_birthdate) {
      return false
    }

    return true
  }

  async handlePayment(stripe) {
    const { details, cardElement } = this.state
    if (!this.validateDetails(details)) {
      return
    }

    this.setState({ errors: {}, isSaving: true })

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
    } else {
      this.createOrder(token)
    }
  }

  async createOrder(token) {
    const { match, history } = this.props
    const { slug, courseId } = match.params
    const {
      course,
      supplier,
      details,
      hire,
      trainings,
      totalPrice,
      voucher_code
    } = this.state
    const birthdate = moment(details.user_birthdate, 'DD/MM/YYYY')
    const data = {
      ...details,
      email_optin: details.email_optin || false,
      school_course_id: course.id || supplier.id,
      user_birthdate: birthdate.format('YYYY-MM-DD'),
      user_age: moment().diff(birthdate, 'years'),
      current_licences: [details.current_licence],
      token: token.id,
      expected_price: totalPrice,
      name: `${details.first_name} ${details.last_name}`,
      user_date: course.date || trainings[0].requested_date,
      selected_licence: course.course_type.constant || courseId,
      supplier: supplier.id,
      bike_hire: hire,
      addons: [],
      accept_equipment_responsibility: true, // TODO Needs to be removed
      source: 'WIDGET',
      rider_type: 'RIDER_TYPE_SOCIAL',
      trainings: trainings,
      voucher_code
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.discount !== prevState.discount) {
      if (this.state.discount > 0) {
        this.showPromoNotification('Promo code applied!', 'add')
      } else {
        this.showPromoNotification('Invalid promo code.', 'error')
      }
    }
  }

  showPromoNotification(text = 'Promo code applied!', type = 'add') {
    toast(text, {
      toastId: 'add',
      className: styles[`toast${capitalizeFirstLetter(type)}`]
    })
  }

  setCardElement = cardElement => {
    console.log(cardElement)
    this.setState({
      cardElement
    })
  }

  render() {
    const {
      course,
      supplier,
      details,
      errors,
      hire,
      isSaving,
      totalPrice,
      isFullLicence,
      trainings,
      voucher_code,
      discount
    } = this.state
    const isLoading = !Boolean(course) || !Boolean(supplier)

    return (
      <React.Fragment>
        <ToastContainer
          autoClose={2000}
          hideProgressBar={true}
          pauseOnHover={false}
          pauseOnFocusLoss={false}
        />
        <div className={styles.paymentContainer}>
          <BookingSummary
            totalPrice={totalPrice}
            course={course}
            supplier={supplier}
            hire={hire}
            isLoading={isLoading}
            isFullLicence={isFullLicence}
            trainings={trainings}
          />
          <div className={styles.paymentDetails}>
            <h3 className={styles.heading}>Contact Details</h3>
            <CustomerDetailsForm
              details={details}
              trainingDate={course && course.date}
              errors={errors}
              fullLicenceType={trainings[0].full_licence_type}
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
                    voucher_code={voucher_code}
                    handleVoucherApply={this.handleVoucherApply}
                    onVoucherCodeChange={this.handleVoucherCodeChange}
                    setCardElement={this.setCardElement}
                  />
                </Elements>
              </div>
            </StripeProvider>
          </div>

          <div className={styles.orderDetails}>
            <h3 className={styles.heading}>Your Training</h3>
            <OrderDetails
              discount={discount}
              isFullLicence={isFullLicence}
              totalPrice={totalPrice}
              course={course}
              supplier={supplier}
              hire={hire}
              isLoading={isLoading}
              trainings={trainings}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default PaymentContainer
