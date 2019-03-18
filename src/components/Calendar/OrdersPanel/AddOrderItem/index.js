import React from 'react'
import styles from './styles.scss'
import { Button, Row, Col } from 'reactstrap'
import InputTextGroup from 'components/Forms/InputTextGroup'
import InputSelectGroup from 'components/Forms/InputSelectGroup'
import { BikeHires, FullLicenceTypes } from 'common/info'
import { getPaymentOptions } from 'services/order'
import { checkCustomerExists } from 'services/customer'
import { injectStripe } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'
import classnames from 'classnames'

class AddOrderItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: {
        school_course: this.props.course.id,
        user_birthdate: '',
        user_driving_licence_number: '',
        user_email: '',
        user_first_name: '',
        user_last_name: '',
        user_phone: '',
        bike_hire: '',
        payment_status: '',
        riding_experience: '',
        full_licence_type: '',
        start_time: `${this.props.course.date}T${this.props.course.time}Z`
      },
      isFullLicence: this.props.course.course_type.constant.startsWith(
        'FULL_LICENCE'
      ),
      orderCreated: false,
      orderResponse: null,
      userDetailsValid: false,
      showPayment: false,
      showPaymentConfirmation: false,
      cardName: '',
      cardNumberComplete: false,
      cardDateComplete: false,
      cardCVCComplete: false,
      cardPostCodeComplete: false
    }

    this.scrollIntoView = React.createRef()
    this.form = React.createRef()

    this.handleCardNameChange = this.handleCardNameChange.bind(this)
    this.handleShowPaymentClick = this.handleShowPaymentClick.bind(this)
    this.handleStripeElementChange = this.handleStripeElementChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.sendStripePayment = this.sendStripePayment.bind(this)
  }

  componentDidMount() {
    this.scrollIntoView.current.scrollIntoView()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.order !== prevState.order) {
      this.setState({
        userDetailsValid: this.form.current.checkValidity()
      })
    }
  }

  handleCancel() {
    if (!this.state.showPayment) {
      this.props.onCancel()
    }
    this.setState({ showPayment: false })
  }

  handleChangeRawEvent(event) {
    let name = event.target.name
    let { order } = this.state
    this.setState({ order: { ...order, [name]: event.target.value } })

    if (name === 'user_first_name') {
      this.setState({
        cardName: `${event.target.value} ${order.user_last_name}`.toUpperCase()
      })
    } else if (name === 'user_last_name') {
      this.setState({
        cardName: `${order.user_first_name} ${event.target.value}`.toUpperCase()
      })
    }
  }

  handleShowPaymentClick() {
    const { userDetailsValid } = this.state
    if (!userDetailsValid) {
      return
    }
    this.setState({
      showPayment: true
    })
  }

  async sendStripePayment() {
    const {
      onPayment,
      stripe,
      course: {
        pricing: { price }
      }
    } = this.props
    const { order, cardName, orderResponse } = this.state

    if (!stripe) {
      console.log("Stripe.js hasn't loaded yet.")
    } else {
      const { token } = await stripe.createToken({ name: cardName })
      const paymentResponse = await onPayment(
        orderResponse,
        token,
        price,
        order.user_email
      )
      if (paymentResponse) {
        this.setState({
          showPaymentConfirmation: true
        })
      }
    }
  }

  async handleSave(event) {
    const { onSave, onCancel } = this.props
    const { order, showPayment, orderCreated } = this.state

    event.preventDefault()

    if (!orderCreated) {
      let result = await checkCustomerExists(order.user_email)
      if (result.email_exists) {
        const confirm = window.confirm(
          `There's already a customer with this email (${order.user_email})\n` +
            'The order will be associated to this email.\n' +
            'Do you want to continue?'
        )
        if (!confirm) return
      }

      const orderResponse = await onSave(order)

      if (!orderResponse) {
        this.setState({ showPayment: false })
      } else {
        this.setState(
          { orderCreated: true, orderResponse: orderResponse },
          async () => {
            if (showPayment) {
              await this.sendStripePayment()
            } else {
              onCancel()
            }
          }
        )
      }
    } else if (showPayment) {
      await this.sendStripePayment()
    }
  }

  handleCardNameChange({ target: { value } }) {
    this.setState({
      cardName: value
    })
  }

  handleStripeElementChange(el, name) {
    this.setState({ [`card${name}Complete`]: !el.empty && el.complete })
  }

  render() {
    let {
      onCancel,
      info,
      course: {
        pricing: { price }
      }
    } = this.props
    const {
      user_first_name,
      user_last_name,
      user_phone,
      bike_hire,
      riding_experience,
      payment_status,
      user_birthdate,
      user_driving_licence_number,
      user_email,
      full_licence_type,
      isFullLicence,
      userDetailsValid,
      showPayment,
      showPaymentConfirmation,
      cardName,
      cardNumberComplete,
      cardDateComplete,
      cardCVCComplete,
      cardPostCodeComplete
    } = this.state

    return (
      <div className={styles.container}>
        <div ref={this.scrollIntoView} />
        {!showPaymentConfirmation ? (
          <form onSubmit={this.handleSave.bind(this)} ref={this.form}>
            <div className={classnames(showPayment && styles.hideUserForm)}>
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="user_first_name"
                    value={user_first_name}
                    label="First Name *"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
                <Col sm="6">
                  <InputTextGroup
                    name="user_last_name"
                    value={user_last_name}
                    label="Surname *"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="user_phone"
                    value={user_phone}
                    label="Mobile"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent.bind(this)}
                  />
                </Col>
                <Col sm="6">
                  <InputTextGroup
                    name="user_email"
                    value={user_email}
                    label="Email *"
                    className="form-group"
                    type="email"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="user_birthdate"
                    value={user_birthdate}
                    label="Birthdate *"
                    className="form-group"
                    type="date"
                    onChange={this.handleChangeRawEvent.bind(this)}
                    // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                    required
                  />
                </Col>
                <Col sm="6">
                  {isFullLicence && (
                    <InputSelectGroup
                      name="full_licence_type"
                      value={full_licence_type}
                      label="Licence Type *"
                      valueArray={FullLicenceTypes}
                      noSelectOption
                      onChange={this.handleChangeRawEvent.bind(this)}
                      required
                    />
                  )}
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <InputTextGroup
                    name="user_driving_licence_number"
                    value={user_driving_licence_number}
                    label="License Number"
                    className="form-group"
                    type="text"
                    onChange={this.handleChangeRawEvent.bind(this)}
                  />
                </Col>
                <Col sm="6">
                  <InputSelectGroup
                    name="payment_status"
                    value={payment_status}
                    label="Payment Status *"
                    valueArray={getPaymentOptions()}
                    noSelectOption
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                    valueField="id"
                    titleField="name"
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <InputSelectGroup
                    name="riding_experience"
                    value={riding_experience}
                    label="Riding Experience"
                    valueArray={info.ridingExperiences}
                    noSelectOption
                    onChange={this.handleChangeRawEvent.bind(this)}
                  />
                </Col>
                <Col sm="6">
                  <InputSelectGroup
                    name="bike_hire"
                    value={bike_hire}
                    label="Bike Hire *"
                    valueArray={BikeHires}
                    noSelectOption
                    onChange={this.handleChangeRawEvent.bind(this)}
                    required
                  />
                </Col>
              </Row>
            </div>
            {showPayment && (
              <div>
                <CheckoutForm
                  price={price}
                  cardName={cardName}
                  handleCardNameChange={this.handleCardNameChange}
                  handleStripeElementChange={this.handleStripeElementChange}
                />
              </div>
            )}
            <Row>
              <Col className="mt-3 text-right">
                {!showPayment && (
                  <Button
                    disabled={!userDetailsValid}
                    type="button"
                    color="primary"
                    className="mr-2"
                    onClick={this.handleShowPaymentClick}>
                    Payment
                  </Button>
                )}
                <Button
                  type="submit"
                  color="primary"
                  className="mr-2"
                  disabled={
                    showPayment &&
                    (!cardName ||
                      !cardNumberComplete ||
                      !cardDateComplete ||
                      !cardCVCComplete ||
                      !cardPostCodeComplete)
                  }>
                  {showPayment ? 'Take Payment' : 'Save'}
                </Button>
                <Button color="" onClick={this.handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <h4>Success!</h4>
            <p>
              The order has been added to the course and payment made via
              Stripe.
            </p>
            <p>Confirmation Email sent.</p>
            <p>
              <Button
                color="primary"
                outline
                style={{ backgroundColor: '#fff' }}
                onClick={onCancel}>
                Close
              </Button>
            </p>
          </div>
        )}
      </div>
    )
  }
}

export default injectStripe(AddOrderItem)
