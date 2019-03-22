import React, { Component } from 'react'
import classnames from 'classnames'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import { Row, Col, Button } from 'reactstrap'
import DateInput from 'components/RideTo/DateInput'
import PhoneInput from 'components/RideTo/PhoneInput'
import Input from 'components/RideTo/Input'
import { RidingExperiences, RiderTypes } from 'common/info'
import Select from 'components/RideTo/Select'
import { getCurrentLicenceOptions } from 'services/customer'
import styles from './styles.scss'
import CourseInformation from 'components/RideTo/CheckoutPage/OrderSummary/CourseInformation'

class UserDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showPromo: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleBillingAddressChange = this.handleBillingAddressChange.bind(this)
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.handleSearchPostcode = this.handleSearchPostcode.bind(this)
    this.stripeElementChange = this.stripeElementChange.bind(this)

    this.cardDetails = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { showCardDetails } = this.props

    if (prevProps.showCardDetails !== showCardDetails) {
      const cardDetails = this.cardDetails.current

      cardDetails.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
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

  handlePhoneChange(value) {
    const { onDetailChange } = this.props
    onDetailChange('phone', value)
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

  renderUserInfo() {
    const {
      details,
      errors = {},
      checkoutData,
      supplier,
      priceInfo,
      showMap,
      handleMapButtonClick,
      trainings,
      handlePOMToggleClick,
      hasPOM
    } = this.props

    const currentLicenceOptions = getCurrentLicenceOptions()

    return (
      <div className={styles.container}>
        <div className={styles.hiddenOnDesktop}>
          <div className={classnames(styles.title, styles.hiddenOnMobile)}>
            Order Summary
          </div>
          <CourseInformation
            checkoutData={checkoutData}
            supplier={supplier}
            priceInfo={priceInfo}
            showMap={showMap}
            handleMapButtonClick={handleMapButtonClick}
            trainings={trainings}
            handlePOMToggleClick={handlePOMToggleClick}
            hasPOM={hasPOM}
          />
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
            type="email"
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
              placeholder="Date of Birth"
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
          <div
            className={classnames(
              styles.input,
              errors.phone && styles.inputError
            )}>
            <PhoneInput
              placeholder="Telephone Number"
              name="phone"
              value={details.phone}
              onChange={this.handlePhoneChange}
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

        {/*

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
                {errors.postcode && !postcodeLookingup && (
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

        */}
      </div>
    )
  }

  renderPaymentForm() {
    const { details, errors = {}, showCardDetails } = this.props
    const inputStyle = {
      base: {
        fontSize: '15px',
        fontFamily: 'var(--font-proxima)',
        color: '#141414'
      }
    }
    return (
      <div className={styles.checkForm} ref={this.cardDetails}>
        <div id="checkout-payment-details" className={styles.title}>
          Payment Details
        </div>
        <div
          className={classnames(
            styles.rowItem,
            styles.cardDetails,
            !showCardDetails && styles.hideCardDetails
          )}>
          <label className={styles.cardLabel}>
            <span>Card number</span>
            <div
              className={classnames(
                styles.cardElementWrapper,
                errors.card_number && styles.inputError
              )}>
              <CardNumberElement
                placeholder=""
                style={inputStyle}
                required
                onChange={element =>
                  this.stripeElementChange(element, 'card_number')
                }
              />
            </div>
          </label>
          <label className={styles.cardLabel}>
            <span>Name on card</span>
            <Input
              placeholder=""
              name="card_name"
              value={details.card_name}
              className={classnames(
                styles.input,
                errors.card_name && styles.inputError
              )}
              onChange={this.handleChange}
              required
            />
          </label>
          <Row>
            <Col>
              <label className={styles.cardLabel}>
                <span>Expiry date</span>
                <div
                  className={classnames(
                    styles.cardElementWrapper,
                    errors.expiry_date && styles.inputError
                  )}>
                  <CardExpiryElement
                    style={inputStyle}
                    required
                    placeholder=""
                    onChange={element =>
                      this.stripeElementChange(element, 'expiry_date')
                    }
                  />
                </div>
                <div className={styles.subtext}>MM/YY</div>
              </label>
            </Col>
            <Col>
              <label className={styles.cardLabel}>
                <span>CVV/CV2</span>
                <div
                  className={classnames(
                    styles.cardElementWrapper,
                    styles.cvvElementWrapper,
                    errors.cvv && styles.inputError
                  )}>
                  <CardCVCElement
                    required
                    style={inputStyle}
                    placeholder=""
                    onChange={element =>
                      this.stripeElementChange(element, 'cvv')
                    }
                  />
                </div>
              </label>
            </Col>
          </Row>

          <label className={styles.cardLabel}>
            <span>Billing postcode</span>
            <div
              className={classnames(
                styles.cardElementWrapper,
                errors.card_zip && styles.inputError
              )}>
              <PostalCodeElement
                required
                placeholder=""
                style={inputStyle}
                onChange={element =>
                  this.stripeElementChange(element, 'card_zip')
                }
              />
            </div>
          </label>
          {this.renderPromoCode()}
        </div>
      </div>
    )
  }

  renderPromoCode() {
    const {
      voucher_code,
      loadingPrice,
      handleVoucherApply,
      onChange
    } = this.props
    const { showPromo } = this.state

    return (
      <div className={styles.promoWrapper}>
        {showPromo ? (
          <div className={styles.promoContainer}>
            <Input
              placeholder="Promo code"
              name="voucher_code"
              value={voucher_code}
              className={styles.promoInput}
              onChange={event => onChange({ voucher_code: event.target.value })}
              required
            />
            <Button
              color="primary"
              className={styles.applyBtn}
              disabled={voucher_code === '' || loadingPrice}
              onClick={handleVoucherApply}>
              Apply
            </Button>
          </div>
        ) : (
          <div
            className={styles.promoAction}
            onClick={() => this.setState({ showPromo: true })}>
            I have a promo code
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
