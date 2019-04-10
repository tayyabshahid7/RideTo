import React from 'react'
import styles from './styles.scss'
import { Row, Col } from 'reactstrap'
import { BikeHires, FullLicenceTypes } from 'common/info'
import { getPaymentOptions } from 'services/order'
import { checkCustomerExists } from 'services/customer'
import { injectStripe } from 'react-stripe-elements'
import CheckoutForm from './CheckoutForm'
import classnames from 'classnames'

import { ConnectInput, ConnectSelect, Button } from 'components/ConnectForm'

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
        // email_optin: 'false'
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
    const { updateAdding, course } = this.props

    this.scrollIntoView.current.scrollIntoView()

    updateAdding(course.id)
  }

  componentWillUnmount() {
    const { updateAdding } = this.props

    updateAdding(null)
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

  handleChange(typeName, value) {
    const { order } = this.state
    // const newOrder = { ...order }

    // let type = typeName.split('.')[0]
    // let name = typeName.split('.')[1]

    // if (!name) {
    //   newOrder[type] = value
    // } else {
    //   newOrder[type][name] = value
    // }

    this.setState({
      order: { ...order, [typeName]: value }
    })
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
      course: { pricing }
    } = this.props
    const {
      isFullLicence,
      userDetailsValid,
      showPayment,
      showPaymentConfirmation,
      cardName,
      cardNumberComplete,
      cardDateComplete,
      cardCVCComplete,
      cardPostCodeComplete,
      order: {
        bike_hire,
        full_licence_type,
        payment_status,
        riding_experience,
        user_birthdate,
        user_driving_licence_number,
        user_email,
        user_first_name,
        user_last_name,
        user_phone
        // email_optin
      }
    } = this.state
    const price = pricing && pricing.price

    return (
      <div className={styles.container}>
        <div ref={this.scrollIntoView} />
        {!showPayment &&
          (!showPaymentConfirmation && (
            <div className={styles.header}>
              <span className={styles.leftCol}>
                <h3 className={styles.title}>Add Order</h3>
              </span>
              <span>Step 1 of 2</span>
            </div>
          ))}
        {!showPaymentConfirmation ? (
          <form onSubmit={this.handleSave.bind(this)} ref={this.form}>
            <div className={classnames(showPayment && styles.hideUserForm)}>
              <ConnectInput
                basic
                name="user_first_name"
                value={user_first_name}
                label="First Name *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />

              <ConnectInput
                basic
                name="user_last_name"
                value={user_last_name}
                label="Surname *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />

              <ConnectInput
                basic
                name="user_phone"
                value={user_phone}
                label="Mobile"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
              />

              <ConnectInput
                basic
                name="user_email"
                value={user_email}
                label="Email *"
                className="form-group"
                type="email"
                onChange={this.handleChangeRawEvent.bind(this)}
                required
              />

              <ConnectInput
                basic
                name="user_birthdate"
                value={user_birthdate}
                label="Birthdate *"
                className="form-group"
                type="date"
                onChange={this.handleChangeRawEvent.bind(this)}
                // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                required
              />

              {isFullLicence && (
                <ConnectSelect
                  placeholder
                  basic
                  name="full_licence_type"
                  selected={full_licence_type}
                  label="Licence Type *"
                  valueArray={FullLicenceTypes}
                  onChange={value => {
                    this.handleChange('full_licence_type', value)
                  }}
                  required
                  valueField="value"
                  labelField="title"
                />
              )}

              <ConnectInput
                basic
                name="user_driving_licence_number"
                value={user_driving_licence_number}
                label="Licence Number"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent.bind(this)}
              />

              <ConnectSelect
                placeholder
                basic
                name="payment_status"
                selected={payment_status}
                label="Payment Status *"
                valueArray={getPaymentOptions()}
                onChange={value => {
                  this.handleChange('payment_status', value)
                }}
                required
                valueField="id"
                labelField="name"
              />

              <ConnectSelect
                placeholder
                basic
                name="riding_experience"
                selected={riding_experience}
                label="Riding Experience"
                valueArray={info.ridingExperiences}
                onChange={value => {
                  this.handleChange('riding_experience', value)
                }}
                valueField="value"
                labelField="title"
              />

              <ConnectSelect
                placeholder
                basic
                name="bike_hire"
                selected={bike_hire}
                label="Bike Hire *"
                valueArray={BikeHires}
                onChange={value => {
                  this.handleChange('bike_hire', value)
                }}
                required
                valueField="value"
                labelField="title"
              />

              {/*
              <ConnectSelect
                basic
                name="email_optin"
                selected={email_optin}
                label="Add to mailing list?"
                valueArray={[
                  { id: 'false', name: 'No' },
                  { id: 'true', name: 'Yes' }
                ]}
                onChange={value => {
                  this.handleChange('email_optin', value)
                }}
              />
              */}
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
                    onClick={this.handleShowPaymentClick}>
                    Payment
                  </Button>
                )}
                <Button
                  type="submit"
                  color="primary"
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
                <Button color="white" onClick={this.handleCancel}>
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
              <Button color="white" onClick={onCancel}>
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
