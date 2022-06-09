import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import classnames from 'classnames'
import Checkbox from 'components/Checkbox'
// import Input from 'components/RideTo/Input'
import Loading from 'components/Loading'
import RideToButton from 'components/RideTo/Button'
import CourseInformation from 'components/RideTo/CheckoutPage/OrderSummary/CourseInformation'
import POMSelector from 'components/RideTo/CheckoutPage/POMSelector'
import PromoCode from 'components/RideTo/CheckoutPage/PromoCode'
import CourseTypeDetails from 'components/RideTo/CourseTypeDetails'
import FullLicencePayment from 'components/RideTo/ResultPage/CourseDetailPanel/FullLicencePayment'
import React, { Component, Fragment } from 'react'
import Script from 'react-load-script'
import { checkAllowedDate } from 'services/date'
import { capitalizeFirstLetter } from 'utils/helper'
import { PoweredByStripe } from '../../../../assets/icons'
import moneyBack from '../../../../assets/icons/money-back.svg'
import CardIcons from '../CardIcons'
import FAQS from './faqs'
import styles from './styles.scss'

class OrderSummary extends Component {
  componentDidUpdate(prevProps) {
    const { errors } = this.props
    if (errors.divId) {
      const el = document.getElementById(errors.divId)
      el && el.scrollIntoView()
    }
  }

