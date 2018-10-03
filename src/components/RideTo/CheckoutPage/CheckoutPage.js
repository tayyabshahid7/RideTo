import React, { Component } from 'react'
import { injectStripe } from 'react-stripe-elements'
import styles from './styles.scss'
import UserDetails from './UserDetails'
import OrderSummary from './OrderSummary'
import { fetchAddressWithPostcode } from 'services/misc'

class CheckoutPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {
        dob: '',
        phone: '',
        current_licences: [],
        riding_experience: '',
        rider_type: '',
        address: ''
      },
      payment: {
        card_name: '',
        sameAddress: true,
        address: ''
      },
      manualAddress: false,
      postcodeLookingup: false,
      addresses: []
    }
    this.handleOnUserChange = this.handleOnUserChange.bind(this)
    this.handleOnPaymentChange = this.handleOnPaymentChange.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.handlePostalcodeSubmit = this.handlePostalcodeSubmit.bind(this)
  }

  onUpdate(data) {
    this.setState({ ...data })
  }

  handleOnUserChange(data) {
    let { user } = this.state
    this.setState({ user: { ...user, ...data } })
  }

  handleOnPaymentChange(data) {
    let { payment } = this.state
    this.setState({ payment: { ...payment, ...data } })
  }

  async handlePostalcodeSubmit(postcode) {
    try {
      this.setState({ postcodeLookingup: true })
      let response = await fetchAddressWithPostcode({ postcode })
      if (response && response.addresses) {
        this.setState({
          postcodeLookingup: false,
          addresses: response.addresses
        })
      } else {
        this.setState({ postcodeLookingup: false })
      }
    } catch (error) {
      console.log('Error - ', error)
      this.setState({ postcodeLookingup: false })
    }
  }

  render() {
    const { user, payment, manualAddress, postcodeLookingup } = this.state

    return (
      <div className={styles.container}>
        <div className={styles.leftPanel}>
          <UserDetails
            {...this.props}
            user={user}
            payment={payment}
            onUserChange={this.handleOnUserChange}
            onPaymentChange={this.handleOnPaymentChange}
            onChange={this.onUpdate}
            manualAddress={manualAddress}
            onPostalCodeSubmit={this.handlePostalcodeSubmit}
            postcodeLookingup={postcodeLookingup}
          />
        </div>
        <div className={styles.rightPanel}>
          <OrderSummary {...this.props} />
        </div>
      </div>
    )
  }
}

export default injectStripe(CheckoutPage)
