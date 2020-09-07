import React from 'react'
import styles from './styles.scss'
import { getFullLicenseType, getAvailableBikeHires } from 'common/info'
import { getPaymentOptions } from 'services/order'
import {
  checkCustomerExists,
  getCurrentLicenceOptions
} from 'services/customer'
import CheckoutForm from './CheckoutForm'
import classnames from 'classnames'
import { handleStripePayment } from 'services/stripe'
import omit from 'lodash/omit'
import { connect } from 'react-redux'
import { fetchWidgetSettings } from 'store/settings'
import { bindActionCreators } from 'redux'

import {
  ConnectInput,
  ConnectSelect,
  Button,
  ConnectCheckbox,
  ConnectAgeInput,
  ConnectTextArea
} from 'components/ConnectForm'

class AddOrderItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: {
        school_course: this.props.course.id,
        user_birthdate: '',
        current_licence: '',
        user_email: '',
        user_first_name: '',
        user_last_name: '',
        user_phone: '',
        bike_hire: '',
        payment_status: '',
        riding_experience: '',
        full_licence_type: '',
        start_time: `${this.props.course.date}T${this.props.course.time}Z`,
        tandcs_agreed: false,
        email_optin: false,
        notes: '',
        third_party_optin: false
      },
      orderCreated: false,
      orderResponse: null,
      userDetailsValid: false,
      showPayment: false,
      showPaymentConfirmation: false,
      cardName: '',
      cardNumberComplete: false,
      cardDateComplete: false,
      cardCVCComplete: false,
      cardPostCodeComplete: false,
      cardElement: null
    }

    this.scrollIntoView = React.createRef()
    this.form = React.createRef()
  }

  componentDidMount() {
    const {
      updateAdding,
      course,
      widgetSettings,
      fetchWidgetSettings
    } = this.props

    if (!widgetSettings) {
      fetchWidgetSettings()
    }

    // this.scrollIntoView.current.scrollIntoView()
    setTimeout(() => {
      window.scrollTo(0, 0)
    })

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

  handleCancel = () => {
    if (!this.state.showPayment) {
      this.props.onCancel()
    }
    this.setState({ showPayment: false })
  }

  handleChangeRawEvent = event => {
    const { target } = event
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { order } = this.state

    this.setState({ order: { ...order, [name]: value } })

    if (name === 'user_first_name') {
      this.setState({
        cardName: `${value} ${order.user_last_name}`.toUpperCase()
      })
    } else if (name === 'user_last_name') {
      this.setState({
        cardName: `${order.user_first_name} ${value}`.toUpperCase()
      })
    }
  }

  handleChange = (typeName, value) => {
    const { order } = this.state
    order[typeName] = value

    if (typeName === 'bike_hire') {
      order.full_licence_type = getFullLicenseType(value)
    }
    this.setState({ order: { ...order } })
  }

  handleShowPaymentClick = () => {
    const { userDetailsValid } = this.state
    if (!userDetailsValid) {
      return
    }
    this.setState({
      showPayment: true
    })
  }

  sendStripePayment = async () => {
    const {
      onPayment,
      stripe,
      course: {
        pricing: { price }
      }
    } = this.props
    const { order, cardName, orderResponse, cardElement } = this.state

    if (!stripe) {
      console.log("Stripe.js hasn't loaded yet.")
    } else {
      const { error, token } = await handleStripePayment({
        stripe,
        cardElement,
        full_name: cardName,
        email: order.user_email,
        phone: order.user_phone
      })

      if (error) {
        console.log('Error', error)
      } else {
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
  }

  handleSave = async event => {
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

      const data = Object.assign({}, order)
      data.bike_type = data.bike_hire

      const orderResponse = await onSave(
        !data.user_birthdate ? omit(data, 'user_birthdate') : data
      )

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

  handleCardNameChange = ({ target: { value } }) => {
    this.setState({
      cardName: value
    })
  }

  handleStripeElementChange = (el, name) => {
    this.setState({ [`card${name}Complete`]: !el.empty && el.complete })
  }

  setCardElement = cardElement => {
    this.setState({
      cardElement
    })
  }

  render() {
    let {
      onCancel,
      info,
      course,
      course: { pricing },
      widgetSettings
    } = this.props
    const {
      showPayment,
      showPaymentConfirmation,
      cardName,
      cardNumberComplete,
      cardDateComplete,
      cardCVCComplete,
      cardPostCodeComplete,
      order: {
        bike_hire,
        payment_status,
        riding_experience,
        user_birthdate,
        current_licence,
        user_email,
        user_first_name,
        user_last_name,
        user_phone,
        tandcs_agreed,
        email_optin,
        notes,
        third_party_optin
      }
    } = this.state
    const price = pricing && pricing.price
    const enable_third_party_optin =
      widgetSettings && widgetSettings.enable_third_party_optin
    return (
      <div className={styles.container}>
        <div ref={this.scrollIntoView} />
        {!showPayment &&
          (!showPaymentConfirmation && (
            <div className={styles.header}>
              <span className={styles.leftCol}>
                <h3 className={styles.addTitle}>Add Order</h3>
              </span>
              {/* <span>Step 1 of 2</span> */}
            </div>
          ))}
        {!showPaymentConfirmation ? (
          <form onSubmit={this.handleSave} ref={this.form}>
            <div className={classnames(showPayment && styles.hideUserForm)}>
              <ConnectInput
                basic
                name="user_first_name"
                value={user_first_name}
                label="First Name *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
                required
              />

              <ConnectInput
                basic
                name="user_last_name"
                value={user_last_name}
                label="Surname *"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
                required
              />

              <ConnectInput
                basic
                name="user_phone"
                value={user_phone}
                label="Mobile"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
              />

              <ConnectInput
                basic
                name="user_email"
                value={user_email}
                label="Email *"
                className="form-group"
                type="email"
                onChange={this.handleChangeRawEvent}
                required
              />

              <ConnectAgeInput
                basic
                name="user_birthdate"
                value={user_birthdate}
                label="Birthdate"
                className="form-group"
                type="date"
                onChange={this.handleChangeRawEvent}
                // pattern="(1[0-2]|0[1-9])\/(1[5-9]|2\d)"
                hideAge
              />

              <ConnectSelect
                placeholder
                basic
                name="current_licence"
                selected={current_licence}
                label="Current Licence"
                options={getCurrentLicenceOptions()}
                onChange={value => {
                  this.handleChange('current_licence', value)
                }}
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
                valueArray={getAvailableBikeHires(course)}
                onChange={value => {
                  this.handleChange('bike_hire', value)
                }}
                required
                valueField="value"
                labelField="title"
              />

              <ConnectCheckbox
                label="T&Cs Agreed"
                checked={tandcs_agreed}
                name="tandcs_agreed"
                onChange={this.handleChangeRawEvent}
              />

              <ConnectCheckbox
                label="Email Opt In"
                checked={email_optin}
                name="email_optin"
                onChange={this.handleChangeRawEvent}
              />

              {enable_third_party_optin && (
                <ConnectCheckbox
                  label="3rd Party Opt In"
                  checked={third_party_optin}
                  name="third_party_optin"
                  onChange={this.handleChangeRawEvent}
                />
              )}

              <ConnectTextArea
                basic
                name="notes"
                value={notes}
                label="Notes"
                className="form-group"
                type="text"
                onChange={this.handleChangeRawEvent}
              />
            </div>
            {showPayment && (
              <div>
                <CheckoutForm
                  price={price}
                  cardName={cardName}
                  handleCardNameChange={this.handleCardNameChange}
                  handleStripeElementChange={this.handleStripeElementChange}
                  setCardElement={this.setCardElement}
                />
              </div>
            )}
            <div className={styles.actions}>
              <div>
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
              </div>
              <div>
                <Button color="white" onClick={this.handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
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
              <Button small color="white" onClick={onCancel}>
                Close
              </Button>
            </p>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    widgetSettings: state.settings.widget.settings
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchWidgetSettings
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddOrderItem)