  isValidDate() {
    const { trainings, checkoutData, instantBook } = this.props

    if (trainings && trainings[0].course_type === 'FULL_LICENCE') {
      return true
    }

    return checkAllowedDate(
      (trainings && trainings[0].requested_date) || checkoutData.date,
      instantBook
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

  renderPrices(isFullLicence) {
    const { checkoutData, priceInfo, trainings } = this.props
    const { addons } = checkoutData
    let { price, fee, discount } = priceInfo
    return (
      <div>
        {fee > 0 && (
          <div className={styles.discountRow}>
            {this.renderRow(
              `Klarna fee`,
              `£${parseFloat(fee / 100).toFixed(2)}`,
              200
            )}
          </div>
        )}
        {addons.length > 0 &&
          addons.map(addon => (
            <div key={addon.id} className={styles.discountRow}>
              {this.renderRow(
                addon.name,
                `£${parseFloat(addon.discount_price).toFixed(2)}`,
                200
              )}
            </div>
          ))}
        {discount > 0 && (
          <div className={styles.discountRow}>
            {this.renderRow(
              'Discount',
              `- £${(discount / 100.0).toFixed(2)}`,
              200
            )}
          </div>
        )}
        <div className={styles.totalPriceRow}>
          {!isFullLicence ? (
            <React.Fragment>
              <div className={styles.priceLabel}>Total:</div>
              <div className={styles.totalPrice}>{`£${(price / 100).toFixed(
                2
              )}`}</div>
            </React.Fragment>
          ) : (
            <FullLicencePayment
              addons={addons}
              pricePerHour={price / trainings[0].package_hours}
              hours={trainings[0].package_hours}
              style={{ marginTop: '3px' }}
            />
          )}
        </div>
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
    const { courseType } = checkoutData
    let confirmDisabled =
      saving || !details.accept_terms || !this.isValidDate() || !showCardDetails
    const isFullLicence = checkoutData.courseType === 'FULL_LICENCE'
    const isRenewal = checkoutData.courseType === 'LICENCE_CBT_RENEWAL'
    const offersPOM = ['LICENCE_CBT_RENEWAL', 'LICENCE_CBT'].includes(
      courseType
    )

    const cancelGuarantee = isFullLicence
      ? '*Cancel up to 12 working days before your course to get a refund. Admin fees apply.'
      : '*Cancel up to 5 working days before your course to get a refund. Admin fees apply.'

    return (
      <div className={styles.container}>
        <div className={styles.whiteBox}>
          <div className={styles.hiddenOnMobile}>
            <div className={styles.titleWrapper}>
              <span className={styles.title}>Your Booking</span>
              <div className={styles.limitedWarning}>
                <span>Last few spaces</span>
              </div>
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
          {offersPOM ? (
            <POMSelector
              handlePOMToggleClick={handlePOMToggleClick}
              hasPOM={hasPOM}
            />
          ) : (
            <div className={styles.POMPlaceholder} />
          )}
          <div
            className={classnames(
              styles.acceptTermsWrapper,
              !showCardDetails && styles.acceptTermsWrapperHideMobile
            )}>
            <div className={classnames(styles.acceptTerms)}>
              <Checkbox
                checked={details.email_optin}
                extraClass="WidgetCheckbox"
                size="smallBlack"
                onChange={event =>
                  onDetailChange('email_optin', event.target.checked)
                }>
                <div style={{ fontSize: '15px' }}>
                  Sign up to get weekly ride outs, events & special offers
                </div>
              </Checkbox>
            </div>
            <div id="terms-checkbox" className={classnames(styles.acceptTerms)}>
              <Checkbox
                checked={details.accept_terms}
                extraClass="WidgetCheckbox"
                size="smallBlack"
                onChange={event =>
                  onDetailChange('accept_terms', event.target.checked)
                }>
                <div style={{ fontSize: '15px' }}>
                  I have read and agree to the{' '}
                  <a
                    href="https://www.rideto.com/terms"
                    rel="noopener noreferrer"
                    target="_blank">
                    terms and conditions
                  </a>{' '}
                  and for training I:
                </div>
              </Checkbox>
              <div className={styles.terms}>
                <ul>
                  <li>
                    Will present a valid UK Driving or Provisional licence
                  </li>
                  <li>
                    Or a Full EU licence with UK counterpart licence number
                  </li>
                  <li>Can read a registration plate from 20.5 metres</li>
                  <li>Can speak and understand English & the Highway Code</li>
                  <li>Can ride an adult size bicycle</li>
                  <li>
                    Will wear suitable clothing including heavy denim jeans and
                    boots
                  </li>
                  {isRenewal && <li>Will bring my valid CBT Certificate</li>}
                  {isFullLicence && (
                    <Fragment>
                      <li>Have a valid CBT certificate</li>
                      <li>Have a valid motorcycle theory certificate</li>
                    </Fragment>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <hr style={{ width: '100%', marginTop: '0.5rem', marginBottom: 0 }} />
          {this.renderPrices(isFullLicence)}
          {errors.paymentError && (
            <div className={styles.paymentError}>
              {typeof errors.paymentError === 'string' ? (
                <strong>{errors.paymentError}</strong>
              ) : (
                Object.entries(errors.paymentError).map(entry => (
                  <div>
                    <strong>
                      {capitalizeFirstLetter(entry[0].replace('_', ' '))}:{' '}
                      {entry[1]}
                    </strong>
                  </div>
                ))
              )}
            </div>
          )}
          <PromoCode
            voucher_code={voucher_code}
            loadingPrice={loadingPrice}
            handleVoucherApply={handleVoucherApply}
            onChange={onChange}
          />
          <Loading loading={saving}>
            <RideToButton
              className={classnames(
                styles.action,
                confirmDisabled && styles.confirmDisabled
              )}
              onClick={() => this.isValidDate() && onSubmit()}>
              <span>Confirm And Pay</span>
              <img src={ButtonArrowWhite} alt="arrow" />
            </RideToButton>
          </Loading>
          <div
            className={classnames(
              styles.cards,
              instantBook && styles.cardsInstant
            )}>
            <PoweredByStripe fill="#141414" opacity="1" />
            <CardIcons size="large" />
          </div>
          {!this.isValidDate() && (
            <div className={styles.dateError}>
              Bookings for the next day must be made before 5:30pm. Please
              return to the results page to pick a later date.
            </div>
          )}
          {!instantBook && !isFullLicence && (
            <div id="terms-conditions-section" className={styles.information}>
              <p>
                You won't be charged until your booking is confirmed, we'll just
                reserve the amount on your card. Bookings require confirmation
                from the instructor, usually within {isFullLicence ? '24' : '3'}{' '}
                working hours.
              </p>
            </div>
          )}
        </div>

        <div className={styles.sectionFooter}>
          <div className={styles.whiteBox}>
            <div className={styles.boxShadow}>
              <div className={styles.title} style={{ marginBottom: '1rem' }}>
                MONEY BACK GUARANTEE
              </div>
              <div className={styles.guaranteeInfo}>
                <div className={styles.guaranteeLogo}>
                  <img alt="" src={moneyBack} />
                </div>
                <div className={styles.guarenteeContent}>
                  <div className={styles.guarantee1}>{cancelGuarantee}</div>
                  <a
                    href="https://www.rideto.com/terms#cancellations"
                    className={styles.guarantee2}
                    target="_blank"
                    rel="noopener noreferrer">
                    More Details
                  </a>
                </div>
              </div>
              <div
                className={classnames('trustpilot-widget', styles.headerTrust)}
                style={{ marginLeft: '-10px' }}
                data-locale="en-GB"
                data-template-id="5419b6a8b0d04a076446a9ad"
                data-businessunit-id="59832d5f0000ff0005a80d6b"
                data-style-height="24px"
                data-style-width="270px"
                data-theme="light">
                <a
                  href="https://uk.trustpilot.com/review/rideto.com"
                  target="_blank"
                  rel="noopener noreferrer">
                  Trustpilot
                </a>
              </div>
              <Script url="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" />
            </div>
          </div>

          <div className={styles.whiteBox}>
            <div className={styles.title} style={{ marginBottom: '1.5rem' }}>
              Frequently asked questions
            </div>
            <CourseTypeDetails
              courseType={{ details: FAQS }}
              minimal
              useKeysAsTitle
              fullLicenceFaqs
            />
          </div>
        </div>
      </div>
    )
  }
}

export default OrderSummary
