import React, { Component } from 'react'
import moment from 'moment'

import classnames from 'classnames'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import MapComponent from 'components/RideTo/MapComponent'
import Checkbox from 'components/Checkbox'
import Input from 'components/RideTo/Input'
import Loading from 'components/Loading'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import IconMoneyBack from 'assets/icons/IconMoneyBack.svg'
import { getCourseTitle } from 'services/course'
import { getExpectedPrice, getBikeHireDetail } from 'services/order'
import { Button } from 'reactstrap'
import { SHORT_LICENCE_TYPES } from 'common/constants'

class OrderSummary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showPromo: false
    }
  }

  componentDidUpdate(prevProps) {
    const { errors } = this.props
    if (errors.divId) {
      document.getElementById(errors.divId).scrollIntoView()
    }
  }

  renderRow(title, content, index, priceHighlight = false) {
    return (
      <div className={styles.rowItem} key={index}>
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
    const {
      checkoutData,
      supplier,
      priceInfo,
      showMap,
      handleMapButtonClick,
      trainings
    } = this.props
    const { addons, courseType, date, bike_hire } = checkoutData
    const lat = parseFloat(window.RIDETO_PAGE.checkout.supplier.latitude)
    const lng = parseFloat(window.RIDETO_PAGE.checkout.supplier.longitude)
    const isFullLicence = courseType === 'FULL_LICENCE'

    return (
      <div className={styles.rowContainer}>
        {isFullLicence &&
          this.renderRow(
            'Course',
            `Full Licence (${
              SHORT_LICENCE_TYPES[trainings[0].full_licence_type]
            })`
          )}
        {isFullLicence &&
          trainings.map((training, index) => {
            if (training.price) {
              return (
                <div key={index}>
                  {this.renderRow(
                    getCourseTitle(training.course_type).replace(
                      'Full Licence',
                      ''
                    ),
                    moment(training.requested_date).format('ddd D, MMMM')
                  )}
                </div>
              )
            } else {
              return null
            }
          })}
        {!isFullLicence && this.renderRow('Course', getCourseTitle(courseType))}
        {this.renderRow('Bike hire', getBikeHireDetail(bike_hire))}
        {!isFullLicence &&
          this.renderRow('Date & Time', moment(date).format('ddd D, MMMM'))}
        {this.renderRow(
          'Location',
          <button className={styles.mapButton} onClick={handleMapButtonClick}>
            {`${supplier.town}, ${supplier.postcode}`}
          </button>
        )}
        {showMap && (
          <MapComponent
            userLocation={{ lat, lng }}
            width={'auto'}
            height={200}
            checkout
          />
        )}
        {!isFullLicence && priceInfo.training_price
          ? this.renderRow(
              'Training',
              `£${(priceInfo.training_price / 100.0).toFixed(2)}`,
              100
            )
          : ''}
        {priceInfo.bike_hire_cost > 0 && bike_hire !== 'no'
          ? this.renderRow(
              'Bike Hire Cost',
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

  renderPrices() {
    const { checkoutData, priceInfo } = this.props
    const { addons } = checkoutData
    let price = getExpectedPrice(priceInfo, addons, checkoutData)
    return (
      <div className={styles.rowContainer}>
        {priceInfo.discount
          ? this.renderRow(
              'Discount',
              `- £${(priceInfo.discount / 100.0).toFixed(2)}`,
              200
            )
          : ''}
        {this.renderRow(
          'Order Total',
          `£${(price / 100).toFixed(2)}`,
          100,
          true
        )}
      </div>
    )
  }

  render() {
    const {
      onSubmit,
      saving,
      instantBook,
      voucher_code,
      handleVoucherApply,
      onChange,
      loadingPrice,
      details,
      onDetailChange,
      errors = {}
    } = this.props
    const { showPromo } = this.state
    let confirmDisabled = saving || !details.accept_terms

    return (
      <div className={styles.container}>
        <div className={styles.hiddenOnMobile}>
          <div className={styles.title}>Order Summary</div>
          {this.renderCourseInformation()}
          <hr />
        </div>
        {this.renderPrices()}
        <div className={styles.acceptTerms}>
          <Checkbox
            checked={details.accept_terms}
            extraClass="WidgetCheckbox"
            size="large"
            onChange={event =>
              onDetailChange('accept_terms', event.target.checked)
            }>
            <div>
              I can confirm that I have read and agreed to the requirements and{' '}
              <a
                href="https://www.rideto.com/terms"
                rel="noopener noreferrer"
                target="_blank">
                terms and conditions.
              </a>
            </div>
          </Checkbox>
          <div className={styles.terms}>
            <ul>
              <li>
                I will be able to present a valid Full UK Drivers Licence or
                Provisional licence (with Category A entitlement)
              </li>
              <li>Or full EU licence with UK counterpart licence number</li>
              <li>
                I’m able to read a registration plate at a distance of 20 meters
              </li>
              <li>
                I’m able to speak and understand English and understand the
                Highway Code to a good level
              </li>
              <li>I’m able to ride an adult size bicycle</li>
              <li>
                I’ll wear suitable clothing including sturdy trousers (e.g.
                jeans) and boots
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.acceptTerms}>
          <Checkbox
            checked={details.email_optin}
            extraClass="WidgetCheckbox"
            size="large"
            onChange={event =>
              onDetailChange('email_optin', event.target.checked)
            }>
            <div>
              Join the RideTo community newsletter to be invited to weekly ride
              outs, events and special offers.
            </div>
          </Checkbox>
        </div>
        {errors.paymentError && (
          <div className={styles.paymentError}>
            <strong>{errors.paymentError}</strong>
          </div>
        )}
        <Loading loading={saving}>
          <RideToButton
            className={classnames(
              styles.action,
              confirmDisabled && styles.confirmDisabled
            )}
            onClick={() => !confirmDisabled && onSubmit()}>
            <span>Confirm And Pay</span>
            <img src={ButtonArrowWhite} alt="arrow" />
          </RideToButton>
        </Loading>
        <div className={styles.promoWrapper}>
          {showPromo ? (
            <div className={styles.promoContainer}>
              <Input
                placeholder="Promo code"
                name="voucher_code"
                value={voucher_code}
                className={styles.promoInput}
                onChange={event =>
                  onChange({ voucher_code: event.target.value })
                }
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
        {!instantBook && (
          <div id="terms-conditions-section" className={styles.information}>
            <p>
              You won't be charged until your booking is confirmed, we'll just
              reserve the amount on your card. Bookings require confirmation
              from the instructor, usually within 3 working hours.
            </p>
          </div>
        )}
        <hr className={styles.hr} />
        <div className={styles.guaranteeInfo}>
          <div className={styles.guaranteeLogo}>
            <img src={IconMoneyBack} alt="money-back" />
          </div>
          <div className={styles.guarenteeContent}>
            <div className={styles.guarantee1}>
              Cancel with 3 working days notice to get a full refund.
            </div>
            <a
              href="https://www.rideto.com/terms#cancellations"
              className={styles.guarantee2}
              target="_blank"
              rel="noopener noreferrer">
              More Details
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default OrderSummary
