import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './styles.scss'
import OrderPriceLine from 'components/Calendar/CoursesPanel/OrderPriceLine'
import { getFullLicenseType, getAvailableBikeHires } from 'common/info'
import { getPaymentOptions } from 'services/order'
import {
  checkCustomerExists,
  getCurrentLicenceOptions
} from 'services/customer'
import { fetchWidgetSettings } from 'store/settings'
import OrderPaymentContainer from 'pages/Invoices/components/OrderPaymentContainer'

import {
  ConnectInput,
  ConnectSelect,
  Button,
  ConnectCheckbox,
  ConnectAgeInput,
  ConnectTextArea
} from 'components/ConnectForm'
import { Desktop } from 'common/breakpoints'
import { validateEmail } from 'common/emailExtensions'

class AddOrderForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      paid: false,
      order: {
        school_course: this.props.course.id,
        user_birthdate: '',
        current_licence: '',
        user_email: '',
        user_first_name: '',
        user_last_name: '',
        user_phone: '',
        bike_hire: '',
        test_result: '',
        payment_status: '',
        riding_experience: '',
        full_licence_type: '',
        licence_number: '',
        start_time: `${this.props.course.date}T${this.props.course.time}Z`,
        tandcs_agreed: false,
        email_optin: false,
        notes: '',
        third_party_optin: false
      },
      orderResponse: null,
      userDetailsValid: false,
      showPayment: false
    }

    this.form = React.createRef()
  }

  componentDidMount() {
    const { widgetSettings, fetchWidgetSettings } = this.props

    if (!widgetSettings) {
      fetchWidgetSettings()
    }

    setTimeout(() => {
      window.scrollTo(0, 0)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.order !== prevState.order) {
      this.setState({
        userDetailsValid: this.form.current.checkValidity()
      })
    }
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  handleChangeRawEvent = event => {
    const { target } = event
    const { name } = target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { order } = this.state

    this.setState({ order: { ...order, [name]: value } })
  }

  handleChange = (typeName, value) => {
    const { order } = this.state
    order[typeName] = value

    if (typeName === 'bike_hire') {
      order.full_licence_type = getFullLicenseType(value)
    }
    this.setState({ order: { ...order } })
  }

  handleSave = async (event, withInvoice = false, withPayment = false) => {
    event.preventDefault()

    const { onSave } = this.props
    const { order } = this.state
    if (!validateEmail(order.user_email)) {
      alert('Invalid email address')
      return
    }

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

    if (!data.user_birthdate) {
      delete data.user_birthdate
    }
    const orderResponse = await onSave(data, withInvoice, withPayment)

    if (orderResponse) {
      this.setState({
        orderResponse: orderResponse,
        showPayment: withPayment
      })
    }
  }

  onOrderPaid = () => {
    this.setState({
      paid: true
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
      orderResponse,
      order: {
        bike_hire,
        payment_status,
        riding_experience,
        user_birthdate,
        current_licence,
        licence_number,
        user_email,
        user_first_name,
        user_last_name,
        user_phone,
        tandcs_agreed,
        email_optin,
        notes,
        third_party_optin
      },
      paid
    } = this.state

    const enable_third_party_optin =
      widgetSettings && widgetSettings.enable_third_party_optin

    let amount = pricing && pricing.price
    if (orderResponse && orderResponse.package && orderResponse.package.price) {
      amount = parseFloat(orderResponse.package.price) * 100
    }

    const customer = {
      full_name: `${user_first_name} ${user_last_name}`,
      email: user_email,
      phone: user_phone
    }
    const payOrderId = orderResponse && orderResponse.order_id

    const newOrder = {
      order: {
        payment_status: paid ? 'PAID' : payment_status
      }
    }

    return (
      <div className={styles.container}>
        {showPayment ? (
          <React.Fragment>
            <OrderPriceLine
              order={newOrder}
              orderDetail={orderResponse}
              course={this.props.course}
            />
            <OrderPaymentContainer
              customer={customer}
              amount={amount}
              orderId={payOrderId}
              onRefresh={onCancel}
              onPaid={this.onOrderPaid}
            />
          </React.Fragment>
        ) : (
          <form onSubmit={this.handleSave} ref={this.form}>
            <div>
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
                label="Last Name *"
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

              <ConnectInput
                basic
                name="licence_number"
                value={licence_number}
                label="Driver Number"
                type="text"
                onChange={this.handleChangeRawEvent}
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
            <div className={styles.actions}>
              <div>
                <Button type="submit" color="primary">
                  Add Order
                </Button>
              </div>
              <Desktop>
                <div>
                  <Button
                    type="button"
                    onClick={e => this.handleSave(e, true)}
                    color="white">
                    Add Order & Create Invoice
                  </Button>
                </div>
              </Desktop>
              {!!amount && (
                <div>
                  <Button
                    type="button"
                    onClick={e => this.handleSave(e, false, true)}
                    color="white">
                    Add Order & Take Payment
                  </Button>
                </div>
              )}
              <div>
                <Button color="white" onClick={this.handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
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
)(AddOrderForm)
