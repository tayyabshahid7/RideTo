import React from 'react'
import { calcFullLicencePrices } from 'services/course'
import styles from './FullLicencePayment.scss'

function FullLicencePayment({ pricePerHour, hours, style, isWidget, addons }) {
  if (!hours) {
    return null
  }

  const [now, later] = calcFullLicencePrices(pricePerHour, hours, addons)

  return (
    <div className={styles.container} style={style}>
      <div className={styles.row}>
        <span className={styles.payToday}>Pay today</span>{' '}
        <span className={styles.payTodayPrice}>Only £{now}</span>
      </div>
      <div className={styles.row}>
        <span>To pay after booking your first lesson</span>{' '}
        <span>£{later}</span>
      </div>
      <br />
      <div className={styles.rowReserved}>
        <span>
          We’ll reserve the full amount on your card upon booking, once your
          course dates are confirmed the full amount will then be charged.
        </span>
      </div>
    </div>
  )
}

export default FullLicencePayment
