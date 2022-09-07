import addBlack from 'assets/images/rideto/AddBlack.svg'
import closeDark from 'assets/images/rideto/CloseDark.svg'
import classnames from 'classnames'
import { RiderTypes, RidingExperiences } from 'common/info'
import AddressForm from 'components/AddressForm'
import Button from 'components/RideTo/Button'
import CourseInformation from 'components/RideTo/CheckoutPage/OrderSummary/CourseInformation'
import DateInput from 'components/RideTo/DateInput'
import Input from 'components/RideTo/Input'
import LicenceInput from 'components/RideTo/LicenceInput'
import PhoneInput from 'components/RideTo/PhoneInput'
import Select from 'components/RideTo/Select'
import React, { Component } from 'react'
import {
  CardCVCElement,
  CardExpiryElement,
  CardNumberElement,
  PostalCodeElement
} from 'react-stripe-elements'
import { isAuthenticated } from 'services/auth'
import { getCurrentLicenceOptions } from 'services/customer'
import CardIcons from '../CardIcons'
import SectionSplitter from '../SectionSplitter'
import StripeComponent from '../StripeComponent'
import NextSteps from './NextSteps'
import styles from './styles.scss'

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
    this.handleEnterPressFirstName = this.handleEnterPressFirstName.bind(this)
    this.handleEnterPressLastName = this.handleEnterPressLastName.bind(this)
    this.handleEnterPressDOB = this.handleEnterPressDOB.bind(this)
    this.handleEnterPressPhoneNumber = this.handleEnterPressPhoneNumber.bind(
      this
    )
    this.handleEnterPressCurrentLicence = this.handleEnterPressCurrentLicence.bind(
      this
    )
    this.handleEnterPressRidingExperience = this.handleEnterPressRidingExperience.bind(
      this
    )
    this.handleEnterPressDriveLicenceNumber = this.handleEnterPressDriveLicenceNumber.bind(
      this
    )

    this.validateFirstName = this.validateFirstName.bind(this)
    this.validateLastName = this.validateLastName.bind(this)
    this.validateDOB = this.validateDOB.bind(this)
    this.validatePhone = this.validatePhone.bind(this)
    this.validateDriveLicenceNumber = this.validateDriveLicenceNumber.bind(this)

    this.userDetails = React.createRef()
    this.cardDetails = React.createRef()
  }

  handleEnterPressFirstName(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('last_name')
      input.focus()
    }
  }

  validateFirstName(e) {
    const { handleErrors, errors, getErrorDivId } = this.props
    if (!e.target.value) {
      errors['first_name'] = 'Please enter a valid first name'
      errors.divId = getErrorDivId('first_name')
      handleErrors({ ...errors })
    } else {
      if (errors.first_name) {
        delete errors.first_name
        handleErrors({ ...errors })
      }
    }
  }

  validateLastName(e) {
    const { handleErrors, errors, getErrorDivId } = this.props
    if (!e.target.value) {
      errors['last_name'] = 'Please enter a valid last name'
      errors.divId = getErrorDivId('last_name')
      handleErrors({ ...errors })
    } else {
      if (errors.last_name) {
        delete errors.last_name
        handleErrors({ ...errors })
      }
    }
  }

  validateDOB(e) {
    const { handleErrors, errors, getErrorDivId, isValidDate } = this.props

    const validatedDate = isValidDate(e.target.value)

    if (!validatedDate) {
      errors['user_birthdate'] =
        'You must be at least 16 years old to do your training. (On the selected date of training)'
      errors.divId = getErrorDivId('user_birthdate')
      handleErrors({ ...errors })
    }
  }

  validatePhone(e) {
    const { handleErrors, errors, getErrorDivId } = this.props

    if (!e.target.value.match(/^\+44\d{10}$/)) {
      errors['phone'] = 'Invalid phone number'
      if (!errors.divId) errors.divId = getErrorDivId('phone')
      handleErrors({ ...errors })
    } else {
      if (errors.phone) {
        delete errors.phone
        handleErrors({ ...errors })
      }
    }
  }

  validateDriveLicenceNumber(e) {
    const { handleErrors, errors, getErrorDivId } = this.props

    const drivingLicenceRegex = /^^[A-Z9]{5}\d{6}[A-Z9]{2}\d[A-Z]{2}$$/

    if (e.target.value) {
      if (
        !drivingLicenceRegex.test(
          e.target.value
            .split(' ')
            .join('')
            .toUpperCase()
        )
      ) {
        errors['driving_licence_number'] =
          'Please enter a valid driving licence number'
        if (!errors.divId)
          errors.divId = getErrorDivId('driving_licence_number')
        handleErrors({ ...errors })
      } else {
        if (errors.driving_licence_number) {
          delete errors.driving_licence_number
          handleErrors({ ...errors })
        }
      }
    }
  }

  handleEnterPressLastName(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('user_birthdate')
      input.focus()
    }
  }

  handleEnterPressDOB(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('phone_number')
      input.focus()
    }
  }

  handleEnterPressPhoneNumber(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('current_licence')
      input.focus()
    }
  }

  handleEnterPressCurrentLicence(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('riding_experience')
      input.focus()
    }
  }

  handleEnterPressDriveLicenceNumber(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('riding_experience')
      input.focus()
    }
  }

  handleEnterPressRidingExperience(e) {
    if (e.key === 'Enter') {
      const input = document.getElementById('rider_type')
      input.focus()
    }
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
              onKeyUp={e => e.key === 'Enter' && handleEmailSubmit()}
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
      showUserDetails,
      isRenewal
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
            onKeyUp={this.handleEnterPressFirstName}
            onBlur={this.validateFirstName}
          />
          {errors.first_name && (
            <div className={styles.error}>{errors.first_name}</div>
          )}
          <Input
            id="last_name"
            label="Last Name"
            placeholder="Last name"
            name="last_name"
            value={details.last_name}
            className={classnames(
              styles.input,
              errors.last_name && styles.inputError
            )}
            onChange={this.handleChange}
            onKeyUp={this.handleEnterPressLastName}
            onBlur={this.validateLastName}
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
              onKeyUp={this.handleEnterPressDOB}
              onBlur={this.validateDOB}
            />
          </div>
          {errors.user_birthdate && (
            <div className={styles.error}>{errors.user_birthdate}</div>
          )}
          <div
            className={classnames(
              styles.input,
              errors.phone && styles.inputError
            )}>
            <PhoneInput
              id="phone_number"
              label="Mobile Number"
              placeholder="Mobile Number"
              name="phone"
              value={details.phone}
              onChange={this.handlePhoneChange}
              required
              onKeyUp={this.handleEnterPressPhoneNumber}
              onBlur={this.validatePhone}
            />
          </div>
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
          <div className={styles.selectElement}>
            <Select
              id="current_licence"
              label="Current Licence"
              value={details.current_licence}
              name="current_licence"
              className={classnames(
                styles.input,
                errors.current_licence && styles.inputError
              )}
              onChange={this.handleChange}
              onKeyUp={this.handleEnterPressCurrentLicence}>
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
          <div
            className={classnames(
              styles.input,
              errors.driving_licence_number && styles.inputError,
              details.current_licence ===
                'CURRENT_LICENCES_FULL_EU_DRIVING_LICENCE' && styles.disabled
            )}>
            <LicenceInput
              disabled={
                details.current_licence ===
                'CURRENT_LICENCES_FULL_EU_DRIVING_LICENCE'
              }
              label="Driving Licence Number (Optional)"
              placeholder="_____ ______ __ _ __"
              name="driving_licence_number"
              id="driving_licence_number"
              value={details.driving_licence_number}
              className={classnames(
                styles.input,
                errors.driving_licence_number && styles.inputError
              )}
              onChange={this.handleChange}
              onKeyUp={this.handleEnterPressDriveLicenceNumber}
              onBlur={this.validateDriveLicenceNumber}
            />
          </div>
          <div className={styles.subtext}>
            You MUST bring your licence on the day of training
          </div>
          {errors.driving_licence_number && (
            <div className={styles.error}>{errors.driving_licence_number}</div>
          )}
          {isRenewal && (
            <>
              <div
                className={classnames(
                  errors.prev_cbt_date && styles.inputError,
                  styles.input
                )}>
                <DateInput
                  label="Previous CBT Completion Date"
                  id="prev_cbt_date"
                  name="prev_cbt_date"
                  value={details.prev_cbt_date}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className={styles.subtext}>
                The date you completed your previous CBT.
              </div>
              {errors.prev_cbt_date === 'over' && (
                <div className={styles.error}>
                  Your CBT has passed the renewal date, please book the{' '}
                  <a href="https://www.rideto.com/cbt-training">CBT</a> Training
                  course instead.
                </div>
              )}
              {errors.prev_cbt_date === 'future' && (
                <div className={styles.error}>Please input valid date.</div>
              )}
            </>
          )}
          <div className={styles.selectElement}>
            <Select
              id="riding_experience"
              label="Riding Experience"
              value={details.riding_experience}
              name="riding_experience"
              className={classnames(
                styles.input,
                errors.riding_experience && styles.inputError
              )}
              onChange={this.handleChange}
              required
              onKeyUp={this.handleEnterPressRidingExperience}>
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
              id="rider_type"
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

  stripeCheckout() {
    const {
      // details,
      // errors = {},
      showCardDetails,
      handlePaymentButtonClick,
      showUserDetails,
      onPaymentChange
    } = this.props

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
          <StripeComponent
            {...this.props}
            onPaymentChange={onPaymentChange}
            stripeElementChange={this.stripeElementChange}
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderEmail()}
        {this.renderUserInfo()}
        {/* {this.renderPaymentForm()} */}
        {this.stripeCheckout()}
      </div>
    )
  }
}

export default UserDetails
