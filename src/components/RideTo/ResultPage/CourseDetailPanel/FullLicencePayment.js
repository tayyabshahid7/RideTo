import React from 'react'
import styles from './FullLicencePayment.scss'
import { calcFullLicencePrices } from 'services/course'

function FullLicencePayment({ pricePerHour, hours, style, isWidget }) {
  if (!hours) {
    return null
  }

  const [now, later] = calcFullLicencePrices(pricePerHour, hours)

  return (
    <div className={styles.container} style={style}>
      <div className={styles.row}>
        <span className={styles.payToday}>Pay today</span>{' '}
        <span className={styles.payTodayPrice}>Only £{now}</span>
      </div>
      <div className={styles.row}>
        <span>To pay after your first lesson</span> <span>£{later}</span>
      </div>
    </div>
  )
}

export default FullLicencePayment
