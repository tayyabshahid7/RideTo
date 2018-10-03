import React, { Component } from 'react'
import moment from 'moment'

import classnames from 'classnames'
import styles from './styles.scss'
import RideToButton from 'components/RideTo/Button'
import ButtonArrowWhite from 'assets/images/rideto/ButtonArrowWhite.svg'
import IconMoneyBack from 'assets/icons/IconMoneyBack.svg'
import { getCourseTitle } from 'services/course'

class OrderSummary extends Component {
  renderRow(title, content, priceHighlight = false) {
    return (
      <div className={styles.rowItem}>
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
    const { checkoutData } = this.props
    const { courseType, date, postcode } = checkoutData
    return (
      <div className={styles.rowContainer}>
        {this.renderRow('Course', getCourseTitle(courseType))}
        {this.renderRow('Date & Time', moment(date).format('ddd D, MMMM'))}
        {this.renderRow('Location', postcode)}
      </div>
    )
  }

  renderPrices() {
    const { checkoutData } = this.props
    const { addons } = checkoutData
    let price = 0
    addons.forEach(addon => {
      price += parseFloat(addon.price)
    })
    return (
      <div className={styles.rowContainer}>
        {addons.map(addon =>
          this.renderRow(
            addon.selectedSize
              ? `${addon.name} (${addon.selectedSize})`
              : addon.name,
            `£${addon.price}`
          )
        )}
        {this.renderRow('Order Total', `£${price.toFixed(2)}`, true)}
      </div>
    )
  }

  render() {
    const { onSubmit } = this.props

    let confirmDisabled = false

    return (
      <div className={styles.container}>
        <div className={styles.title}>Order Summary</div>
        {this.renderCourseInformation()}
        <hr />
        {this.renderPrices()}
        <RideToButton
          className={classnames(
            styles.action,
            confirmDisabled && styles.confirmDisabled
          )}
          onClick={() => !confirmDisabled && onSubmit()}>
          <span>Confirm And Pay</span>
          <img src={ButtonArrowWhite} alt="arrow" />
        </RideToButton>
        <div className={styles.information}>
          <p>
            By placing your oder you confirm you have read and accept RideTo's
            terms &amp; conditions and agree to RideTo's condition of use &
            sale.
          </p>
          <p>
            You won't be charged until your booking is confirmed, we'll just
            reserve the amount on your card. Bookings require confirmation from
            the instructor, usually within 3 working hours.
          </p>
        </div>
        <hr className={styles.hr} />
        <div className={styles.guaranteeInfo}>
          <div className={styles.guaranteeLogo}>
            <img src={IconMoneyBack} alt="money-back" />
          </div>
          <div className={styles.guarenteeContent}>
            <div className={styles.guarantee1}>
              Cancel within 3 working days to get a full refund on your booking
            </div>
            <a
              href="https://www.google.com"
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
