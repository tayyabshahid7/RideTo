import React, { Component, Fragment } from 'react'

import classnames from 'classnames'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import Checkbox from 'components/Checkbox'
// import Input from 'components/RideTo/Input'
import Loading from 'components/Loading'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import IconMoneyBack from 'assets/icons/IconMoneyBack.svg'
// import { getExpectedPrice, getBikeHireDetail } from 'services/order'
import { getExpectedPrice } from 'services/order'
import { checkAllowedDate } from 'services/date'
import CourseInformation from 'components/RideTo/CheckoutPage/OrderSummary/CourseInformation'

class OrderSummary extends Component {
  componentDidUpdate(prevProps) {
    const { errors } = this.props
    if (errors.divId) {
      const el = document.getElementById(errors.divId)
      el && el.scrollIntoView()
    }
  }

  isValidDate() {
    const { trainings, checkoutData } = this.props
    return checkAllowedDate(
      (trainings && trainings[0].requested_date) || checkoutData.date
    )
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

  renderPrices() {
    const { checkoutData, priceInfo } = this.props
    const { addons } = checkoutData
    let price = getExpectedPrice(priceInfo, addons, checkoutData)
    return (
      <div>
        {priceInfo.discount
          ? this.renderRow(
              'Discount',
              `- £${(priceInfo.discount / 100.0).toFixed(2)}`,
              200
            )
          : ''}
        <div className={styles.totalPriceRow}>
          <div className={styles.priceLabel}>Total:</div>
          <div className={styles.totalPrice}>{`£${(price / 100).toFixed(
            2
          )}`}</div>
        </div>
      </div>
    )
  }

  render() {
    const {
      onSubmit,
      saving,
      instantBook,
      // voucher_code,
      // handleVoucherApply,
      // onChange,
      // loadingPrice,
      details,
      onDetailChange,
      errors = {},
      checkoutData,
      supplier,
      priceInfo,
      showMap,
      handleMapButtonClick,
      trainings,
      handlePOMToggleClick,
      hasPOM,
      showCardDetails
    } = this.props
    let confirmDisabled =
      saving || !details.accept_terms || !this.isValidDate() || !showCardDetails
    const isFullLicence = checkoutData.courseType === 'FULL_LICENCE'

    return (
      <div className={styles.container}>
        <div className={styles.hiddenOnMobile}>
          <div className={styles.title}>Your Order</div>
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
        <div
          className={classnames(
            styles.acceptTermsWrapper,
            !showCardDetails && styles.acceptTermsWrapperHideMobile
          )}>
          <div
            className={classnames(
              styles.acceptTerms,
              !showCardDetails && styles.acceptTermsHideMobile
            )}>
            <Checkbox
              checked={details.accept_terms}
              extraClass="WidgetCheckbox"
              size="large"
              onChange={event =>
                onDetailChange('accept_terms', event.target.checked)
              }>
              <div>
                I confirm I have read and agree to the{' '}
                <a
                  href="https://www.rideto.com/terms"
                  rel="noopener noreferrer"
                  target="_blank">
                  terms and conditions
                </a>{' '}
                and:
              </div>
            </Checkbox>
            <div className={styles.terms}>
              <ul>
                <li>
                  I will be able to present a valid UK Driving or Provisional
                  licence (with Category A entitlement)
                </li>
                <li>Or a Full EU licence with UK counterpart licence number</li>
                <li>
                  I'm able to read a registration plate from a distance of 20.5
                  meters
                </li>
                <li>
                  I'm able to speak and understand English and understand the
                  Highway Code to a good level
                </li>
                <li>I'm able to ride an adult size bicycle</li>
                <li>
                  I'll wear suitable clothing to training including thick
                  trousers (e.g. jeans) and boots
                </li>
                {isFullLicence && (
                  <Fragment>
                    <li>I have a valid CBT certificate</li>
                    <li>I have a valid motorcycle theory certificate</li>
                  </Fragment>
                )}
              </ul>
            </div>
          </div>
          <div
            className={classnames(
              styles.acceptTerms,
              !showCardDetails && styles.acceptTermsHideMobile
            )}>
            <Checkbox
              checked={details.email_optin}
              extraClass="WidgetCheckbox"
              size="large"
              onChange={event =>
                onDetailChange('email_optin', event.target.checked)
              }>
              <div>
                Join the RideTo community newsletter to be invited to weekly
                ride outs, events and special offers.
              </div>
            </Checkbox>
          </div>
        </div>
        {this.renderPrices()}
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
        {!this.isValidDate() && (
          <div className={styles.dateError}>
            Bookings for the next day must be made before 5:30pm. Please return
            to the results page to pick a later date.
          </div>
        )}

        <div className={styles.sectionFooter}>
          {!instantBook && (
            <div id="terms-conditions-section" className={styles.information}>
              <p>
                You won't be charged until your booking is confirmed, we'll just
                reserve the amount on your card. Bookings require confirmation
                from the instructor, usually within 3 working hours.
              </p>
            </div>
          )}
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
      </div>
    )
  }
}

export default OrderSummary
