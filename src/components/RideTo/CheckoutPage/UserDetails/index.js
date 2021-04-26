import React, { Component } from 'react'
import classnames from 'classnames'
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements'
import DateInput from 'components/RideTo/DateInput'
import LicenceInput from 'components/RideTo/LicenceInput'
import PhoneInput from 'components/RideTo/PhoneInput'
import Input from 'components/RideTo/Input'
import { RidingExperiences, RiderTypes } from 'common/info'
import Select from 'components/RideTo/Select'
import { getCurrentLicenceOptions } from 'services/customer'
import styles from './styles.scss'
import CourseInformation from 'components/RideTo/CheckoutPage/OrderSummary/CourseInformation'
import NextSteps from './NextSteps'
import addBlack from 'assets/images/rideto/AddBlack.svg'
import closeDark from 'assets/images/rideto/CloseDark.svg'
import SectionSplitter from '../SectionSplitter'
import CardIcons from '../CardIcons'
import AddressForm from 'components/AddressForm'
import Button from 'components/RideTo/Button'
import { isAuthenticated } from 'services/auth'

class UserDetails extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cardBrand: null,
      userAuthenticated: isAuthenticated()
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleBillingAddressChange = this.handleBillingAddressChange.bind(this)
    this.handlePhoneChange = this.handlePhoneChange.bind(this)
    this.handleSearchPostcode = this.handleSearchPostcode.bind(this)
    this.stripeElementChange = this.stripeElementChange.bind(this)

    this.userDetails = React.createRef()
    this.cardDetails = React.createRef()
  }

  componentDidUpdate(prevProps) {
    const { showCardDetails, showUserDetails } = this.props

    function scrollToElement(element) {
      setTimeout(() => {
        if (element) {
          const offset = element.offsetTop

          window.scrollTo({ top: offset, behavior: 'smooth' })
        }
      }, 99)
    }

    if (
      prevProps.showUserDetails !== showUserDetails &&
      showUserDetails &&
      !isAuthenticated()
    ) {
      scrollToElement(this.userDetails.current)
    }

    if (
      prevProps.showCardDetails !== showCardDetails &&
      showCardDetails &&
      !isAuthenticated()
    ) {
      scrollToElement(this.cardDetails.current)
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
    const { brand, elementType } = element
    if (!element.empty && element.complete) {
      onDetailChange(name, true)
    } else {
      onDetailChange(name, false)
    }
    if (elementType === 'cardNumber') {
      this.setState({
        cardBrand: brand
      })
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

  renderEmail() {
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
      hasPOM,
      isFullLicence,
      instantBook,
      handleEmailSubmit,
      emailSubmitted,
      handleChangeEmailClick
    } = this.props
    const { userAuthenticated } = this.state

    return (
      <div className={styles.whiteBox}>
        <NextSteps isFullLicence={isFullLicence} instantBook={instantBook} />
        <div className={styles.hiddenOnDesktop}>
          <div className={classnames(styles.title, styles.titleOrderSummary)}>
            Your Booking
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
        <SectionSplitter hideDesktop />
        <div
          id="checkout-your-email"
          className={styles.title}
          style={{ marginTop: '2rem', marginBottom: '-0.5rem' }}>
          Email Address
        </div>
        <div className={styles.rowItem}>
          <div className={styles.addOnInput}>
            <Input
              label="Email Address"
              type="email"
              placeholder="E-mail address"
              name="email"
              value={details.email}
              className={classnames(
                styles.input,
                errors.email && styles.inputError
              )}
              onChange={this.handleChange}
              disabled={userAuthenticated || emailSubmitted}
            />
            {!emailSubmitted ? (
              <Button
                className={styles.submitButton}
                onClick={handleEmailSubmit}>
                Add my email
              </Button>
            ) : (
              <Button
                className={styles.changeButton}
                onClick={handleChangeEmailClick}>
                Change
              </Button>
            )}
          </div>
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
      </div>
    )
  }

  renderUserInfo() {
    const {
      details,
      errors = {},
      needsAddress,
      manualAddress,
      postcodeLookingup,
      onChange,
      onPostalCodeSubmit,
      showUserDetails
    } = this.props
    const { userAuthenticated } = this.state

    const currentLicenceOptions = getCurrentLicenceOptions()

    return (
      <div
        className={classnames(
          styles.whiteBox,
          !showUserDetails && !userAuthenticated && styles.hideDetails
        )}>
        <div
          ref={this.userDetails}
          id="checkout-your-details"
          className={styles.title}>
          Rider's Details
        </div>
        <div className={classnames(styles.rowItem)}>
          <Input
            label="First Name"
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
            label="Last Name"
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
          <div
            className={classnames(
              errors.user_birthdate && styles.inputError,
              styles.input
            )}>
            <DateInput
              label="Date of Birth"
              placeholder="Date of Birth"
              id="user_birthdate"
              name="user_birthdate"
              minyears={16}
              value={details.user_birthdate}
              onChange={this.handleChange}
              required
            />
          </div>
          {errors.user_birthdate && (
            <div className={styles.error}>{errors.user_birthdate}</div>
          )}
          <div
            className={classnames(
              styles.input,
              errors.driving_licence_number && styles.inputError
            )}>
            <LicenceInput
              label="Driving Licence Number"
              placeholder="Driving Licence Number"
              name="driving_licence_number"
              id="driving_licence_number"
              value={details.driving_licence_number}
              className={classnames(
                styles.input,
                errors.driving_licence_number && styles.inputError
              )}
              onChange={this.handleChange}
            />
          </div>
          {errors.driving_licence_number && <div className={styles.error}>{errors.driving_licence_number}</div>}
          <div
            className={classnames(
              styles.input,
              errors.phone && styles.inputError
            )}>
            <PhoneInput
              label="Mobile Number"
              placeholder="Mobile Number"
              name="phone"
              value={details.phone}
              onChange={this.handlePhoneChange}
              required
            />
          </div>
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
          <div className={styles.selectElement}>
            <Select
              label="Current Licence"
              value={details.current_licence}
              name="current_licence"
              className={classnames(
                styles.input,
                errors.current_licence && styles.inputError
              )}
              onChange={this.handleChange}>
              <option value="" hidden disabled></option>
              {currentLicenceOptions.map(licenseOption => (
                <option value={licenseOption.id} key={licenseOption.id}>
                  {licenseOption.name}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>
            Which licence do you currently have?
          </div>
          {errors.current_licence && (
            <div className={styles.error}>{errors.current_licence}</div>
          )}
          <div className={styles.selectElement}>
            <Select
              label="Riding Experience"
              value={details.riding_experience}
              name="riding_experience"
              className={classnames(
                styles.input,
                errors.riding_experience && styles.inputError
              )}
              onChange={this.handleChange}
              required>
              <option value="" hidden disabled></option>
              {RidingExperiences.map(ridingExperience => (
                <option
                  value={ridingExperience.value}
                  key={ridingExperience.value}>
                  {ridingExperience.title}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>
            Do you have any riding experience?
          </div>
          {errors.riding_experience && (
            <div className={styles.error}>{errors.riding_experience}</div>
          )}
          <div className={styles.selectElement}>
            <Select
              label="Rider Type"
              value={details.rider_type}
              name="rider_type"
              className={classnames(
                styles.input,
                errors.rider_type && styles.inputError
              )}
              onChange={this.handleChange}
              required>
              <option value="" hidden disabled></option>
              {RiderTypes.map(riderType => (
                <option value={riderType.value} key={riderType.value}>
                  {riderType.title}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.subtext}>Why you are learning to ride?</div>
          {errors.rider_type && (
            <div className={styles.error}>{errors.rider_type}</div>
          )}
          {needsAddress && (
            <React.Fragment>
              <div
                id="checkout-delivery-address"
                className={classnames(styles.title, styles.titleAddress)}>
                Delivery Address
              </div>
              {!manualAddress && (
                <React.Fragment>
                  <div
                    className={classnames(
                      styles.input,
                      styles.searchPostcodeInput,
                      postcodeLookingup && styles.waiting
                    )}>
                    <Input
                      id="postcodeSearch"
                      placeholder=""
                      label="Postcode"
                      name="postcode"
                      className={classnames(
                        styles.findPostcodeInput,
                        errors.postcode && styles.inputError
                      )}
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
                </React.Fragment>
              )}
              {manualAddress && (
                <AddressForm
                  address={details.address}
                  onChange={this.handleAddressChange}
                  errors={errors.address}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }

  renderPaymentForm() {
    const {
      details,
      errors = {},
      showCardDetails,
      handlePaymentButtonClick,
      setCardElement,
      showUserDetails
    } = this.props
    const { cardBrand } = this.state
    const inputStyle = {
      base: {
        fontSize: '15px',
        fontFamily: 'var(--font-proxima)',
        color: '#141414'
      }
    }
    return (
      <div
        className={classnames(
          styles.whiteBox,
          styles.checkForm,
          !showUserDetails && styles.hidePayment
        )}
        ref={this.cardDetails}>
        <button
          onClick={handlePaymentButtonClick}
          id="checkout-payment-details"
          className={classnames(styles.title, styles.paymentButton)}>
          Payment Details
          {!showCardDetails ? (
            <img src={addBlack} alt="Add" width="15" height="15" />
          ) : (
            <img src={closeDark} alt="Close" width="15" height="15" />
          )}
        </button>
        <div
          className={classnames(
            styles.rowItem,
            styles.cardDetails,
            !showCardDetails && styles.hideCardDetails
          )}>
          <label
            className={styles.cardLabel}
            style={{ marginBottom: '1.75rem' }}>
            <span>Card number</span>
            <div
              style={{ marginBottom: '5px' }}
              id="stripe-card-number"
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
                onReady={element => setCardElement(element)}
              />
            </div>
            <CardIcons selected={cardBrand} />
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
          <div className={styles.row}>
            <div className={styles.col}>
              <label className={styles.cardLabel}>
                <span>Expiry date</span>
                <div
                  id="stripe-card-expiry"
                  className={classnames(
                    styles.cardElementWrapper,
                    errors.expiry_date && styles.inputError
                  )}>
                  <CardExpiryElement
                    style={inputStyle}
                    required
                    placeholder="MM/YY"
                    onChange={element =>
                      this.stripeElementChange(element, 'expiry_date')
                    }
                  />
                </div>
              </label>
            </div>
            <div className={styles.col}>
              <label className={styles.cardLabel}>
                <span>CVV/CV2</span>
                <div
                  id="stripe-card-cvc"
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
            </div>
          </div>

          <label className={styles.cardLabel}>
            <span>Billing postcode</span>
            <div
              id="stripe-card-postcode"
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
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderEmail()}
        {this.renderUserInfo()}
        {this.renderPaymentForm()}
      </div>
    )
  }
}

export default UserDetails
