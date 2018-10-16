import React, { Component } from 'react'
import classnames from 'classnames'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import { Row, Col } from 'reactstrap'
import DateInput from 'components/RideTo/DateInput'
import PhoneInput from 'components/RideTo/PhoneInput'
import Button from 'components/RideTo/Button'
import Input from 'components/RideTo/Input'
import AddressForm from 'components/AddressForm'
import { RidingExperiences, RiderTypes } from 'common/info'
import Select from 'components/RideTo/Select'
import { getCurrentLicenceOptions } from 'services/customer'
import styles from './styles.scss'

class UserDetails extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleBillingAddressChange = this.handleBillingAddressChange.bind(this)
    this.handleSearchPostcode = this.handleSearchPostcode.bind(this)
    this.stripeElementChange = this.stripeElementChange.bind(this)
  }

  handleChange(event) {
    const { onDetailChange } = this.props
    const { name, value } = event.target
    onDetailChange(name, value)
  }

  handleAddressChange(name, value) {
    const { onDetailChange } = this.props
    onDetailChange(`address.${name}`, value)
  }

  handleBillingAddressChange(name, value) {
    const { onDetailChange } = this.props
    onDetailChange(`billingAddress.${name}`, value)
  }

  handleSearchPostcode() {
    const { postcode } = this.props.details

    this.props.onPostalCodeSubmit(postcode)
  }

  stripeElementChange(element, name) {
    const { onDetailChange } = this.props
    if (!element.empty && element.complete) {
      onDetailChange(name, true)
    } else {
      onDetailChange(name, false)
    }
    // this.checkEmptyStripeElements();
  }

  renderUserInfo() {
    const {
      details,
      manualAddress,
      errors = {},
      onChange,
      onPostalCodeSubmit,
      postcodeLookingup,
      validStep
    } = this.props

    const currentLicenceOptions = getCurrentLicenceOptions()

    return (
      <div className={styles.container}>
        <div className={styles.title}>Your Details</div>
        <div className={styles.rowItem}>
          <DateInput
            placeholder="Date of Birth"
            id="user_birthdate"
            name="user_birthdate"
            minyears={16}
            value={details.user_birthdate}
            onChange={this.handleChange}
            required
          />
          <div className={styles.subtext}>DD/MM/YYYY</div>
          {errors.user_birthdate && (
            <div className={styles.error}>{errors.user_birthdate}</div>
          )}
          <PhoneInput
            placeholder="Telephone Number"
            name="phone"
            value={details.phone}
            onChange={this.handleChange}
            required
          />
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
          <div class={styles.selectElement}>
            <Select
              value={details.current_licence}
              name="current_licence"
              className={styles.input}
              onChange={this.handleChange}>
              <option value="" hidden disabled>
                Current License
              </option>
              {currentLicenceOptions.map(licenseOption => (
                <option value={licenseOption.id} key={licenseOption.id}>
                  {licenseOption.name}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>Select the license you have</div>
          {errors.current_licence && (
            <div className={styles.error}>{errors.current_licence}</div>
          )}
          <div class={styles.selectElement}>
            <Select
              value={details.riding_experience}
              name="riding_experience"
              className={styles.input}
              onChange={this.handleChange}
              required>
              <option value="" hidden disabled>
                Riding Experience
              </option>
              {RidingExperiences.map(ridingExperience => (
                <option
                  value={ridingExperience.value}
                  key={ridingExperience.value}>
                  {ridingExperience.title}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext} />
          {errors.riding_experience && (
            <div className={styles.error}>{errors.riding_experience}</div>
          )}
          <div class={styles.selectElement}>
            <Select
              value={details.rider_type}
              name="rider_type"
              className={styles.input}
              onChange={this.handleChange}
              required>
              <option value="" hidden disabled>
                Rider Type
              </option>
              {RiderTypes.map(riderType => (
                <option value={riderType.value} key={riderType.value}>
                  {riderType.title}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>Why you are learning to ride</div>
          {errors.rider_type && (
            <div className={styles.error}>{errors.rider_type}</div>
          )}
        </div>
        <div
          className={classnames(
            styles.title,
            validStep < 1 && styles.disabledTitle
          )}>
          Delivery Address
        </div>
        {!manualAddress &&
          validStep >= 1 && (
            <div className={styles.rowItem}>
              <div
                className={classnames(
                  styles.input,
                  styles.searchPostcodeInput,
                  postcodeLookingup && styles.waiting
                )}>
                <Input
                  id="postcodeSearch"
                  placeholder="Postcode"
                  name="postcode"
                  className={styles.findPostcodeInput}
                  onChange={this.handleChange}
                  onKeyUp={event =>
                    event.key === 'Enter' &&
                    onPostalCodeSubmit(event.target.value)
                  }
                  disabled={postcodeLookingup}
                />
                <Button
                  className={styles.postcodeSearchButton}
                  onClick={this.handleSearchPostcode}>
                  Search Address
                </Button>
              </div>
              {errors.postcode &&
                !postcodeLookingup && (
                  <div className={styles.error}>{errors.postcode}</div>
                )}
              <div
                className={styles.actionDiv}
                onClick={() => onChange({ manualAddress: true })}>
                Enter address manually
              </div>
            </div>
          )}
        {validStep >= 1 &&
          manualAddress && (
            <div className={styles.rowItem}>
              <AddressForm
                address={details.address}
                onChange={this.handleAddressChange}
                errors={errors.address}
              />
            </div>
          )}
      </div>
    )
  }

  renderPaymentForm() {
    const { details, errors = {}, validStep } = this.props
    const inputStyle = {
      base: {
        fontSize: '15px',
        fontFamily: 'ProximaNova',
        color: '#141414'
      }
    }
    return (
      <div className={styles.checkForm}>
        <div
          className={classnames(
            styles.title,
            validStep < 2 && styles.disabledTitle
          )}>
          Payment Details
        </div>
        {validStep >= 2 && (
          <div className={styles.rowItem}>
            <div className={styles.cardElementWrapper}>
              <CardNumberElement
                style={inputStyle}
                onChange={element =>
                  this.stripeElementChange(element, 'card_number')
                }
              />
            </div>
            <Input
              placeholder="Cardholder Name"
              name="card_name"
              value={details.card_name}
              className={styles.input}
              onChange={this.handleChange}
              required
            />
            <Row>
              <Col>
                <div className={styles.cardElementWrapper}>
                  <CardExpiryElement
                    style={inputStyle}
                    placeholder="Expiry Date"
                    onChange={element =>
                      this.stripeElementChange(element, 'expiry_date')
                    }
                  />
                </div>
                <div className={styles.subtext}>MM/YY</div>
              </Col>
              <Col>
                <div className={styles.cardElementWrapper}>
                  <CardCVCElement
                    style={inputStyle}
                    placeholder="CVV/CV2"
                    onChange={element =>
                      this.stripeElementChange(element, 'cvv')
                    }
                  />
                </div>
              </Col>
            </Row>
            <div className={styles.cardElementWrapper}>
              <PostalCodeElement
                style={inputStyle}
                onChange={element =>
                  this.stripeElementChange(element, 'card_zip')
                }
              />
            </div>
          </div>
        )}
        {errors.paymentError && (
          <div className={styles.paymentError}>
            <strong>{errors.paymentError}</strong>
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderUserInfo()}
        {this.renderPaymentForm()}
      </div>
    )
  }
}

export default UserDetails
