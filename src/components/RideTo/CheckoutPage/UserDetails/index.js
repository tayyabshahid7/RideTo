import React, { Component } from 'react'
import classnames from 'classnames'
import moment from 'moment'
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
import { getCourseTitle } from 'services/course'
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

  renderRow(title, content, index, priceHighlight = false) {
    return (
      <div className={styles.rowItemOrderSummary} key={index}>
        <div className={styles.subtitle}>{title}</div>
        <div
          className={classnames(
            styles.content,
            priceHighlight && styles.highlightedPrice
          )}>
          {content}
        </div>
      </div>
    )
  }

  renderCourseInformation() {
    const { checkoutData, supplier, priceInfo } = this.props
    const { addons, courseType, date, bike_hire } = checkoutData
    return (
      <div className={styles.rowContainer}>
        {this.renderRow('Course', getCourseTitle(courseType))}
        {this.renderRow('Date & Time', moment(date).format('ddd D, MMMM'))}
        {this.renderRow('Location', `${supplier.town}, ${supplier.postcode}`)}
        {priceInfo.training_price
          ? this.renderRow(
              'Training',
              `£${(priceInfo.training_price / 100.0).toFixed(2)}`,
              100
            )
          : ''}
        {priceInfo.bike_hire_cost > 0 && bike_hire !== 'no'
          ? this.renderRow(
              'Bike Hire',
              `£${(priceInfo.bike_hire_cost / 100.0).toFixed(2)}`,
              100
            )
          : ''}
        {addons.map((addon, index) =>
          this.renderRow(
            addon.selectedSize
              ? `${addon.name} ${
                  addon.selectedSize.code === 'ALL'
                    ? ''
                    : '(' + addon.selectedSize.code + ')'
                }`
              : addon.name,
            `£${addon.price}`,
            index
          )
        )}
      </div>
    )
  }

  renderUserInfo() {
    const {
      details,
      manualAddress,
      errors = {},
      onChange,
      onPostalCodeSubmit,
      postcodeLookingup,
      checkoutData: { addons }
    } = this.props

    const currentLicenceOptions = getCurrentLicenceOptions()

    return (
      <div className={styles.container}>
        <div className={styles.hiddenOnDesktop}>
          <div className={styles.title}>Order Summary</div>
          {this.renderCourseInformation()}
          <hr />
        </div>
        <div id="checkout-your-details" className={styles.title}>
          Your Details
        </div>
        <div className={styles.rowItem}>
          <Input
            placeholder="First name"
            name="first_name"
            value={details.first_name}
            className={classnames(
              styles.input,
              errors.first_name && styles.inputError
            )}
            onChange={this.handleChange}
          />
          {errors.first_name && (
            <div className={styles.error}>{errors.first_name}</div>
          )}
          <Input
            placeholder="Last name"
            name="last_name"
            value={details.last_name}
            className={classnames(
              styles.input,
              errors.last_name && styles.inputError
            )}
            onChange={this.handleChange}
          />
          {errors.last_name && (
            <div className={styles.error}>{errors.last_name}</div>
          )}
          <Input
            placeholder="E-mail address"
            name="email"
            value={details.email}
            className={classnames(
              styles.input,
              errors.email && styles.inputError
            )}
            onChange={this.handleChange}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
          <div
            className={classnames(
              errors.user_birthdate && styles.inputError,
              styles.input
            )}>
            <DateInput
              placeholder="Date of Birth (DD/MM/YYYY)"
              id="user_birthdate"
              name="user_birthdate"
              minyears={16}
              value={details.user_birthdate}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className={styles.subtext}>DD/MM/YYYY</div>
          {errors.user_birthdate && (
            <div className={styles.error}>{errors.user_birthdate}</div>
          )}
          <div className={errors.phone && styles.inputError}>
            <PhoneInput
              placeholder="Telephone Number"
              name="phone"
              value={details.phone}
              onChange={this.handleChange}
              required
            />
          </div>
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
          <div className={styles.selectElement}>
            <Select
              value={details.current_licence}
              name="current_licence"
              className={classnames(
                styles.input,
                errors.current_licence && styles.inputError
              )}
              onChange={this.handleChange}>
              <option value="" hidden disabled>
                Current Licence
              </option>
              {currentLicenceOptions.map(licenseOption => (
                <option value={licenseOption.id} key={licenseOption.id}>
                  {licenseOption.name}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>Select the licence you have</div>
          {errors.current_licence && (
            <div className={styles.error}>{errors.current_licence}</div>
          )}
          <div className={styles.selectElement}>
            <Select
              value={details.riding_experience}
              name="riding_experience"
              className={classnames(
                styles.input,
                errors.riding_experience && styles.inputError
              )}
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
          <div className={styles.selectElement}>
            <Select
              value={details.rider_type}
              name="rider_type"
              className={classnames(
                styles.input,
                errors.rider_type && styles.inputError
              )}
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
        {addons.length > 0 && (
          <React.Fragment>
            <div id="checkout-delivery-address" className={styles.title}>
              Delivery Address
            </div>
            {!manualAddress && (
              <div className={styles.rowItem}>
                <div
                  className={classnames(
                    styles.input,
                    styles.searchPostcodeInput,
                    postcodeLookingup && styles.waiting,
                    errors.postcode && styles.inputError
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
                    required
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
            {manualAddress && (
              <div className={styles.rowItem}>
                <AddressForm
                  address={details.address}
                  onChange={this.handleAddressChange}
                  errors={errors.address}
                />
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    )
  }

  renderPaymentForm() {
    const { details, errors = {} } = this.props
    const inputStyle = {
      base: {
        fontSize: '15px',
        fontFamily: 'var(--font-proxima)',
        color: '#141414'
      }
    }
    return (
      <div className={styles.checkForm}>
        <div id="checkout-payment-details" className={styles.title}>
          Payment Details
        </div>
        <div className={styles.rowItem}>
          <div
            className={classnames(
              styles.cardElementWrapper,
              errors.card_number && styles.inputError
            )}>
            <CardNumberElement
              style={inputStyle}
              required
              onChange={element =>
                this.stripeElementChange(element, 'card_number')
              }
            />
          </div>
          <Input
            placeholder="Cardholder Name"
            name="card_name"
            value={details.card_name}
            className={classnames(
              styles.input,
              errors.card_name && styles.inputError
            )}
            onChange={this.handleChange}
            required
          />
          <Row>
            <Col>
              <div
                className={classnames(
                  styles.cardElementWrapper,
                  errors.expiry_date && styles.inputError
                )}>
                <CardExpiryElement
                  style={inputStyle}
                  required
                  placeholder="Expiry Date"
                  onChange={element =>
                    this.stripeElementChange(element, 'expiry_date')
                  }
                />
              </div>
              <div className={styles.subtext}>MM/YY</div>
            </Col>
            <Col>
              <div
                className={classnames(
                  styles.cardElementWrapper,
                  errors.cvv && styles.inputError
                )}>
                <CardCVCElement
                  required
                  style={inputStyle}
                  placeholder="CVV/CV2"
                  onChange={element => this.stripeElementChange(element, 'cvv')}
                />
              </div>
            </Col>
          </Row>
          <div
            className={classnames(
              styles.cardElementWrapper,
              errors.card_zip && styles.inputError
            )}>
            <PostalCodeElement
              required
              placeholder="Billing Postcode"
              style={inputStyle}
              onChange={element =>
                this.stripeElementChange(element, 'card_zip')
              }
            />
          </div>
        </div>
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
